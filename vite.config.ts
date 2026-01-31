import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  // 로컬 개발: /api 요청을 백엔드(70.12.246.130:8080)로 프록시. .env에 VITE_API_BASE_URL=/api 또는 /api/v1 로 두면 프록시 사용
  // 지혜 노트북 ip http://70.12.246.130:8080
  // 지혜 데탑 ip http://192.168.0.19:8080
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://192.168.0.19:8080',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const setCookie = proxyRes.headers['set-cookie']
            if (setCookie) {
              const rewritten = setCookie.map((cookie: string) =>
                cookie.replace(/;\s*Domain=[^;]+/gi, '; Domain=localhost')
              )
              proxyRes.headers['set-cookie'] = rewritten
            }
          })
        }
      },
      '/images': {
        target: 'http://192.168.0.19:8080',
        changeOrigin: true
      }
    }
  }
  })