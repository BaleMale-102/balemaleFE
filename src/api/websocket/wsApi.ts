import { subscribe, unsubscribe } from '@/api/websocket/stompClient'

export type PaymentStatus = 'READY' | 'PAID' | 'FAILED'

export type PaymentData = {
  paymentId: string
  paid: number // Integer는 TypeScript에서 number로 처리합니다.
  paymentStatus: PaymentStatus
  reasonMessage: string | null
}

export type RobotEventType =
  | 'ENTERING'   // 입차중
  | 'EXITING'    // 출차중
  | 'WAITING'    // 대기중
  | 'ESTOP'      // 이상상태 감지 후 멈춤
  | 'FAILED'     // 실패

export type RobotEventData = {
  robotId: string
  plate: string
  robotOperationStatus: RobotEventType
}

export const subscribePaymentStatus = (handler: (e: PaymentData) => void) => {
  subscribe('payment-status', '/balemale/queue/kiosk/payment', handler)
  console.log('subscribePaymentStatus')
}

export const unsubscribePaymentStatus = () => unsubscribe('payment-status')

export const subscribeRobotEvent = (handler: (e: RobotEventData) => void) =>
  subscribe('robot-event', '/balemale/queue/kiosk/robot', handler)

export const unsubscribeRobotEvent = () => unsubscribe('robot-event')
