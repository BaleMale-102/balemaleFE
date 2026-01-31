<template>
  <div class="admin-detail-container">
    <!-- 헤더 (드롭다운 오른쪽 배치) -->
    <div class="header">
      <button @click="goBack" class="back-btn">←</button>
      <div class="header-right">
        <div class="filter-wrap">
          <select v-model="filterOption" class="filter-select" aria-label="정렬/필터">
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="human">사람</option>
            <option value="obstacle">장애물</option>
          </select>
        </div>
        <button @click="goHome" class="close-btn">✕</button>
      </div>
    </div>

    <!-- 로딩 -->
    <div v-if="loading" class="loading">이상탐지 로그를 불러오는 중...</div>

    <!-- 카드 리스트 (프론트 필터/정렬) -->
    <div class="card-list" v-else>
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
</template>

<script>
import { getAnomalyEvents } from '@/api/modules/admin'

const TYPE_LABEL = {
  HUMAN: '사람',
  OBSTACLE: '장애물'
}

export default {
  name: 'AdminDetailView',
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
  background-color: #1B4300;
  padding: 20px;
  padding-top: 80px;
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

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-wrap {
  flex-shrink: 0;
}

.filter-select {
  min-width: 100px;
  padding: 8px 10px;
  font-size: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fff;
  color: #333;
  cursor: pointer;
}

.filter-select option {
  font-size: 12px;
}

.loading,
.empty {
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.back-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.back-btn:hover {
  opacity: 0.7;
}

.close-btn {
  background: #ffffff;
  border: 1px solid #000;
  color: #000000;
  font-size: 18px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f0f0f0;
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
  background: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 24px;
  box-sizing: border-box;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s, transform 0.2s;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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
  color: #333;
}

.value {
  flex: 1;
  color: #666;
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .admin-detail-container {
    padding: 12px;
    padding-top: 64px;
    padding-left: 12px;
  }

  .header {
    margin-bottom: 20px;
    padding: 0 5px;
  }

  .back-btn {
    font-size: 20px;
    width: 36px;
    height: 36px;
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
    padding-top: 72px;
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
