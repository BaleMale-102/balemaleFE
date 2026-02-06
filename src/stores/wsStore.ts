// src/stores/wsStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  PaymentStatus,
  PaymentData,
  RobotEventType,
  RobotEventData
} from '@/api/websocket/wsApi'

export const useWsStore = defineStore('ws', () => {
  const lastPayment = ref<PaymentData | null>(null)
  const lastRobotEvent = ref<RobotEventData | null>(null)

  const setPaymentStatus = (data: PaymentData) => {
    lastPayment.value = data
    console.log('[WS Store] Payment Updated:', data)
  }

  const setRobotEvent = (data: RobotEventData) => {
    lastRobotEvent.value = data
    console.log('[WS Store] Robot Event:', lastRobotEvent.value)
  }

  return {
    lastPayment,
    lastRobotEvent,
    setPaymentStatus,
    setRobotEvent
  }
})
