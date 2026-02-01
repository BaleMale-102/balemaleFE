/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_STORE_ID: string
  readonly VITE_CHANNEL_KEY: string
  readonly VITE_PAYMENT_WEBHOOK_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    PortOne?: {
      requestPayment: (options: Record<string, unknown>) => Promise<{ code?: string; message?: string } | undefined>
    }
  }
}

export {}
