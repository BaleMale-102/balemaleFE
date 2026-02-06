import axios, { type AxiosInstance } from 'axios'

// 개발: VITE_API_BASE_URL 없으면 '/api' 사용 → Vite 프록시(5173→8080). 프록시 쓰려면 .env.development 에 VITE_API_BASE_URL=/api 로 설정
// 배포: .env 에 백엔드 전체 URL (예: https://서버/api/v1) 설정
const apiBaseURL =
  import.meta.env.VITE_API_BASE_URL 

// 공용 인스턴스
export const publicInstance: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
})

// 관리자 인스턴스 (쿠키 세션: JSESSIONID, withCredentials로 쿠키 전송)
export const adminInstance: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

// 관리자 인스턴스 전용 응답 인터셉터 (401, 403 시 로그인 페이지로)
adminInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      alert('세션이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)
