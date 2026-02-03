<template>
  <div class="select-container">
    <!-- 상단 섹션 -->
    <div class="top-section">
      <div class="robot-status">주차로봇 대기중</div>
    </div>

    <!-- 중간 섹션 -->
    <div class="middle-section">
      <ParkingMap />
    </div>

    <!-- 하단 섹션 - 버튼 영역 -->
    <div class="bottom-section">
      <div class="action-panel">
        <div class="button-container">
          <button @click="goToExitList" class="action-btn exit-btn">
            조회 / 출차
          </button>
          <button @click="goToEntryList" class="action-btn entry-btn">
            입차
          </button>
        </div>
      </div>
      <button @click="goToHome" class="prev-btn">이전</button>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import ParkingMap from '@/components/ParkingMap.vue'

export default {
  name: 'SelectView',
  components: {
    ParkingMap
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const goToExitList = () => {
      router.push({
        path: '/exit/list',
        query: { vehicleFourNumber: route.query.vehicleFourNumber }
      })
    }

    const goToEntryList = () => {
      router.push({
        path: '/entry/list',
        query: { vehicleFourNumber: route.query.vehicleFourNumber }
      })
    }

    const goToHome = () => {
      router.push('/')
    }

    return {
      goToExitList,
      goToEntryList,
      goToHome
    }
  }
}
</script>

<style scoped>
.select-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100svh;
  height: 100dvh;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
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

.status-banner {
  border: 1px solid #000;
  padding: 16px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
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

.action-panel {
  width: 100%;
  flex: 1;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(28px, 7vw, 60px) clamp(16px, 4vw, 32px);
  box-sizing: border-box;
  border-radius: var(--radius-card);
}

.button-container {
  display: flex;
  gap: clamp(28px, 8vw, 80px);
  justify-content: center;
  width: 100%;
  max-width: 520px;
}

.action-btn {
  width: clamp(140px, 26vw, 190px);
  aspect-ratio: 1;
  border: none;
  background: var(--gradient-primary);
  color: #fff;
  font-size: clamp(20px, 5vw, 30px);
  font-weight: bold;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: pre-line;
  border-radius: var(--radius-card);
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
  transition: box-shadow 0.2s;
}
.action-btn:hover {
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45);
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

  .status-banner {
    padding: 12px;
    font-size: 14px;
  }

  .bottom-section {
    padding: 12px;
    gap: 12px;
  }

  .action-panel {
    padding: 22px 14px;
    border-radius: 8px;
  }

  /* clamp로 자동 스케일되지만, 모바일에서 버튼이 너무 커지는 것 방지 */
  .action-btn {
    max-width: 150px;
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

  .status-banner {
    padding: 14px;
  }

  .bottom-section {
    padding: 16px;
    gap: 14px;
  }

  /* clamp로 자동 스케일 */
  .action-panel {
    padding: 34px 18px;
  }

  .prev-btn {
    padding: 11px 22px;
    font-size: 15px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .select-container {
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

  .status-banner {
    padding: 18px;
    font-size: 16px;
  }

  .bottom-section {
    padding: 24px;
    gap: 18px;
  }

  /* clamp로 자동 스케일 */
  .action-panel {
    padding: 56px 24px;
  }

  .prev-btn {
    padding: 14px 28px;
    font-size: 18px;
  }
}
</style>