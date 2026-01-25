<template>
  <div class="home-container">
    <!-- 상단 섹션 -->
    <div class="top-section">
      <div class="robot-status">주차로봇 대기중</div>
    </div>

    <!-- 중간 섹션 -->
    <div class="middle-section">
      <ParkingMap />
      <div class="status-banner full">만차</div>
      <div class="status-banner spaces">일반 자리 : 3 / 장애인 자리 : 2</div>
    </div>

    <!-- 하단 섹션 - 키패드 -->
    <div class="bottom-section">
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
          <button @click="deleteDigit" class="keypad-btn">← X</button>
          <button @click="inputNumber('0')" class="keypad-btn">0</button>
          <button @click="confirm" class="keypad-btn">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import ParkingMap from '@/components/ParkingMap.vue'

export default {
  name: 'HomeView',
  components: {
    ParkingMap
  },
  setup() {
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
        // 확인 로직
        console.log('입력된 코드:', code)
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
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.top-section {
  padding: 20px;
  padding-top: 80px;
  padding-left: 70px;
  width: 100%;
  box-sizing: border-box;
}

.robot-status {
  border: 1px solid #000;
  padding: 20px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.middle-section {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.status-banner {
  border: 1px solid #000;
  padding: 16px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.bottom-section {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.input-fields {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  justify-content: center;
}

.input-field {
  width: 60px;
  height: 60px;
  border: 1px solid #000;
  text-align: center;
  font-size: 24px;
  box-sizing: border-box;
  border-radius: 8px;
}

.keypad {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 300px;
  margin: 0 auto;
}

.keypad-row {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.keypad-btn {
  width: 80px;
  height: 80px;
  border: 1px solid #000;
  background: #fff;
  font-size: 20px;
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 8px;
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .top-section {
    padding: 12px;
    padding-top: 64px;
    padding-left: 12px;
  }

  .robot-status {
    padding: 12px;
    font-size: 14px;
  }

  .middle-section {
    padding: 12px;
    gap: 12px;
  }

  .status-banner {
    padding: 12px;
    font-size: 14px;
  }

  .bottom-section {
    padding: 12px;
  }

  .input-field {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .keypad {
    max-width: 100%;
    gap: 6px;
  }

  .keypad-btn {
    width: 70px;
    height: 70px;
    font-size: 18px;
  }
}

/* 태블릿 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .top-section {
    padding: 16px;
    padding-top: 72px;
    padding-left: 16px;
  }

  .robot-status {
    padding: 16px;
  }

  .middle-section {
    padding: 16px;
  }

  .status-banner {
    padding: 14px;
  }

  .bottom-section {
    padding: 16px;
  }

  .input-field {
    width: 55px;
    height: 55px;
  }

  .keypad-btn {
    width: 75px;
    height: 75px;
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
  }

  .robot-status {
    padding: 24px;
    font-size: 18px;
  }

  .middle-section {
    padding: 24px;
  }

  .status-banner {
    padding: 18px;
    font-size: 16px;
  }

  .bottom-section {
    padding: 24px;
  }

  .input-field {
    width: 70px;
    height: 70px;
    font-size: 28px;
  }

  .keypad {
    max-width: 360px;
  }

  .keypad-btn {
    width: 100px;
    height: 100px;
    font-size: 24px;
  }
}
</style>
