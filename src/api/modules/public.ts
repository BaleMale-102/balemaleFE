import { publicInstance } from '../index'

// 정산용 출차 차량 조회 (주차완료된 차량만 조회 가능) GET /parking/vehicle?vehicleId=
export const getParkedCars = (vehicleId: number) => {
  return publicInstance.get('/parking/vehicle', {
    params: { vehicleId }
  })
}

// 등록완료된 차량 중 뒷 4자리 같은 차량 조회 GET /parking/register-vehicles?vehicleFourNumber=
export const getRegisterCars = (vehicleFourNumber: string) => {
  return publicInstance.get('/parking/register-vehicles', {
    params: { vehicleFourNumber }
  })
}

// 차량 가능 잔여수 조회 api 호출
export const getAvailableParkingCount = () => {
  return publicInstance.get('/parking/remaining-number')
}

// 주차장 맵 데이터 조회 (모든 주차칸 정보, slotId 오름차순)
export const getParkingMap = () => {
  return publicInstance.get('/parking/map')
}