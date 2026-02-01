<template>
  <div class="exit-payment-container">
    <!-- 상단 섹션 -->
    <div class="top-section">
      <div class="robot-status">주차로봇 대기중</div>
    </div>

    <!-- 중간 섹션 -->
    <div class="middle-section">
      <ParkingMap
        :highlighted-slot-code="parkedCar?.nodeCode ?? null"
        highlight-variant="teal"
      />
    </div>

    <!-- 하단 섹션 -->
    <div
      class="bottom-section"
      :class="{ 'bottom-section--waiting-moving': vehicleStatus === 'WAITING' || vehicleStatus === 'MOVING' }"
    >
      <!-- WAITING / MOVING 일 때만 차량번호 카드 + 상태 문구 표시 (PARKING이면 정산표만) -->
      <template v-if="!loading && !loadError && parkedCar && (vehicleStatus === 'WAITING' || vehicleStatus === 'MOVING')">
        <div class="vehicle-card">{{ parkedCar.plate }}</div>
        <div class="status-message">
          <template v-if="vehicleStatus === 'MOVING'">
            {{ parkedCar.nodeCode }} 위치에 주차중 입니다
          </template>
          <template v-else>
            {{ parkedCar.nodeCode }} 위치에 주차 예정입니다
          </template>
        </div>
      </template>

      <!-- 차량 정보 표 (PARKING일 때만 표시) -->
      <div v-if="vehicleStatus === 'PARKING'" class="info-panel">
        <div v-if="loading" class="info-loading">조회 중...</div>
        <div v-else-if="loadError" class="info-error">{{ loadError }}</div>
        <template v-else>
          <div class="info-row">
            <div class="info-label">차량번호</div>
            <div class="info-value">{{ parkedCar?.plate ?? '' }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">입차시각</div>
            <div class="info-value">{{ formattedEntryAt }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">주차시간</div>
            <div class="info-value">{{ parkedCar?.parkedTime ?? '' }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">주차금액</div>
            <div class="info-value">{{ formattedAmount }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">주차위치</div>
            <div class="info-value">{{ parkedCar?.nodeCode ?? '' }}</div>
          </div>
        </template>
      </div>

      <div class="action-bar">
        <button type="button" class="prev-btn" @click="goBack">이전</button>
        <button
          v-if="vehicleStatus === 'PARKING'"
          type="button"
          class="pay-btn"
          @click="pay"
        >
          정산하기
        </button>
        <button
          v-else
          type="button"
          class="pay-btn"
          @click="goHome"
        >
          처음으로
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ParkingMap from '@/components/ParkingMap.vue'
import { getRegisterCars, getParkedCars, getParkingMap } from '@/api/modules/public'

export default {
  name: 'ExitPaymentView',
  components: {
    ParkingMap
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const parkedCar = ref(null)
    const loading = ref(true)
    const loadError = ref('')
    /** RegisterCar.status (PARKING | WAITING | MOVING) - 문구 표시 판단용 */
    const registerCarStatus = ref('')

    onMounted(async () => {
      // 1) 라우트 state로 전달된 ParkedCar가 있으면 사용 (직접 넘긴 경우)
      const stateCar = history.state?.parkedCar
      if (stateCar && stateCar.vehicleId != null) {
        parkedCar.value = stateCar
        registerCarStatus.value = history.state?.registerCarStatus ?? 'PARKING'
        loading.value = false
        return
      }

      // 2) register-vehicles로 먼저 조회 후 status별 분기
      const vehicleFourNumberRaw = route.query.vehicleFourNumber
      const vehicleFourNumber =
        Array.isArray(vehicleFourNumberRaw) ? vehicleFourNumberRaw[0] : vehicleFourNumberRaw
      const vehicleIdRaw = route.query.vehicleId
      const vehicleId = Array.isArray(vehicleIdRaw) ? vehicleIdRaw[0] : vehicleIdRaw

      if (!vehicleFourNumber || String(vehicleFourNumber).length !== 4) {
        loadError.value = '차량 번호 4자리를 확인해주세요.'
        loading.value = false
        return
      }
      if (!vehicleId) {
        loadError.value = '차량 정보를 찾을 수 없습니다.'
        loading.value = false
        return
      }

      try {
        const registerRes = await getRegisterCars(String(vehicleFourNumber))
        const registerList = registerRes?.data?.data ?? registerRes?.data ?? []
        const list = Array.isArray(registerList) ? registerList : [registerList]
        const targetId = Number(vehicleId)
        const registerCar = list.find((c) => c && Number(c.vehicleId) === targetId)

        if (!registerCar) {
          loadError.value = '해당 차량 정보를 찾을 수 없습니다.'
          loading.value = false
          return
        }

        const status = String(registerCar.status || '').toUpperCase()
        registerCarStatus.value = status

        if (status === 'PARKING') {
          // PARKING: /parking/vehicle로 상세 조회
          const res = await getParkedCars(targetId)
          const data = res?.data?.data
          if (Array.isArray(data) && data.length > 0) {
            parkedCar.value = data[0]
          } else if (data && !Array.isArray(data)) {
            parkedCar.value = data
          } else {
            loadError.value = '차량 상세 정보를 불러올 수 없습니다.'
          }
        } else {
          // WAITING / MOVING: /parking/vehicle로 ParkedCar 조회 (nodeCode 포함)
          try {
            const res = await getParkedCars(targetId)
            const data = res?.data?.data
            const parkedData = Array.isArray(data) && data.length > 0 ? data[0] : data && !Array.isArray(data) ? data : null
            parkedCar.value = parkedData
              ? { ...parkedData, plate: parkedData.plate ?? registerCar.plate }
              : {
                  vehicleId: registerCar.vehicleId,
                  plate: registerCar.plate ?? '',
                  nodeCode: '',
                  entryAt: '',
                  totalMin: 0,
                  amount: 0,
                  parkedTime: '',
                  status: registerCar.status
                }
          } catch (vehicleErr) {
            parkedCar.value = {
              vehicleId: registerCar.vehicleId,
              plate: registerCar.plate ?? '',
              nodeCode: '',
              entryAt: '',
              totalMin: 0,
              amount: 0,
              parkedTime: '',
              status: registerCar.status
            }
          }
        }
      } catch (e) {
        const status = e?.response?.status
        loadError.value =
          status === 404
            ? '해당 차량 정보를 찾을 수 없습니다.'
            : '차량 정보 조회에 실패했습니다.'
        if (import.meta.env.DEV) console.warn(e)
      } finally {
        loading.value = false
      }
    })

    // 입차시각: 분까지만 표시 (예: 2026-01-21 04:00)
    const formattedEntryAt = computed(() => {
      if (!parkedCar.value?.entryAt) return ''
      const dateStr = parkedCar.value.entryAt
      try {
        const date = new Date(dateStr)
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        const h = String(date.getHours()).padStart(2, '0')
        const min = String(date.getMinutes()).padStart(2, '0')
        return `${y}-${m}-${d} ${h}:${min}`
      } catch {
        return dateStr.slice(0, 16).replace('T', ' ')
      }
    })

    // 주차금액: 천 단위 콤마 + 원 (예: 408,000원)
    const formattedAmount = computed(() => {
      if (parkedCar.value?.amount == null) return ''
      return `${Number(parkedCar.value.amount).toLocaleString()}원`
    })

    // 문구 표시 판단: RegisterCar.status 기준 (PARKING=문구 없음, WAITING/MOVING=문구 표시)
    const vehicleStatus = computed(() => {
      const s = registerCarStatus.value
      if (s === 'MOVING' || s === 'WAITING' || s === 'PARKING') return s
      return 'PARKING'
    })

    const goBack = () => {
      router.back()
    }

    const goHome = () => {
      router.push('/')
    }

    const pay = async () => {
      let parkingMapData = null
      try {
        const res = await getParkingMap()
        const list = res?.data?.data ?? res?.data ?? []
        if (Array.isArray(list) && list.length >= 12) parkingMapData = list
      } catch (e) {
        if (import.meta.env.DEV) console.warn('맵 데이터 조회 실패:', e)
      }
      router.push({
        path: '/exit/complete',
        state: parkingMapData ? { parkingMapData } : {}
      })
    }

    return {
      parkedCar,
      loading,
      loadError,
      formattedEntryAt,
      formattedAmount,
      vehicleStatus,
      goBack,
      goHome,
      pay
    }
  }
}
</script>

<style scoped>
.exit-payment-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  background: var(--bg-page);
}

.top-section {
  padding: 20px;
  padding-top: 80px;
  padding-left: 70px;
  padding-bottom: 0;
  width: 100%;
  box-sizing: border-box;
}

.robot-status {
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  padding: 20px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  color: var(--color-teal);
  font-weight: 700;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.middle-section {
  flex: 0 0 auto;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  min-height: auto;
}

.bottom-section {
  flex: 1;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  align-items: flex-start;
  justify-content: space-between;
}

.bottom-section--waiting-moving {
  padding-top: 125px;
}

/* exit/list car-card와 동일한 디자인 */
.vehicle-card {
  width: min(1104px, 80%);
  align-self: center;
  height: 75px;
  border: 2px solid var(--border-light);
  background: var(--bg-card);
  padding: 4px 20px;
  font-size: 35px;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--text-primary);
  box-sizing: border-box;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-message {
  width: 100%;
  font-size: 30px;
  font-weight: 600;
  color: var(--color-teal);
  text-align: center;
  letter-spacing: 0.18em;
  padding: 8px 0;
}

.info-panel {
  width: 100%;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  box-sizing: border-box;
  overflow: hidden;
  margin-top: 40px;
  background: var(--bg-card);
}

.info-loading,
.info-error {
  padding: 24px 16px;
  text-align: center;
  font-size: 21px;
  background: var(--bg-page);
  color: var(--text-primary);
}

.info-error {
  color: var(--color-error);
}

.info-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  border-top: 1px solid var(--border-light);
  height: 80px;
}

.info-row:first-child {
  border-top: none;
}

.info-label {
  background: var(--color-teal);
  color: #fff;
  font-weight: 700;
  font-size: 21px;
  padding: 0 16px;
  border-right: 1px solid var(--border-light);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-value {
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 21px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.prev-btn {
  background-color: var(--bg-card);
  color: var(--text-primary);
  border: 2px solid var(--border-light);
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--radius-btn);
  box-sizing: border-box;
  box-shadow: var(--shadow-card);
}
.prev-btn:hover {
  border-color: var(--color-teal-light);
}

.pay-btn {
  background: var(--gradient-primary);
  color: #fff;
  border: none;
  padding: 12px 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--radius-btn);
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
}
.pay-btn:hover {
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.45);
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .top-section {
    padding: 12px;
    padding-top: 64px;
    padding-left: 12px;
    padding-bottom: 0;
  }

  .robot-status {
    padding: 12px;
    font-size: 14px;
  }

  .middle-section {
    padding: 0 12px;
    gap: 0;
  }

  .bottom-section {
    padding: 12px;
    gap: 12px;
    justify-content: space-between;
  }

  .bottom-section--waiting-moving {
    padding-top: 125px;
  }

  .info-row {
    grid-template-columns: 120px 1fr;
  }

  .info-label {
    padding: 14px 10px;
    font-size: 18px; /* 14px 대비 약 +30% */
  }

  .info-value {
    font-size: 18px; /* 14px 대비 약 +30% */
  }

  .prev-btn,
  .pay-btn {
    padding: 10px 18px;
    font-size: 14px;
  }
}

/* 태블릿 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .top-section {
    padding: 16px;
    padding-top: 72px;
    padding-left: 16px;
    padding-bottom: 0;
  }

  .robot-status {
    padding: 16px;
  }

  .middle-section {
    padding: 0 16px;
  }

  .bottom-section {
    padding: 16px;
    gap: 14px;
    justify-content: space-between;
  }

  .bottom-section--waiting-moving {
    padding-top: 125px;
  }

  .info-row {
    grid-template-columns: 140px 1fr;
  }

  .info-label {
    padding: 0 12px;
    font-size: 20px; /* 16px 대비 약 +30% */
  }

  .info-value {
    font-size: 20px; /* 16px 대비 약 +30% */
  }

  .prev-btn,
  .pay-btn {
    padding: 11px 22px;
    font-size: 15px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .exit-payment-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .top-section {
    padding: 24px;
    padding-top: 96px;
    padding-left: 24px;
    padding-bottom: 0;
  }

  .robot-status {
    padding: 24px;
    font-size: 18px;
  }

  .middle-section {
    padding: 0 24px;
  }

  .bottom-section {
    padding: 24px;
    gap: 18px;
    justify-content: space-between;
  }

  .bottom-section--waiting-moving {
    padding-top: 125px;
  }

  .info-row {
    grid-template-columns: 180px 1fr;
  }

  .info-label {
    padding: 0 18px;
    font-size: 23px; /* 18px 대비 약 +30% */
  }

  .info-value {
    font-size: 23px; /* 18px 대비 약 +30% */
  }

  .prev-btn {
    padding: 14px 28px;
    font-size: 18px;
  }

  .pay-btn {
    padding: 14px 32px;
    font-size: 18px;
  }
}
</style>
