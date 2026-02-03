<template>
  <div class="loading-panel">
    <div class="loading-panel__inner">
      <LoadingLoader />
      <span>조회 중...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingLoader from './LoadingLoader.vue'
</script>

<style scoped>
.loading-panel__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
</style>
