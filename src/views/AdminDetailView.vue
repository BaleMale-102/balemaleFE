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
      <div class="card" v-for="item in filteredCardList" :key="item.id">
        <div class="card-content">
          <div class="card-row">
            <span class="label">유형 :</span>
            <span class="value">{{ typeLabel(item.type) }}</span>
          </div>
          <div class="card-row">
            <span class="label">시각 :</span>
            <span class="value">{{ formatTime(item.occurredAt) }}</span>
          </div>
          <div class="card-row">
            <span class="label">위치 :</span>
            <span class="value">{{ locationText(item.fromNode, item.toNode) }}</span>
          </div>
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
      rawEventList: [],
      loading: false
    }
  },
  computed: {
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
      const h = String(d.getHours()).padStart(2, '0')
      const min = String(d.getMinutes()).padStart(2, '0')
      return `${y}-${m}-${day} ${h}:${min}`
    },
    locationText(fromNode, toNode) {
      if (!fromNode && !toNode) return '-'
      return `${fromNode || '-'}와 ${toNode || '-'} 사이 이동 경로`
    },
    async fetchEvents() {
      this.loading = true
      try {
        const res = await getAnomalyEvents({ size: 50 })
        const raw = res.data
        this.rawEventList = raw?.data?.content ?? raw?.content ?? []
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
  min-height: 100vh;
  width: 100%;
  background: var(--bg-page);
  padding: 20px;
  padding-top: 26px;
  padding-left: 70px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.card-section {
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
  min-width: 100px;
  padding: 8px 10px;
  font-size: 12px;
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
  font-size: 12px;
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
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  padding: 24px;
  box-sizing: border-box;
  width: 100%;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  transition: box-shadow 0.2s, transform 0.2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(30, 41, 59, 0.12);
  transform: translateY(-2px);
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
}

.card-row {
  display: flex;
  align-items: flex-start;
  font-size: 16px;
  line-height: 1.6;
}

.label {
  font-weight: 600;
  margin-right: 8px;
  min-width: 60px;
  color: var(--color-teal);
  font-weight: 600;
}

.value {
  flex: 1;
  color: var(--text-primary);
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
    gap: 16px;
    max-width: 100%;
  }

  .card {
    padding: 16px;
    border-radius: 6px;
  }

  .card-content {
    gap: 10px;
  }

  .card-row {
    font-size: 14px;
    line-height: 1.5;
  }

  .label {
    min-width: 50px;
    font-size: 14px;
  }

  .value {
    font-size: 14px;
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

  .card {
    padding: 20px;
  }

  .card-row {
    font-size: 15px;
  }

  .label {
    min-width: 55px;
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
    max-width: 900px;
  }

  .card {
    padding: 28px;
  }

  .card-content {
    gap: 16px;
  }

  .card-row {
    font-size: 17px;
    line-height: 1.7;
  }

  .label {
    min-width: 70px;
    font-size: 17px;
  }

  .value {
    font-size: 17px;
  }
}
</style>
