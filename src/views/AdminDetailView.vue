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

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
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
}
</script>

<style scoped></style>
