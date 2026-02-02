<script>
export default {
  name: 'App',
  computed: {
    isAdminRoute() {
      return this.$route.path.startsWith('/admin')
    }
  },
  watch: {
    $route: 'updateAppBackground'
  },
  mounted() {
    this.updateAppBackground()
  },
  methods: {
    goToAdmin() {
      this.$router.push('/admin/login')
    },
    updateAppBackground() {
      const app = this.$el?.parentElement
      if (!app) return
      if (this.isAdminRoute) {
        app.classList.remove('app-with-gradient')
      } else {
        app.classList.add('app-with-gradient')
      }
    }
  }
}
</script>

<template>
  <div class="app-wrap">
    <button v-if="!isAdminRoute" @click="goToAdmin" class="admin-btn"></button>
    <router-view />
  </div>
</template>

<style scoped>
.app-wrap {
  position: relative;
  min-height: 100vh;
}

/* 관리자 버튼 - top-padding 영역 안에 들어가도록 얇게 */
.admin-btn {
  position: fixed;
  top: 20px;
  /* max-width: 1200 컨테이너(중앙정렬) 안쪽 기준으로 위치 */
  left: max(70px, calc(50% - 600px + 70px));
  width: 60px;
  height: 14px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 9999;
}

/* 모바일 (480px 이하) - padding-top 20px 안에 */
@media (max-width: 480px) {
  .admin-btn {
    top: 12px;
    left: max(12px, calc(50% - 600px + 12px));
    width: 60px;
    height: 12px;
  }
}

/* 태블릿 (481px ~ 768px) - padding-top 23px 안에 */
@media (min-width: 481px) and (max-width: 768px) {
  .admin-btn {
    top: 16px;
    left: max(16px, calc(50% - 600px + 16px));
    width: 60px;
    height: 13px;
  }
}

/* 데스크톱 (769px 이상) - padding-top 26px 안에 */
@media (min-width: 769px) {
  .admin-btn {
    top: 24px;
    left: max(24px, calc(50% - 600px + 24px));
    width: 60px;
    height: 14px;
  }
}
</style>
