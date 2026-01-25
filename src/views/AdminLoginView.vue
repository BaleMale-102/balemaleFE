<template>
  <div class="admin-login-container">
    <button @click="goHome" class="back-btn">←</button>
    <div class="login-card">
      <h2>관리자 로그인</h2>
      <div class="login-form">
        <input 
          v-model="id" 
          type="text" 
          inputmode="text" 
          autocomplete="username"
          placeholder="admin ID" 
        />
        <input 
          v-model="password" 
          type="password" 
          inputmode="text" 
          autocomplete="current-password"
          placeholder="admin password" 
        />
        <button @click="login" class="login-btn">Sign In</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AdminLogin',
  setup() {
    const router = useRouter()
    const id = ref('')
    const password = ref('')

    const login = () => {
      // 간단한 로그인 처리
      if (id.value && password.value) {
        router.push('/admin/screen')
      } else {
        alert('ID와 비밀번호를 입력하세요.')
      }
    }

    const goHome = () => {
      router.push('/')
    }

    return {
      id,
      password,
      login,
      goHome
    }
  }
}
</script>

<style scoped>
.admin-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
}

.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  z-index: 9999;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  border: 1px solid #000;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
}

.login-card h2 {
  text-align: center;
  margin-bottom: 30px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-form input {
  padding: 15px;
  border: 1px solid #000;
  font-size: 16px;
  box-sizing: border-box;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  touch-action: manipulation;
}

.login-btn {
  padding: 15px;
  border: 1px solid #000;
  background: #fff;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .login-card {
    padding: 30px;
    max-width: 100%;
  }

  .login-form input,
  .login-btn {
    padding: 12px;
    font-size: 14px;
  }
}

/* 태블릿 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .login-card {
    padding: 35px;
    max-width: 450px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .login-card {
    padding: 50px;
    max-width: 600px;
  }

  .login-form input,
  .login-btn {
    padding: 18px;
    font-size: 18px;
  }
}
</style>
