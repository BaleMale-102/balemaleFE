<template>
  <div class="admin-detail-container">
    <!-- 헤더 -->
    <div class="header">
      <button type="button" @click="goBack" class="back-btn">
        <span class="back-btn-box">
          <span class="back-btn-elem">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="back-btn-icon" aria-hidden="true">
              <path d="m274-450 248 248-42 42-320-320 320-320 42 42-248 248h526v60H274Z" fill="currentColor" />
            </svg>
          </span>
          <span class="back-btn-elem">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="back-btn-icon" aria-hidden="true">
              <path d="m274-450 248 248-42 42-320-320 320-320 42 42-248 248h526v60H274Z" fill="currentColor" />
            </svg>
          </span>
        </span>
      </button>
      <h1 class="page-title">이상탐지 이력 조회</h1>
      <button @click="goHome" class="close-btn">✕</button>
    </div>

    <!-- 로딩 -->
    <LoadingPanel v-if="loading" />

    <!-- 로그 카드 영역 (드롭다운 + 카드 리스트) -->
    <div v-else class="card-section">
      <div class="filter-row">
        <select v-model="filterOption" class="filter-select" aria-label="정렬/필터">
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="human">사람</option>
          <option value="obstacle">장애물</option>
        </select>
      </div>
      <div class="card-list">
        <div
          v-for="item in filteredCardList"
          :key="item.id"
          class="anomaly-card"
          :class="{
            'anomaly-card--human': item.type === 'HUMAN',
            'anomaly-card--obstacle': item.type === 'OBSTACLE'
          }"
        >
          <div class="meta-row">
            <div class="meta">
              <!-- AnomalyEvent.plate (types.ts), 없으면 '-' -->
              <div class="plate">{{ getPlate(item) }}</div>
              <div class="occurredAt">{{ formatTime(item.occurredAt) }}</div>
            </div>
            <div class="typePill">{{ typeLabel(item.type) }}</div>
          </div>

          <div class="iconBox">
            <img
              :src="item.type === 'HUMAN' ? personIcon : alertIcon"
              :alt="typeLabel(item.type)"
              class="anomaly-card-icon"
            >
          </div>

          <div class="route">
            <span class="round-icon" aria-hidden="true"></span>
            <span class="route__line" aria-hidden="true"></span>
            <span class="square-icon" aria-hidden="true"></span>
            <div class="nodeText route__from">{{ item.fromNode }}</div>
            <span class="route__spacer" aria-hidden="true"></span>
            <div class="nodeText route__to">{{ item.toNode }}</div>
          </div>
        </div>
        <div v-if="filteredCardList.length === 0" class="empty">이상탐지 로그가 없습니다.</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAnomalyEvents } from '@/api/modules/admin'
import LoadingPanel from '@/components/LoadingPanel.vue'
import personIcon from '@/assets/icons/person.svg'
import alertIcon from '@/assets/icons/alert.svg'

const TYPE_LABEL = {
  HUMAN: '사람',
  OBSTACLE: '장애물'
}

export default {
  name: 'AdminDetailView',
  components: {
    LoadingPanel
  },
  data() {
    return {
      filterOption: 'latest',
      /** @type {import('@/api/types').AnomalyEvent[]} */
      rawEventList: [],
      loading: false,
      personIcon,
      alertIcon
    }
  },
  computed: {
    /** @returns {import('@/api/types').AnomalyEvent[]} */
    filteredCardList() {
      let list = [...this.rawEventList]
      if (this.filterOption === 'human') {
        list = list.filter((item) => item.type === 'HUMAN')
      } else if (this.filterOption === 'obstacle') {
        list = list.filter((item) => item.type === 'OBSTACLE')
      }
      const desc = this.filterOption === 'latest' || this.filterOption === 'human' || this.filterOption === 'obstacle'
      return list.sort((a, b) => {
        const ta = new Date(a.occurredAt).getTime()
        const tb = new Date(b.occurredAt).getTime()
        return desc ? tb - ta : ta - tb
      })
    }
  },
  mounted() {
    this.fetchEvents()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    goHome() {
      this.$router.push('/')
    },
    typeLabel(type) {
      return TYPE_LABEL[type] ?? type
    },
    formatTime(occurredAt) {
      if (!occurredAt) return ''
      const d = new Date(occurredAt)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hours = d.getHours()
      const ampm = hours < 12 ? '오전' : '오후'
      const h12 = hours % 12 || 12
      const min = String(d.getMinutes()).padStart(2, '0')
      return `${y}-${m}-${day} ${ampm} ${String(h12).padStart(2, '0')}:${min}`
    },
    locationText(fromNode, toNode) {
      if (!fromNode && !toNode) return '-'
      return `${fromNode || '-'}와 ${toNode || '-'} 사이 이동 경로`
    },
    /** API 단건에서 plate 값 추출 (plate | licensePlate | license_plate 등) */
    getPlate(item) {
      return item?.plate ?? item?.licensePlate ?? item?.license_plate ?? item?.vehiclePlate ?? '-'
    },
    async fetchEvents() {
      this.loading = true
      try {
        const res = await getAnomalyEvents({ size: 50 })
        const raw = res.data
        const content = raw?.data?.content ?? raw?.content ?? []
        this.rawEventList = content.map((item) => ({
          ...item,
          plate: item?.plate ?? item?.licensePlate ?? item?.license_plate ?? item?.vehiclePlate ?? ''
        }))
      } catch (e) {
        console.error(e)
        this.rawEventList = []
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.admin-detail-container {
  height: 100vh;
  min-height: 0;
  width: 100%;
  background: var(--bg-page);
  padding: 20px;
  padding-top: 26px;
  padding-left: 70px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
  gap: 12px;
}

.header .back-btn {
  justify-self: start;
}

.header .close-btn {
  justify-self: end;
}

.page-title {
  margin: 0;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 800;
  color: var(--color-teal);
  text-align: center;
  letter-spacing: 0.02em;
  line-height: 1.3;
}

.card-section {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-row {
  display: flex;
  justify-content: flex-end;
  padding: 0 4px;
}

.filter-select {
  min-width: 130px;
  padding: 10px 10px;
  font-size: 20px;
  border: 2px solid var(--border-light);
  border-radius: var(--radius-btn);
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
}
.filter-select:focus {
  outline: none;
  border-color: var(--color-teal-light);
}

.filter-select option {
  font-size: 20px;
}

.empty {
  text-align: center;
  color: var(--text-muted);
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.back-btn {
  display: block;
  position: relative;
  width: 40px;
  height: 40px;
  margin: 0;
  overflow: hidden;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  border: 0;
  color: var(--color-primary);
  font-size: 24px;
}

.back-btn::before {
  content: "";
  position: absolute;
  border-radius: 50%;
  inset: 4px;
  border: 3px solid var(--border-spot);
  transition:
    opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms,
    transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms;
}

.back-btn::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  inset: 4px;
  border: 3px solid var(--color-primary);
  transform: scale(1.3);
  transition:
    opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
    transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: 0;
}

.back-btn:hover::before,
.back-btn:focus::before {
  opacity: 0;
  transform: scale(0.7);
  transition:
    opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
    transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.back-btn:hover::after,
.back-btn:focus::after {
  opacity: 1;
  transform: scale(1);
  transition:
    opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms,
    transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms;
}

.back-btn-box {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 100%;
  align-items: center;
  transition: transform 0.4s;
  color: inherit;
}

.back-btn-elem {
  display: flex;
  flex: 0 0 40px;
  width: 40px;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.back-btn:hover .back-btn-box,
.back-btn:focus .back-btn-box {
  transform: translateX(-40px);
}

.back-btn-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.close-btn {
  background: var(--bg-card);
  border: 2px solid var(--border-light);
  color: var(--text-primary);
  font-size: 18px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-btn);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;
}

.close-btn:hover {
  border-color: var(--color-teal-light);
}

.card-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

/* anomaly-card (이상탐지 로그 카드) */
.anomaly-card {
  --primary-color: #484848;
  --background: #ffffff;
  --box-shadow: rgb(218, 226, 234);
  --border: rgb(255, 157, 31);
  --muted: rgba(72, 72, 72, 0.55);
  --pill-bg: rgb(228, 247, 232);

  display: grid;
  grid-template-columns: 96px 1fr;
  grid-template-rows: auto auto;
  column-gap: 16px;
  row-gap: 10px;

  padding: 16px;
  border-radius: 12px;
  background: var(--background);
  box-shadow: var(--box-shadow) 0 0 10px 0;
  border-bottom: 6px solid var(--pill-bg);
  color: var(--primary-color);
}

/* 타입별 색상은 typePill·하단 테두리만 적용, 카드 배경은 흰색 유지 */
.anomaly-card--human {
  --pill-bg: rgb(255 234 196 / 80%);
}

.anomaly-card--obstacle {
  --pill-bg: rgb(202 253 255 / 80%);
}

.anomaly-card .meta-row {
  grid-column: 1 / 3;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.anomaly-card .meta {
  min-width: 0;
}

.anomaly-card .plate {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.1;
}

.anomaly-card .occurredAt {
  margin-top: 4px;
  font-size: 20px;
  color: var(--muted);
}

.anomaly-card .iconBox {
  grid-column: 1;
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
}

.anomaly-card-icon {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.anomaly-card .route {
  grid-column: 2;
  grid-row: 2;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto;
  column-gap: 0;
  row-gap: 6px;
  align-items: center;
  justify-items: center;
}

/* 위쪽: 동그라미 --------(점선)-------- 네모, 점선이 둘을 이음 */
.anomaly-card .route__line {
  width: 100%;
  min-width: 20px;
  border-top: 2px dotted gray;
  opacity: 0.5;
}

.anomaly-card .route__spacer {
  min-width: 0;
}

/* 아래쪽: fromNode, toNode (아이콘 정렬) */
.anomaly-card .route__from {
  justify-self: start;
}

.anomaly-card .route__to {
  justify-self: end;
}

.anomaly-card .round-icon {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #808080;
  background: #fff;
  flex-shrink: 0;
}

.anomaly-card .square-icon {
  width: 10px;
  height: 10px;
  border: 2px solid var(--border);
  background: #fff;
  flex-shrink: 0;
}

.anomaly-card .nodeText {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.2px;
}

.anomaly-card .typePill {
  flex-shrink: 0;
  background: var(--pill-bg);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-color);
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .admin-detail-container {
    padding: 12px;
    padding-top: 20px;
    padding-left: 12px;
  }

  .header {
    margin-bottom: 20px;
    padding: 0 5px;
  }

  .back-btn {
    width: 36px;
    height: 36px;
  }

  .back-btn-icon {
    width: 20px;
    height: 20px;
  }

  .close-btn {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .card-list {
    grid-template-columns: 1fr;
    gap: 16px;
    max-width: 100%;
  }

  .anomaly-card {
    padding: 12px;
    border-radius: 8px;
  }

  .anomaly-card .plate {
    font-size: 18px;
  }

  .anomaly-card .occurredAt {
    font-size: 11px;
  }

  .anomaly-card .nodeText {
    font-size: 22px;
  }

  .anomaly-card .typePill {
    font-size: 16px;
    padding: 8px 14px;
  }
}

/* 태블릿 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .admin-detail-container {
    padding: 16px;
    padding-top: 23px;
    padding-left: 16px;
  }

  .card-list {
    max-width: 600px;
  }

  .anomaly-card {
    padding: 14px;
  }

  .anomaly-card .nodeText {
    font-size: 24px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .admin-detail-container {
    padding: 24px;
    padding-top: 26px;
    padding-left: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    padding: 0;
  }

  .card-list {
    grid-template-columns: repeat(2, 1fr);
    max-width: 1000px;
  }

  .anomaly-card {
    padding: 18px;
  }

  .anomaly-card .plate {
    font-size: 24px;
  }

  .anomaly-card .nodeText {
    font-size: 28px;
  }

  .anomaly-card .typePill {
    font-size: 18px;
    padding: 10px 18px;
  }
}
</style>
