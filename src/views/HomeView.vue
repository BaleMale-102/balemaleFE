<template>
  <div class="home-container">
    <!-- 주차로봇 상태 표시 -->
    <div class="top-section">
      <div class="robot-status">주차로봇 대기중</div>
    </div>

    <!-- 주차장 맵 내 잔여 주차 수 표시 (일반/장애인/총 잔여수) -->
    <div class="middle-section">
      <ParkingMap />
    </div>

    <!-- 차량 번호 입력 키패드 -->
    <div class="bottom-section">
      <div class="keypad-container">
        <div class="input-fields">
          <input
            v-for="(digit, index) in inputDigits"
            :key="index"
            v-model="inputDigits[index]"
            type="text"
            maxlength="1"
            class="input-field"
          />
        </div>
        <div class="keypad">
        <div class="keypad-row">
          <button @click="inputNumber('1')" class="keypad-btn">1</button>
          <button @click="inputNumber('2')" class="keypad-btn">2</button>
          <button @click="inputNumber('3')" class="keypad-btn">3</button>
        </div>
        <div class="keypad-row">
          <button @click="inputNumber('4')" class="keypad-btn">4</button>
          <button @click="inputNumber('5')" class="keypad-btn">5</button>
          <button @click="inputNumber('6')" class="keypad-btn">6</button>
        </div>
        <div class="keypad-row">
          <button @click="inputNumber('7')" class="keypad-btn">7</button>
          <button @click="inputNumber('8')" class="keypad-btn">8</button>
          <button @click="inputNumber('9')" class="keypad-btn">9</button>
        </div>
        <div class="keypad-row">
          <button @click="deleteDigit" class="keypad-btn delete-btn">← X</button>
          <button @click="inputNumber('0')" class="keypad-btn">0</button>
          <button @click="confirm" class="keypad-btn">확인</button>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ParkingMap from '@/components/ParkingMap.vue'

export default {
  name: 'HomeView',
  components: {
    ParkingMap
  },
  setup() {
    const router = useRouter()
    const inputDigits = ref(['', '', '', ''])

    const inputNumber = (num) => {
      const emptyIndex = inputDigits.value.findIndex(digit => digit === '')
      if (emptyIndex !== -1) {
        inputDigits.value[emptyIndex] = num
      }
    }

    const deleteDigit = () => {
      for (let i = inputDigits.value.length - 1; i >= 0; i--) {
        if (inputDigits.value[i] !== '') {
          inputDigits.value[i] = ''
          break
        }
      }
    }

    const confirm = () => {
      const code = inputDigits.value.join('')
      if (code.length === 4) {
        // 4자리 입력 완료 → 선택 화면으로 이동 (조회/출차/입차 선택)
        router.push({
          path: '/select',
          query: { vehicleFourNumber: code }
        })
      }
    }

    return {
      inputDigits,
      inputNumber,
      deleteDigit,
      confirm
    }
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
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

.status-banner {
  border: 1px solid #000;
  padding: 16px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.bottom-section {
  flex: 1;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 0;
}

.keypad-container {
  padding: 10px;
  background: transparent;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 21px;
}

.input-fields {
  display: flex;
  gap: 18px;
  justify-content: center;
}

.input-field {
  width: clamp(73px, 21vw, 94px);
  height: clamp(73px, 21vw, 94px);
  border: 2px solid var(--border-light);
  background: var(--bg-card);
  text-align: center;
  font-size: clamp(28px, 8vw, 36px);
  color: var(--text-primary);
  box-sizing: border-box;
  border-radius: var(--radius-btn);
  box-shadow: var(--shadow-card);
}
.input-field:focus {
  outline: none;
  border-color: var(--color-teal-light);
}

.keypad {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 470px;
  margin: 0 auto;
}

.keypad-row {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.keypad-btn {
  width: clamp(81px, 23vw, 101px);
  height: clamp(81px, 23vw, 101px);
  border: 2px solid var(--border-light);
  background: var(--bg-card);
  font-size: clamp(23px, 6.5vw, 29px);
  font-weight: 600;
  cursor: pointer;
  box-sizing: border-box;
  border-radius: var(--radius-btn);
  color: var(--text-primary);
  box-shadow: var(--shadow-card);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.keypad-btn:hover {
  border-color: var(--color-teal-light);
}
.keypad-btn:last-child {
  background: var(--gradient-primary);
  border: none;
  color: #fff;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
}
.keypad-btn:last-child:hover {
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.45);
}

.keypad-btn.delete-btn {
  background: var(--bg-card);
  color: var(--text-muted);
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

  .status-banner {
    padding: 12px;
    font-size: 14px;
  }

  .bottom-section {
    padding: 12px;
  }

  .input-field {
    width: 73px;
    height: 73px;
    font-size: 29px;
  }

  .keypad {
    max-width: 100%;
    gap: 13px;
  }

  .keypad-btn {
    width: 81px;
    height: 81px;
    font-size: 23px;
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

  .status-banner {
    padding: 14px;
  }

  .bottom-section {
    padding: 16px;
  }

  .input-field {
    width: 83px;
    height: 83px;
    font-size: 31px;
  }

  .keypad-btn {
    width: 83px;
    height: 83px;
    font-size: 23px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .home-container {
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

  .status-banner {
    padding: 18px;
    font-size: 16px;
  }

  .bottom-section {
    padding: 24px;
  }

  .input-field {
    width: 94px;
    height: 94px;
    font-size: 36px;
  }

  .keypad {
    max-width: 360px;
  }

  .keypad-btn {
    width: 94px;
    height: 94px;
    font-size: 29px;
  }
}
</style>
