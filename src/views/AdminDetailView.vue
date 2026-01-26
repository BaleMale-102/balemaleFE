<template>
  <div class="admin-detail-container">
    <!-- 헤더 -->
    <div class="header">
      <button @click="goBack" class="back-btn">←</button>
      <button @click="goHome" class="close-btn">✕</button>
    </div>

    <!-- 카드 리스트 -->
    <div class="card-list">
      <div class="card" v-for="(item, index) in cardList" :key="index">
        <div class="card-image"></div>
        <div class="card-content">
          <div class="card-row">
            <span class="label">대상 :</span>
            <span class="value">{{ item.target }}</span>
          </div>
          <div class="card-row">
            <span class="label">시각 :</span>
            <span class="value">{{ item.time }}</span>
          </div>
          <div class="card-row">
            <span class="label">위치 :</span>
            <span class="value">{{ item.location }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'AdminDetailView',
  setup() {
    const router = useRouter()
    
    const cardList = ref([
      {
        target: '',
        time: '',
        location: ''
      },
      {
        target: '',
        time: '',
        location: ''
      }
    ])

    const goBack = () => {
      router.go(-1)
    }

    const goHome = () => {
      router.push('/')
    }

    return {
      cardList,
      goBack,
      goHome
    }
  }
})
</script>

<style scoped>
.admin-detail-container {
  min-height: 100vh;
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
  margin-bottom: 30px;
  padding: 0 10px;
}

.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  color: #000000;
  font-size: 24px;
  cursor: pointer;
  z-index: 9999;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  background: transparent;
  border: 1px solid #000;
  color: #000000;
  font-size: 18px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.card {
  background: #fff;
  border: 1px solid #000;
  padding: 20px;
  display: flex;
  gap: 20px;
  box-sizing: border-box;
  width: 100%;
}

.card-image {
  width: 100px;
  height: 100px;
  border: 1px solid #000;
  flex-shrink: 0;
  background: #fff;
  box-sizing: border-box;
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
  line-height: 1.5;
}

.label {
  font-weight: 500;
  margin-right: 8px;
  min-width: 50px;
}

.value {
  flex: 1;
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
    top: 12px;
    left: 12px;
    font-size: 24px;
    width: 40px;
    height: 40px;
  }

  .close-btn {
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .card-list {
    gap: 16px;
  }

  .card {
    padding: 16px;
    gap: 16px;
  }

  .card-image {
    width: 80px;
    height: 80px;
  }

  .card-content {
    gap: 10px;
  }

  .card-row {
    font-size: 14px;
  }

  .label {
    min-width: 45px;
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
    max-width: 500px;
  }

  .card {
    padding: 18px;
    gap: 18px;
  }

  .card-image {
    width: 90px;
    height: 90px;
  }

  .card-row {
    font-size: 15px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .admin-detail-container {
    padding: 24px;
    padding-top: 96px;
    padding-left: 24px;
  }

  .card-list {
    max-width: 600px;
  }

  .card {
    padding: 24px;
    gap: 24px;
  }

  .card-image {
    width: 120px;
    height: 120px;
  }

  .card-content {
    gap: 14px;
  }

  .card-row {
    font-size: 17px;
  }
}
</style>
