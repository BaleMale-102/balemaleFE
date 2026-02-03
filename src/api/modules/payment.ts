import { publicInstance } from '../index'
import type { PreparePaymentResponse } from '../types'

// 결제 준비 (prepare) - 전체 주소 예: http://192.168.0.19:8080/api/v1/payments/prepare
// storeId, channelKey는 프론트 env에서 전달
export const preparePayment = (params: Record<string, unknown> = {}) => {
  const storeId = import.meta.env.VITE_STORE_ID
  const channelKey = import.meta.env.VITE_CHANNEL_KEY
  return publicInstance.post<PreparePaymentResponse>('/payments/prepare', {
    storeId,
    channelKey,
    ...params
  })
}