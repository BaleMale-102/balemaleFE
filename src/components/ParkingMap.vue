<template>
  <div class="parking-map">
    <div class="map-label">주차장 맵 (고정)</div>
  </div>
</template>

<script>
export default {
  name: 'ParkingMap'
}
</script>

<style scoped>
.parking-map {
  border: 1px solid #000;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.map-label {
  text-align: center;
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .parking-map {
    min-height: 200px;
  }

  .map-label {
    font-size: 14px;
  }
}

/* 태블릿 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .parking-map {
    min-height: 250px;
  }

  .map-label {
    font-size: 16px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .parking-map {
    min-height: 400px;
  }

  .map-label {
    font-size: 18px;
  }
}
</style>
