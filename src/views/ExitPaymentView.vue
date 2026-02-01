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

    <!-- 결제 실패 모달 -->
    <Teleport to="body">
      <div v-if="showPaymentFailModal" class="payment-fail-overlay" @click.self="closePaymentFailModal">
        <div class="payment-fail-modal">
          <div class="payment-fail-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L1 21h22L12 2z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M12 9v4M12 17h.01"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <h2 class="payment-fail-title">결제에 실패했습니다.</h2>
          <p class="payment-fail-message">
            일시적인 오류로 결제를 진행할 수 없습니다.<br>다시 시도해 주세요.
          </p>
          <button type="button" class="payment-fail-retry-btn" @click="closePaymentFailModal">
            다시 시도
          </button>
        </div>
      </div>
    </Teleport>

    <!-- 결제 완료 모달 -->
    <Teleport to="body">
      <div v-if="showPaymentSuccessModal" class="payment-success-overlay">
        <div class="payment-success-modal">
          <div class="payment-success-confetti" aria-hidden="true">
            <span class="confetti confetti--1"></span>
            <span class="confetti confetti--2"></span>
            <span class="confetti confetti--3"></span>
            <span class="confetti confetti--4"></span>
            <span class="confetti confetti--5"></span>
            <span class="confetti confetti--6"></span>
            <span class="confetti confetti--7"></span>
            <span class="confetti confetti--8"></span>
          </div>
          <div class="payment-success-icon" aria-hidden="true">
            <span class="payment-success-icon-outer">
              <span class="payment-success-icon-inner">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </span>
          </div>
          <h2 class="payment-success-title">결제가 완료되었습니다</h2>
          <p class="payment-success-message">
            출차 등록이 완료되었습니다.<br>
            출차 구역에서 차량을 대기해주세요.<br>
            이용해 주셔서 감사합니다.
          </p>
          <button type="button" class="payment-success-btn" @click="closePaymentSuccessModal">
            확인
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ParkingMap from '@/components/ParkingMap.vue'
import { getRegisterCars, getParkedCars, getParkingMap } from '@/api/modules/public'
import { preparePayment } from '@/api/modules/payment'

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
    /** 결제 실패 모달 표시 여부 */
    const showPaymentFailModal = ref(false)
    /** 결제 완료 모달 표시 여부 */
    const showPaymentSuccessModal = ref(false)
    /** 결제 성공 시 완료 페이지로 넘길 데이터 */
    const paymentSuccessData = ref(null)
    /** 결제 완료 모달 5초 자동 닫기 타이머 ID */
    let successModalAutoCloseTimer = null
    /** 페이지 20초 경과 시 홈으로 이동 타이머 ID */
    let pageIdleRedirectTimer = null
    /** RegisterCar.status (PARKING | WAITING | MOVING) - 문구 표시 판단용 */
    const registerCarStatus = ref('')

    onMounted(async () => {
      // exit/payment 페이지 진입 후 20초 경과 시 홈으로 이동
      pageIdleRedirectTimer = setTimeout(() => {
        router.push('/')
      }, 20000)

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
      // PortOne SDK 로드 확인
      if (!window.PortOne) {
        alert('PortOne SDK가 로드되지 않았습니다. index.html에 스크립트 추가했는지 확인하세요.')
        return
      }

      if (!parkedCar.value?.vehicleId) {
        alert('차량 정보를 확인할 수 없습니다.')
        return
      }

      try {
        // 1) 백엔드 결제 준비 API → paymentId, amount 획득
        const prepareRes = await preparePayment({
          vehicleId: parkedCar.value.vehicleId
        })
        const payload = prepareRes?.data?.data ?? prepareRes?.data
        const paymentId = payload?.paymentId
        const amount = payload?.amount

        if (!paymentId || amount == null) {
          alert('결제 준비에 실패했습니다. 다시 시도해주세요.')
          return
        }

        const storeId = import.meta.env.VITE_STORE_ID
        const channelKey = import.meta.env.VITE_CHANNEL_KEY
        if (!storeId || !channelKey) {
          alert('결제 설정이 올바르지 않습니다. (VITE_STORE_ID, VITE_CHANNEL_KEY)')
          return
        }

        const webhookUrl = import.meta.env.VITE_PAYMENT_WEBHOOK_URL
        const noticeUrls = webhookUrl ? [webhookUrl] : []

        // 2) 결제창 호출
        const response = await window.PortOne.requestPayment({
          storeId,
          channelKey,
          paymentId,
          orderName: '주차 정산',
          totalAmount: Number(amount),
          currency: 'CURRENCY_KRW',
          payMethod: 'EASY_PAY',
          easyPay: { easyPayProvider: 'EASY_PAY_PROVIDER_KAKAOPAY' },
          bypass: { kakaopay: { custom_message: '주차정산 결제' } },
          noticeUrls
        })

        if (response?.code == null) {
          // 결제 성공 → 완료 모달 표시 후 확인 시 완료 페이지로
          let parkingMapData = null
          try {
            const mapRes = await getParkingMap()
            const list = mapRes?.data?.data ?? mapRes?.data ?? []
            if (Array.isArray(list) && list.length >= 12) parkingMapData = list
          } catch (e) {
            if (import.meta.env.DEV) console.warn('맵 데이터 조회 실패:', e)
          }
          paymentSuccessData.value = {
            paymentResult: response,
            parkingMapData: parkingMapData ?? undefined
          }
          showPaymentSuccessModal.value = true
          successModalAutoCloseTimer = setTimeout(() => {
            closePaymentSuccessModal()
          }, 5000)
        } else {
          if (response?.code !== 'PAYMENT_CANCELED') {
            showPaymentFailModal.value = true
          }
        }
      } catch (e) {
        if (import.meta.env.DEV) console.error('결제 오류:', e)
        showPaymentFailModal.value = true
      }
    }

    const closePaymentFailModal = () => {
      showPaymentFailModal.value = false
    }

    const closePaymentSuccessModal = () => {
      if (successModalAutoCloseTimer != null) {
        clearTimeout(successModalAutoCloseTimer)
        successModalAutoCloseTimer = null
      }
      showPaymentSuccessModal.value = false
      paymentSuccessData.value = null
      router.push('/')
    }

    onBeforeUnmount(() => {
      if (successModalAutoCloseTimer != null) {
        clearTimeout(successModalAutoCloseTimer)
      }
      if (pageIdleRedirectTimer != null) {
        clearTimeout(pageIdleRedirectTimer)
      }
    })

    return {
      parkedCar,
      loading,
      loadError,
      showPaymentFailModal,
      showPaymentSuccessModal,
      formattedEntryAt,
      formattedAmount,
      vehicleStatus,
      goBack,
      goHome,
      pay,
      closePaymentFailModal,
      closePaymentSuccessModal
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
  padding-top: 26px;
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
    padding-top: 20px;
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
    padding-top: 23px;
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
    padding-top: 26px;
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

/* 결제 실패 모달 (Teleport로 body에 렌더) */
.payment-fail-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.5);
}

.payment-fail-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 360px;
  height: 400px;
  padding: 40px 24px 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
}

.payment-fail-icon {
  width: 56px;
  height: 56px;
  color: #e53935;
  margin-bottom: 20px;
}

.payment-fail-icon svg {
  width: 100%;
  height: 100%;
}

.payment-fail-title {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
}

.payment-fail-message {
  margin: 0 0 40px;
  font-size: 15px;
  font-weight: 400;
  color: #666;
  line-height: 1.5;
}

.payment-fail-retry-btn {
  width: 100%;
  max-width: 280px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: #0a6efd;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
}

.payment-fail-retry-btn:hover {
  background: #095ad4;
}

/* 결제 완료 모달 (실패 모달과 동일 크기 360x400) */
.payment-success-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.5);
}

.payment-success-modal {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 360px;
  height: 400px;
  padding: 40px 24px 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  overflow: visible;
}

.payment-success-confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 12px;
}

.confetti {
  position: absolute;
  width: 8px;
  height: 10px;
  border-radius: 1px;
}

.confetti--1 { top: 8%; left: 10%; background: #00897b; transform: rotate(-15deg); }
.confetti--2 { top: 12%; right: 12%; background: #ffd54f; transform: rotate(20deg); }
.confetti--3 { top: 18%; left: 6%; background: #e91e63; transform: rotate(10deg); }
.confetti--4 { bottom: 20%; left: 8%; background: #212121; transform: rotate(-25deg); }
.confetti--5 { bottom: 15%; right: 10%; background: #00897b; transform: rotate(15deg); }
.confetti--6 { bottom: 25%; right: 6%; background: #ffd54f; transform: rotate(-10deg); }
.confetti--7 { top: 45%; left: 4%; background: #e91e63; transform: rotate(5deg); }
.confetti--8 { top: 50%; right: 5%; background: #212121; transform: rotate(-20deg); }

.payment-success-icon {
  margin-bottom: 20px;
}

.payment-success-icon-outer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  background: #e0f2f1;
  border-radius: 50%;
}

.payment-success-icon-inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: #00c853;
  border-radius: 50%;
  color: #fff;
}

.payment-success-icon-inner svg {
  width: 28px;
  height: 28px;
}

.payment-success-title {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
}

.payment-success-message {
  margin: 0 0 40px;
  font-size: 15px;
  font-weight: 400;
  color: #666;
  line-height: 1.6;
}

.payment-success-btn {
  width: 100%;
  max-width: 280px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: #0a6efd;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
}

.payment-success-btn:hover {
  background: #095ad4;
}
</style>
