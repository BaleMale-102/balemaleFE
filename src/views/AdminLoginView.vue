<template>
  <div class="admin-login-container">
    <div class="header">
      <button @click="goHome" class="back-btn">←</button>
    </div>
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
        <button @click="login" class="login-btn" :disabled="loading">
          {{ loading ? '로그인 중...' : 'Sign In' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { postAdminLogin } from '@/api/modules/admin'

export default {
  name: 'AdminLogin',
  data() {
    return {
      id: '',
      password: '',
      loading: false
    }
  },
  methods: {
    async login() {
      if (!this.id || !this.password) {
        alert('ID와 비밀번호를 입력하세요.')
        return
      }
      this.loading = true
      try {
        await postAdminLogin({ username: this.id, password: this.password })
        this.$router.push('/admin/detail')
      } catch (e) {
        const msg = e.response?.data?.message ?? e.response?.status === 401
          ? 'ID 또는 비밀번호가 올바르지 않습니다.'
          : '로그인에 실패했습니다. 다시 시도해주세요.'
        alert(msg)
      } finally {
        this.loading = false
      }
    },
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.admin-login-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background: var(--bg-page);
  padding: 20px;
  padding-top: 80px;
  padding-left: 70px;
  box-sizing: border-box;
  position: relative;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 190px;
  padding: 0 10px;
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--color-primary);
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

.login-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  box-sizing: border-box;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.login-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: var(--color-teal);
  font-weight: 700;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-form input {
  padding: 15px;
  border: 2px solid var(--border-light);
  font-size: 16px;
  box-sizing: border-box;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  touch-action: manipulation;
  border-radius: var(--radius-btn);
  background: var(--bg-card);
  color: var(--text-primary);
  transition: border-color 0.2s;
}

.login-form input:focus {
  outline: none;
  border-color: var(--color-teal-light);
}

.login-btn {
  padding: 15px;
  border: none;
  background: var(--gradient-primary);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--radius-btn);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
  transition: box-shadow 0.2s, transform 0.1s;
}

.login-btn:hover {
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.45);
  transform: translateY(-1px);
}

.login-btn:active {
  transform: translateY(0);
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .admin-login-container {
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

  .login-card {
    padding: 30px;
    max-width: 100%;
    border-radius: 6px;
  }

  .login-card h2 {
    font-size: 20px;
    margin-bottom: 24px;
  }

  .login-form {
    gap: 16px;
  }

  .login-form input,
  .login-btn {
    padding: 12px;
    font-size: 14px;
  }
}

/* 태블릿 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .admin-login-container {
    padding: 16px;
    padding-top: 72px;
    padding-left: 16px;
  }

  .login-card {
    padding: 35px;
    max-width: 450px;
  }

  .login-form {
    gap: 18px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .admin-login-container {
    padding: 24px;
    padding-left: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    padding: 0;
  }

  .login-card {
    padding: 50px;
    max-width: 600px;
  }

  .login-card h2 {
    font-size: 28px;
    margin-bottom: 36px;
  }

  .login-form {
    gap: 24px;
  }

  .login-form input,
  .login-btn {
    padding: 18px;
    font-size: 18px;
  }
}
</style>
