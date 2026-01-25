<script setup lang="ts">
// import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import { usePublicStore } from './stores/publicStore'
// import { useAdminStore } from './stores/adminStore'

const router = useRouter()
// const publicStore = usePublicStore()
// const adminStore = useAdminStore()

// onMounted(() => {
//   publicStore.initSocketConnection()
// })

const goToAdmin = () => {
  router.push('/admin/login')
}
</script>

<template>
  <button @click="goToAdmin" class="admin-btn"></button>
  <router-view />
</template>

<style scoped>
/* 관리자 버튼 */
.admin-btn {
  position: fixed;
  top: 20px;
  left: 70px;
  width: 50px;
  height: 50px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 9999;
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .admin-btn {
    top: 12px;
    left: 12px;
    width: 40px;
    height: 40px;
  }
}

/* 태블릿 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .admin-btn {
    top: 16px;
    left: 16px;
    width: 45px;
    height: 45px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .admin-btn {
    top: 24px;
    left: 24px;
    width: 60px;
    height: 60px;
  }
}
</style>
