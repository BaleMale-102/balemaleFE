<template>
  <div class="parking-map" :class="{ 'parking-map--teal': highlightVariant === 'teal' }">
    <div class="parking-grids-container">
      <!-- 상단 구역 (일반) : 2행 4열 C1~C4, B1~B4 -->
      <div class="zone zone-top">
        <div class="parking-grid top-grid">
          <div
            v-for="(spot, idx) in topGridSpots"
            :key="spot.slotId ?? `top-${idx}`"
            class="parking-spot-wrap"
          >
            <div
              class="parking-spot"
              :class="{ occupied: spot.occupied, selected: isSlotHighlighted('top', idx) }"
            >
              <span v-if="isSlotHighlighted('top', idx)" class="selected-blob" aria-hidden="true" />
              <div class="spot-center">
                <img
                  v-if="spot.occupied"
                  :src="getCarIconSrc('top', idx)"
                  class="car-icon-img"
                  alt="주차된 차량"
                />
                <span v-else class="available-text">{{ isSlotHighlighted('top', idx) ? 'Selected' : '주차 가능' }}</span>
              </div>
              <span class="slot-code" :class="{ occupied: spot.occupied, selected: isSlotHighlighted('top', idx) }">
                {{ TOP_SLOT_CODES[idx] }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 하단 구역 (장애인) : 1행 4열 A1~A4 -->
      <div class="zone zone-bottom">
        <div class="parking-grid bottom-grid">
          <div
            v-for="(spot, idx) in bottomGridSpots"
            :key="spot.slotId ?? `bottom-${idx}`"
            class="parking-spot-wrap"
          >
            <div
              class="parking-spot"
              :class="{ occupied: spot.occupied, selected: isSlotHighlighted('bottom', idx), disabled: spot.isDisabled }"
            >
              <span v-if="isSlotHighlighted('bottom', idx)" class="selected-blob" aria-hidden="true" />
              <div class="spot-center">
                <svg
                  v-if="spot.isDisabled"
                  class="disabled-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  role="img"
                  aria-label="장애인"
                >
                  <path d="M480-720q-33 0-56.5-23.5T400-800q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800q0 33-23.5 56.5T480-720ZM680-80v-200H480q-33 0-56.5-23.5T400-360v-240q0-33 23.5-56.5T480-680q24 0 41.5 10.5T559-636q55 66 99.5 90.5T760-520v80q-53 0-107-23t-93-55v138h120q33 0 56.5 23.5T760-300v220h-80Zm-280 0q-83 0-141.5-58.5T200-280q0-72 45.5-127T360-476v82q-35 14-57.5 44.5T280-280q0 50 35 85t85 35q39 0 69.5-22.5T514-240h82q-14 69-69 114.5T400-80Z" fill="currentColor"/>
                </svg>
                <img
                  v-if="spot.occupied"
                  :src="getCarIconSrc('bottom', idx)"
                  class="car-icon-img"
                  alt="주차된 차량"
                />
                <span v-else class="available-text">{{ isSlotHighlighted('bottom', idx) ? 'Selected' : '주차 가능' }}</span>
              </div>
              <span class="slot-code" :class="{ occupied: spot.occupied, selected: isSlotHighlighted('bottom', idx), disabled: spot.isDisabled }">
                {{ BOTTOM_SLOT_CODES[idx] }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="parking-info">
      <div class="info-text">
        <span class="label">일반 자리 :</span>
        <span class="value" :class="{ full: parkingCount.normalCount === 0 }">
          {{ parkingCount.normalCount === 0 ? '만차' : parkingCount.normalCount }}
        </span>
        <span class="divider">/</span>
        <span class="label">장애인 자리 :</span>
        <span class="value" :class="{ full: parkingCount.disabledCount === 0 }">
          {{ parkingCount.disabledCount === 0 ? '만차' : parkingCount.disabledCount }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getAvailableParkingCount, getParkingMap } from '@/api/modules/public'
import blackCar from '@/assets/icons/black-car.png'
import blueCar from '@/assets/icons/blue-car.png'
import orangeCar from '@/assets/icons/orange-car.png'
import redCar from '@/assets/icons/red-car.png'

// 위치 코드: 상단 2행4열 = C1~C4, B1~B4 / 하단 1행4열 = A1~A4
const TOP_SLOT_CODES = ['C1', 'C2', 'C3', 'C4', 'B1', 'B2', 'B3', 'B4']
const BOTTOM_SLOT_CODES = ['A1', 'A2', 'A3', 'A4']

const CAR_ICONS = [orangeCar, blackCar, redCar, blueCar]

// 칸별로 4개 차량 아이콘 중 하나를 랜덤(고정) 배정
function getCarIconSrc(zone, idx) {
  const seed = zone === 'top' ? idx : 8 + idx
  const i = (seed * 7 + 11) % CAR_ICONS.length
  return CAR_ICONS[i]
}

// API 슬롯 → 그리드용 스팟 (occupied, isDisabled, slotId)
function toSpot(slot) {
  return {
    slotId: slot.slotId,
    occupied: slot.slotStatus === 'OCCUPIED',
    isDisabled: slot.slotType === 'DISABLED'
  }
}

function applyMapList(list, topGridSpots, bottomGridSpots) {
  if (!Array.isArray(list) || list.length < 12) {
    topGridSpots.value = Array.from({ length: 8 }, () => ({ occupied: false, isDisabled: false }))
    bottomGridSpots.value = Array.from({ length: 4 }, (_, i) => ({ occupied: false, isDisabled: i < 2 }))
    return
  }
  bottomGridSpots.value = list.slice(0, 4).map(toSpot)
  const bRow = list.slice(4, 8).map(toSpot)
  const cRow = list.slice(8, 12).map(toSpot)
  topGridSpots.value = [...cRow, ...bRow]
}

export default {
  name: 'ParkingMap',
  props: {
    /** 입차/정산 완료 후 넘긴 최신 맵 데이터 있으면 사용, 없으면 mount 시 API 호출 */
    initialMapData: {
      type: Array,
      default: null
    },
    /** 강조할 주차칸 코드 (예: A1, B2) - EntryCompleteView·ExitPaymentView에서 전달 */
    highlightedSlotCode: {
      type: String,
      default: null
    },
    /** exit/payment 시 teal 색상 테마 (장애인칸 linear-gradient #0d9488, slot-code #16d2c1) */
    highlightVariant: {
      type: String,
      default: 'default'
    }
  },
  setup(props) {
    const isSlotHighlighted = (zone, idx) => {
      if (!props.highlightedSlotCode) return false
      const code = String(props.highlightedSlotCode).trim().toUpperCase().replace(/-/g, '')
      const slotCode = zone === 'top' ? TOP_SLOT_CODES[idx] : BOTTOM_SLOT_CODES[idx]
      return slotCode === code
    }
    // 상단 그리드: 2행 4열 = C1~C4(1행), B1~B4(2행)
    const topGridSpots = ref([])
    // 하단 그리드: 1행 4열 = A1~A4
    const bottomGridSpots = ref([])

    const parkingCount = ref({
      normalCount: 0,
      disabledCount: 0,
      totalCount: 0
    })

    const fetchParkingMap = async () => {
      try {
        const res = await getParkingMap()
        const list = res.data?.data ?? res.data ?? []
        applyMapList(list, topGridSpots, bottomGridSpots)
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('주차장 맵 조회 실패:', error?.message || error)
        }
        topGridSpots.value = Array.from({ length: 8 }, () => ({ occupied: false, isDisabled: false }))
        bottomGridSpots.value = Array.from({ length: 4 }, (_, idx) => ({ occupied: false, isDisabled: idx < 2 }))
      }
    }

    const fetchParkingCount = async () => {
      try {
        const response = await getAvailableParkingCount()
        if (response.data && response.data.data) {
          parkingCount.value = response.data.data
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('주차장 잔여수 조회 실패:', error?.message || error)
        }
      }
    }

    onMounted(() => {
      const list = props.initialMapData
      if (Array.isArray(list) && list.length >= 12) {
        applyMapList(list, topGridSpots, bottomGridSpots)
      } else {
        fetchParkingMap()
      }
      fetchParkingCount()
    })

    return {
      TOP_SLOT_CODES,
      BOTTOM_SLOT_CODES,
      topGridSpots,
      bottomGridSpots,
      parkingCount,
      getCarIconSrc,
      isSlotHighlighted
    }
  }
}
</script>

<style scoped>
.parking-map {
  --map-padding: clamp(12px, 2.6vw, 16px);
  --section-gap: clamp(12px, 3vw, 18px);
  --zone-padding: clamp(8px, 2.2vw, 10px);
  --badge-font: clamp(12px, 2.6vw, 16px);
  --icon-size: clamp(22px, 4.2vw, 26px);
  --icon-font: clamp(16px, 3.2vw, 18px);

  font-family: var(--font-sans);
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding: var(--map-padding);
  gap: var(--section-gap);
}

.parking-grids-container {
  width: 100%;
  max-width: clamp(275px, calc(92vw - 5px), 615px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
}

.parking-grid {
  display: grid;
  grid-template-columns: repeat(4, 100px);
  gap: 0;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
}

.parking-grid.top-grid {
  grid-template-rows: repeat(2, 135px);
}

.parking-grid.bottom-grid {
  grid-template-rows: 135px;
}

.parking-spot-wrap {
  position: relative;
  width: 100px;
  height: 135px;
}

.zone {
  width: 100%;
  padding: var(--zone-padding);
  box-sizing: border-box;
  background: var(--bg-card);
}

/* 주차칸: 100 * 135, 점선 주차선, 모서리 직각 */
.parking-spot {
  width: 100px;
  height: 135px;
  min-height: 0;
  border: 1px dashed var(--border-light);
  border-radius: 0;
  background: var(--bg-card);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 6px 8px 8px;
  position: relative;
}

.parking-spot.occupied {
  background: var(--bg-page);
}

.parking-spot.selected {
  background: linear-gradient(180deg, #beaeff 0%, #ece8ff 50%, #faf5ff 100%);
  border-color: transparent;
  overflow: hidden;
  position: relative;
}

/* 배경에서 움직이는 블롭 (참고: blob-bounce) */
.selected-blob {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #b085f5;
  opacity: 0.75;
  filter: blur(14px);
  animation: blob-bounce 5s infinite ease;
  pointer-events: none;
}

/* 회전하는 테두리: 한 줄 하이라이트만 */
.parking-spot.selected::before {
  content: '';
  position: absolute;
  inset: -40%;
  z-index: 1;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(176, 133, 245, 0) 40deg,
    rgba(176, 133, 245, 0.85) 70deg,
    rgba(176, 133, 245, 0) 110deg,
    transparent 360deg
  );
  animation: border-spin 1.8s linear infinite;
}

/* 안쪽 덮개: 반투명해서 블롭이 비치게 (참고: .bg) */
.parking-spot.selected::after {
  content: '';
  position: absolute;
  inset: 5px;
  border-radius: 0;
  background: linear-gradient(
    180deg,
    rgba(190, 174, 255, 0.65) 0%,
    rgba(236, 232, 255, 0.65) 50%,
    rgba(250, 245, 255, 0.7) 100%
  );
  backdrop-filter: blur(6px);
  z-index: 1;
}

.parking-spot.selected .spot-center,
.parking-spot.selected .slot-code {
  position: relative;
  z-index: 2;
}

@keyframes border-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes blob-bounce {
  0% {
    transform: translate(-50%, -50%) translate3d(0, 0, 0);
  }
  25% {
    transform: translate(-50%, -50%) translate3d(30%, 0, 0);
  }
  50% {
    transform: translate(-50%, -50%) translate3d(30%, 30%, 0);
  }
  75% {
    transform: translate(-50%, -50%) translate3d(0, 30%, 0);
  }
  100% {
    transform: translate(-50%, -50%) translate3d(0, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .parking-spot.selected::before {
    animation: none;
  }
  .selected-blob {
    animation: none;
  }
}

/* 위치 코드 알약 뱃지: 주차칸 아래쪽 */
.slot-code {
  flex-shrink: 0;
  display: inline-block;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: clamp(11px, 2.6vw, 14px);
  font-weight: 700;
  letter-spacing: 0.02em;
  margin-top: 4px;
}
.slot-code.occupied {
  background: var(--border-light);
  color: var(--text-muted);
}
.slot-code:not(.occupied) {
  background: #ede9fe;
  color: var(--color-primary);
}

.slot-code.selected {
  background: #4338ca;
  color: #fff;
}

.slot-code.occupied.selected {
  background: #ad58fa;
  color: #fff;
}

/* exit/payment teal 테마: 장애인칸만 초록색 계열, 일반칸은 기존 보라색 유지 */
.parking-map--teal .parking-spot.selected.disabled {
  background: linear-gradient(180deg, #99f6e4 0%, #ccfbf1 50%, #f0fdfa 100%);
}
.parking-map--teal .parking-spot.selected.disabled::after {
  background: linear-gradient(
    180deg,
    rgba(153, 246, 228, 0.75) 0%,
    rgba(204, 251, 241, 0.75) 50%,
    rgba(240, 253, 250, 0.8) 100%
  );
}
.parking-map--teal .parking-spot.selected.disabled .selected-blob {
  background-color: #5eead4;
  opacity: 0.6;
}
.parking-map--teal .parking-spot.selected.disabled::before {
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(94, 234, 212, 0) 40deg,
    rgba(94, 234, 212, 0.7) 70deg,
    rgba(94, 234, 212, 0) 110deg,
    transparent 360deg
  );
  animation: border-spin 1.8s linear infinite;
}
.parking-map--teal .slot-code.selected.disabled {
  background: #16d2c1;
  color: #fff;
}
.parking-map--teal .slot-code.occupied.selected.disabled {
  background: #16d2c1;
  color: #fff;
}

/* 장애인 주차칸 slot-code 글자 색상 */
.slot-code.disabled {
  color: var(--color-teal);
}

/* 장애인칸 + 점유 시: 일반 점유 칸과 동일한 글자 색상 */
.slot-code.occupied.disabled {
  color: var(--text-muted);
}

/* 칸 중앙: 차량 아이콘 또는 주차 가능 */
.spot-center {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  width: 100%;
}

.car-icon-img {
  width: 58%;
  height: auto;
  max-height: 58%;
  object-fit: contain;
  display: block;
  flex-shrink: 0;
  margin: 0 auto;
}

.available-text {
  font-size: clamp(10px, 2.4vw, 13px);
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

/* 장애인 아이콘: spot-center 우측 상단, slot-code와 동일 색상 */
.disabled-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  width: var(--icon-size);
  height: var(--icon-size);
  color: var(--color-teal);
  display: block;
  flex-shrink: 0;
  z-index: 1;
}

.parking-info {
  width: 100%;
  max-width: clamp(275px, calc(92vw - 5px), 615px);
  margin: 0 auto;
}

.info-text {
  background: var(--bg-card);
  padding: clamp(10px, 2.2vw, 12px) clamp(12px, 2.6vw, 14px);
  text-align: center;
  font-size: var(--badge-font);
  font-weight: 700;
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  box-sizing: border-box;
}

.label {
  color: var(--text-muted);
}

.divider {
  margin: 0 8px;
  color: var(--text-muted);
}

.value {
  margin: 0 6px;
  color: var(--color-primary);
}

.value.full {
  color: var(--color-error);
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .parking-map {
    padding: 12px;
    gap: 12px;
  }

  .parking-grids-container {
    max-width: 100%;
  }

  .parking-grid {
    gap: 0;
  }

  .zone {
    padding: 8px;
  }

  .parking-spot {
    padding: 5px 6px 6px;
  }

  .slot-code {
    padding: 3px 8px;
    font-size: 11px;
  }

  .disabled-icon {
    width: 22px;
    height: 22px;
  }

  .info-text {
    padding: 10px 12px;
    font-size: 12px;
  }
}

/* 태블릿 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .parking-grids-container {
    max-width: 560px;
  }

  .info-text {
    font-size: 13px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .parking-grids-container {
    max-width: 620px;
  }

  .info-text {
    font-size: 16px;
  }
}
</style>
