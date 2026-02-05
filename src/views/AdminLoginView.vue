<template>
  <div class="admin-login-container">
    <div class="header">
      <button type="button" @click="goHome" class="back-btn">
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
    </div>
    <div class="login-card">
      <h2>관리자 로그인</h2>
      <form class="login-form" @submit.prevent="login">
        <div class="group">
          <svg stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="icon" aria-hidden="true">
            <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" stroke-linejoin="round" stroke-linecap="round" />
          </svg>
          <input
            v-model="id"
            class="input"
            type="text"
            inputmode="text"
            autocomplete="username"
            placeholder="admin ID"
          />
        </div>
        <div class="group">
          <svg stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="icon" aria-hidden="true">
            <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" stroke-linejoin="round" stroke-linecap="round" />
          </svg>
          <input
            v-model="password"
            class="input"
            type="password"
            inputmode="text"
            autocomplete="current-password"
            placeholder="admin password"
          />
        </div>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '로그인 중...' : '로그인' }}
        </button>
      </form>
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
  height: 100vh;
  min-height: 0;
  width: 100%;
  background: var(--bg-page);
  padding: 20px;
  padding-top: 26px;
  padding-left: 70px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  margin-bottom: 190px;
  padding: 0 10px;
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

.login-card {
  flex: 0 0 auto;
  height: 400px;
  min-height: 400px;
  overflow-y: auto;
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
  font-weight: 800;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.group {
  display: flex;
  line-height: 30px;
  align-items: center;
  position: relative;
  max-width: 100%;
}

.input {
  width: 100%;
  height: 45px;
  line-height: 30px;
  padding: 0 5rem;
  padding-left: 3rem;
  border: 2px solid transparent;
  border-radius: 10px;
  outline: none;
  background-color: #f8fafc;
  color: #0d0c22;
  transition: 0.5s ease;
  font-size: 16px;
  box-sizing: border-box;
  -webkit-appearance: none;
  appearance: none;
  touch-action: manipulation;
}

.input::placeholder {
  color: #94a3b8;
}

.input:focus,
.input:hover {
  outline: none;
  border-color: rgba(129, 140, 248);
  background-color: #fff;
  box-shadow: 0 0 0 5px rgb(129 140 248 / 30%);
}

.icon {
  position: absolute;
  left: 1rem;
  fill: none;
  width: 1rem;
  height: 1rem;
  color: #94a3b8;
  pointer-events: none;
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

  .login-form .input {
    height: 44px;
    padding-left: 2.75rem;
    font-size: 14px;
  }

  .login-form .login-btn {
    padding: 12px;
    font-size: 14px;
  }
}

/* 태블릿 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .admin-login-container {
    padding: 16px;
    padding-top: 23px;
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
    padding-top: 26px;
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

  .login-form .input {
    height: 48px;
    padding-left: 3rem;
    font-size: 18px;
  }

  .login-form .login-btn {
    padding: 18px;
    font-size: 18px;
  }
}
</style>
