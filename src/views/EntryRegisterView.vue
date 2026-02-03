<template>
  <div class="entry-register-container">
    <div class="top-section">
      <div class="robot-status">주차로봇 대기중</div>
    </div>
    <div class="middle-section">
      <ParkingMap />
    </div>
    <div class="bottom-section">
      <div class="content-wrap">
        <div class="complete-panel">
          <div class="plate-box">{{ formattedPlate }}</div>
          <div class="entry-title">입 차 를 진 행 합 니 다</div>
          <div class="entry-warning">※ 주차완료 전까지 출차 불가</div>
        </div>
      </div>

      <div class="action-bar">
        <button type="button" class="prev-btn" @click="goBack">이전</button>
        <button type="button" class="enter-btn" @click="enter">입차하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import ParkingMap from '@/components/ParkingMap.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getParkedCars, getParkingMap } from '@/api/modules/public'

export default {
  name: 'EntryRegisterView',
  components: {
    ParkingMap
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const plateRaw = route.query.plate
    const plateFromQuery = Array.isArray(plateRaw) ? plateRaw[0] : plateRaw
    const plate = ref((plateFromQuery ?? '').toString())

    const vehicleIdRaw = route.query.vehicleId
    const vehicleIdValue = Array.isArray(vehicleIdRaw) ? vehicleIdRaw[0] : vehicleIdRaw

    const fetchPlateByVehicleId = async () => {
      const parsed = Number(vehicleIdValue)
      if (!Number.isFinite(parsed)) return

      try {
        const res = await getParkedCars(parsed)
        const data = res?.data?.data
        const parked = Array.isArray(data) ? data[0] : data
        if (parked?.plate) plate.value = parked.plate
      } catch (e) {
        if (import.meta.env.DEV) console.warn('차량번호 조회 실패:', e)
      }
    }

    const formattedPlate = computed(() => {
      const v = (plate.value ?? '').toString().trim()
      return v ? v.split('').join(' ') : ''
    })

    onMounted(() => {
      if (!plate.value) fetchPlateByVehicleId()
    })

    const goBack = () => {
      router.go(-1)
    }

    const SLOT_CODES_BY_INDEX = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4']

    const enter = async () => {
      const parsed = Number(vehicleIdValue)
      let parkingMapData = null
      let assignedSlotCode = null
      try {
        const res = await getParkingMap()
        const list = res?.data?.data ?? res?.data ?? []
        if (Array.isArray(list) && list.length >= 12) {
          parkingMapData = list
          const firstEmpty = list.findIndex((s) => s.slotStatus !== 'OCCUPIED')
          if (firstEmpty !== -1 && firstEmpty < SLOT_CODES_BY_INDEX.length) {
            assignedSlotCode = SLOT_CODES_BY_INDEX[firstEmpty]
          }
        }
      } catch (e) {
        if (import.meta.env.DEV) console.warn('맵 데이터 조회 실패:', e)
      }
      router.push({
        path: '/entry/complete',
        query: {
          ...(Number.isFinite(parsed) ? { vehicleId: String(parsed) } : {}),
          ...(plate.value ? { plate: plate.value } : {})
        },
        state: parkingMapData
          ? { parkingMapData, assignedSlotCode }
          : assignedSlotCode
            ? { assignedSlotCode }
            : {}
      })
    }

    return {
      formattedPlate,
      goBack,
      enter
    }
  }
}
</script>

<style scoped>
.entry-register-container {
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
  align-items: flex-start;
  justify-content: space-between;
  min-height: 0;
}

.content-wrap {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-24px); /* 세로 중앙보다 살짝 위 */
}

.complete-panel {
  width: 100%;
  max-width: 760px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  box-sizing: border-box;
  padding: clamp(28px, 6vw, 56px) clamp(16px, 4vw, 32px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(18px, 4.5vw, 34px);
}

.plate-box {
  width: min(520px, 100%);
  border: 2px solid var(--color-teal-light);
  border-radius: var(--radius-btn);
  background: var(--bg-card);
  height: 60px;
  padding: 0 18px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 700;
  font-size: clamp(20px, 5vw, 32px);
  letter-spacing: 0.08em;
  color: var(--text-primary);
}

.entry-title {
  color: var(--color-teal);
  font-weight: 800;
  font-size: clamp(22px, 6vw, 40px);
  letter-spacing: 0.18em;
  text-align: center;
}

.entry-warning {
  color: var(--color-error);
  font-weight: 800;
  font-size: clamp(18px, 5vw, 34px);
  letter-spacing: 0.12em;
  text-align: center;
}

.action-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.enter-btn {
  background: var(--gradient-primary);
  color: #fff;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--radius-btn);
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
}
.enter-btn:hover {
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

  .content-wrap {
    transform: translateY(-14px);
  }

  .complete-panel {
    padding: 22px 14px;
  }

  .plate-box {
    font-size: 45px;
  }

  .prev-btn,
  .enter-btn {
    padding: 10px 20px;
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

  .content-wrap {
    transform: translateY(-18px);
  }

  .complete-panel {
    padding: 34px 18px;
  }

  .prev-btn,
  .enter-btn {
    padding: 11px 22px;
    font-size: 15px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .entry-register-container {
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

  .content-wrap {
    transform: translateY(-22px);
  }

  .complete-panel {
    padding: 56px 24px;
  }

  .prev-btn,
  .enter-btn {
    padding: 14px 28px;
    font-size: 18px;
  }
}
</style>
