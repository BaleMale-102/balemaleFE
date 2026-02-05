<template>
  <div class="home-container">
    <!-- 주차장 맵 내 잔여 주차 수 표시 (일반/장애인/총 잔여수) -->
    <div class="middle-section">
      <ParkingMap />
    </div>

    <!-- 차량 번호 입력 키패드 -->
    <div class="bottom-section" ref="bottomSectionRef">
      <div class="bottom-section__fit">
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
          <button type="button" @click="deleteDigit" class="keypad-btn delete-btn" aria-label="삭제">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="delete-btn-icon" aria-hidden="true">
              <path d="m448-326 112-112 112 112 43-43-113-111 111-111-43-43-110 112-112-112-43 43 113 111-113 111 43 43Zm-98 166q-14.25 0-27-6.38-12.75-6.37-21-17.62L80-480l221-296q8.25-11.25 21-17.63 12.75-6.37 27-6.37h472q24.75 0 42.38 17.62Q881-764.75 881-740v520q0 24.75-17.62 42.37Q845.75-160 821-160H350ZM155-480l195 260h471v-520H350L155-480Zm431 0Z" fill="currentColor" />
            </svg>
          </button>
          <button @click="inputNumber('0')" class="keypad-btn">0</button>
          <button @click="confirm" class="keypad-btn confirm-btn">확인</button>
        </div>
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
import { useBottomSectionScale } from '@/composables/useBottomSectionScale'

export default {
  name: 'HomeView',
  components: {
    ParkingMap
  },
  setup() {
    const router = useRouter()
    const bottomSectionRef = ref(null)
    useBottomSectionScale(bottomSectionRef)
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
      bottomSectionRef,
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
  height: 100%;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background: var(--bg-page);
}

/* HomeView 기준: top/middle/bottom 비율 — ParkingMap 있는 모든 뷰와 동일 */
.top-section {
  flex: 0 0 auto;
  padding: 1.625rem 0 0 4.375rem;
  width: 100%;
  box-sizing: border-box;
}

.robot-status {
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  padding: 1.25rem;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  color: var(--color-teal);
  font-weight: 700;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.middle-section {
  flex: 1 1 0;
  min-height: 0;
  padding: 0 0.625rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
}

.status-banner {
  border: 1px solid #000;
  padding: 16px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.bottom-section {
  flex: 0 0 auto;
  width: 712px;
  max-width: 100%;
  height: 500px;
  min-height: 500px;
  margin: 0 auto;
  padding: 0.5rem 0.625rem 0.625rem 0.625rem;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* bottom-section 전체 높이에 맞춤 (fit 영역을 section과 동일하게) */
.bottom-section :deep(.bottom-section__fit) {
  height: 100%;
  width: 100%;
  left: 0;
  margin-left: 0;
}

/* bottom-section 높이에 맞춰 꽉 채움 */
.keypad-container {
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 1.4%;
  box-sizing: border-box;
  background: transparent;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4%;
}

.input-fields {
  display: flex;
  gap: 2.5%;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
}

.input-field {
  width: 70px;
  height: 70px;
  border: 2px solid var(--border-light);
  background: var(--bg-card);
  text-align: center;
  font-size: clamp(0.975rem, 5.64vw, 2.6rem);
  font-weight: bold;
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
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 85%;
  display: flex;
  flex-direction: column;
  gap: 3%;
}

.keypad-row {
  flex: 1;
  display: flex;
  gap: 2%;
  justify-content: center;
  min-height: 0;
}

.keypad-btn {
  flex: 1;
  aspect-ratio: 1;
  min-width: 0;
  max-width: 13%;
  padding: 0;
  border: 1px solid var(--border-light);
  background: rgb(221 204 255 / 27%);
  font-size: clamp(0.975rem, 3.7vw, 2.4rem);
  font-weight: 600;
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 0.5em;
  color: var(--text-primary);
  box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;
  transition: all 0.3s;
}

.keypad-btn:hover {
  border: 1.5px solid #fff;
}

.keypad-btn:active {
  box-shadow: 4px 4px 12px #c5c5c5, -4px -4px 12px #ffffff;
}

.keypad-btn.delete-btn {
  background: var(--bg-card);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.keypad-btn.confirm-btn {
  font-size: clamp(0.975rem, 2.7vw, 2.4rem);
}

.delete-btn-icon {
  width: 50%;
  height: 50%;
  max-width: 42px;
  max-height: 42px;
}

/* 모바일 (480px 이하) — section 크기 통일 기준 */
@media (max-width: 480px) {
  .top-section {
    padding: 1.25rem 0 0 0.75rem;
  }

  .robot-status {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .middle-section {
    padding: 0 0.75rem;
    gap: 0;
  }

  .status-banner {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .bottom-section {
    padding: 0.5rem 0.75rem 0.75rem 0.75rem;
  }
}

/* 태블릿 (481px ~ 768px) — section 크기 통일 기준 */
@media (min-width: 481px) and (max-width: 768px) {
  .top-section {
    padding: 1.4375rem 0 0 1rem;
  }

  .robot-status {
    padding: 1rem;
  }

  .middle-section {
    padding: 0 1rem;
  }

  .status-banner {
    padding: 0.875rem;
  }

  .bottom-section {
    padding: 0.5rem 1rem 1rem 1rem;
  }
}

/* 데스크톱 (769px 이상) — section 크기 통일 기준 */
@media (min-width: 769px) {
  .home-container {
    max-width: 75rem;
    margin: 0 auto;
  }

  .top-section {
    padding: 1.625rem 0 0 1.5rem;
  }

  .robot-status {
    padding: 1.5rem;
    font-size: 1.125rem;
  }

  .middle-section {
    padding: 0 1.5rem;
  }

  .status-banner {
    padding: 1.125rem;
    font-size: 1rem;
  }

  .bottom-section {
    padding: 0.5rem 1.5rem 1.5rem 1.5rem;
  }
}
</style>
