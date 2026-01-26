// 공용 응답 구조
export interface ApiResponse<T> {
  data: T
  message: string
  status: number
}

export interface Car {
  vehicleId: number
  plate: string
}

//관리자 응답 구조
export interface AdminResponse<T> {
  data: T
  message: string
  status: number
}

export interface AnomalyData {
  targetName: string
  timestamp: string
  description: string
}

// 주차완료된 차량 리스트 조회 응답 구조
export interface ParkedCar {
  vehicleId: number
  plate: string
  entryAt: string
  nodeCode: string
  totalMin: number
  amount: number
  parkedTime: string
}