<template>
  <div class="entry-list-container">
    <!-- 상단 섹션 -->
    <div class="top-section">
      <div class="robot-status">주차로봇 대기중</div>
    </div>

    <!-- 중간 섹션 (주차장 맵) -->
    <div class="middle-section">
      <ParkingMap />
    </div>

    <!-- 하단 섹션 (차량 카드 리스트) -->
    <div class="bottom-section">
      <div class="list-panel" :class="{ 'is-empty': cars.length === 0 }">
        <div v-if="cars.length === 0" class="empty-panel">
          <div class="empty-text error">등록 대기 차량이 없습니다</div>
        </div>

        <div v-else class="card-list">
          <button
            v-for="car in cars"
            :key="car.vehicleId"
            type="button"
            class="car-card"
            @click="selectCar(car)"
          >
            {{ car.plate }}
          </button>
        </div>
      </div>

      <button type="button" class="prev-btn" @click="goBack">이전</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ParkingMap from '@/components/ParkingMap.vue'

export default {
  name: 'EntryListView',
  components: {
    ParkingMap
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const vehicleFourNumberRaw = route.query.vehicleFourNumber
    const vehicleFourNumber =
      Array.isArray(vehicleFourNumberRaw) ? vehicleFourNumberRaw[0] : vehicleFourNumberRaw

    // TODO: 백엔드 등록대기차량 API 연동 후 조회
    const cars = ref([])

    const selectCar = (car) => {
      router.push({
        path: '/entry/register',
        query: { vehicleId: car.vehicleId }
      })
    }

    const goBack = () => {
      router.push({
        path: '/select',
        query: vehicleFourNumber ? { vehicleFourNumber } : {}
      })
    }

    return {
      cars,
      selectCar,
      goBack
    }
  }
}
</script>

<style scoped>
.entry-list-container {
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

.list-panel {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.list-panel.is-empty {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.empty-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  min-height: 0;
}

.empty-text {
  text-align: center;
  font-size: clamp(22px, 5vw, 40px);
  font-weight: 800;
  letter-spacing: 0.18em;
  color: var(--text-primary);
}

.empty-text.error {
  color: var(--color-error);
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}

.car-card {
  width: min(1104px, 98%);
  height: 75px;
  border: 2px solid var(--border-light);
  background: var(--bg-card);
  padding: 4px 20px;
  font-size: 35px;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--text-primary);
  cursor: pointer;
  box-sizing: border-box;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.car-card:hover {
  border-color: var(--color-teal-light);
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.2);
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

  .list-panel {
    padding: 12px;
  }

  .car-card {
    padding: 4px 20px;
    font-size: 35px;
  }

  .prev-btn {
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

  .list-panel {
    padding: 16px;
  }

  .car-card {
    padding: 4px 20px;
    font-size: 35px;
  }

  .prev-btn {
    padding: 11px 22px;
    font-size: 15px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .entry-list-container {
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

  .list-panel {
    padding: 24px;
  }

  .car-card {
    padding: 4px 20px;
    font-size: 35px;
  }

  .prev-btn {
    padding: 14px 28px;
    font-size: 18px;
  }
}
</style>
