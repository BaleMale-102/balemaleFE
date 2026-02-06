<template>
  <div class="robot-status">
    <template v-if="lastRobotEvent">
      <span class="robot-status-label">주차로봇</span>
      <span :class="['robot-status-value', statusClass]">
        {{ statusLabel }}
      </span>
    </template>
    <span v-else class="robot-status-value robot-status-waiting">주차로봇 대기중</span>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useWsStore } from '@/stores/wsStore'
import { subscribeRobotEvent, unsubscribeRobotEvent } from '@/api/websocket/wsApi'
import type { RobotEventType } from '@/api/websocket/wsApi'

const ROBOT_EVENT_LABELS: Record<RobotEventType, string> = {
  ENTERING: '입차중',
  EXITING: '출차중',
  WAITING: '대기중',
  ESTOP: '일시멈춤',
  FAILED: '실패'
}

function eventTypeClass(type: RobotEventType): string {
  if (type === 'ESTOP' || type === 'FAILED') return 'badge--danger'
  if (type === 'WAITING') return 'badge--info'
  return 'badge--primary'
}

export default defineComponent({
  name: 'RobotStatus',
  setup() {
    const wsStore = useWsStore()
    const { lastRobotEvent } = storeToRefs(wsStore)

    const statusLabel = computed(() => {
      const type = lastRobotEvent.value?.robotOperationStatus
      return type != null ? (ROBOT_EVENT_LABELS[type] ?? type) : '대기중'
    })

    const statusClass = computed(() => {
      const type = lastRobotEvent.value?.robotOperationStatus
      return type != null ? eventTypeClass(type) : 'badge--info'
    })

    onMounted(() => {
      subscribeRobotEvent((data) => {
        wsStore.setRobotEvent(data)
      })
    })

    onUnmounted(() => {
      unsubscribeRobotEvent()
    })

    return {
      lastRobotEvent,
      statusLabel,
      statusClass
    }
  }
})
</script>

<style scoped>
.robot-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  padding: 1.25rem;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  color: var(--color-teal);
  font-weight: 700;
  font-size: clamp(1rem, 1.2vh, 1.125rem);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.robot-status-label {
  color: var(--color-teal);
}

.robot-status-value {
  color: var(--color-teal);
}

.robot-status-waiting {
  opacity: 0.9;
  font-size: clamp(1.5rem, 1.8vh, 1.6875rem);
}

.badge--primary {
  color: var(--color-teal);
}

.badge--info {
  color: var(--color-teal-light, #0dcaf0);
}

.badge--danger {
  color: #dc3545;
}

.robot-status .badge--primary,
.robot-status .badge--info,
.robot-status .badge--danger {
  background: transparent;
  padding: 0;
}

.robot-plate {
  font-size: 0.9em;
  font-weight: 600;
  color: var(--text-primary, #333);
  margin-left: 4px;
}
</style>
