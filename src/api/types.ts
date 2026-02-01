// 출차할(주차완료된) 차량 상세 조회 응답 구조
export interface ParkedCar {
  vehicleId: number
  plate: string
  status: string
  entryAt: string
  nodeCode: string
  totalMin: number
  amount: number
  parkedTime: string
}

// 등록된 차량 조회(조회/출차) 응답 구조
export interface RegisterCar {
  vehicleId: number
  plate: string
  status: string
}

// 차량 가능 잔여수 조회 api 호출 응답 구조(장애인/일반/총 잔여수)
export interface AvailableParkingCount {
  normalCount: number
  disabledCount: number
  totalCount: number
}

// 관리자 로그인 요청 body
export interface AdminLoginRequest {
  username: string
  password: string
}

// 관리자 로그인 응답 구조 (백엔드 구현 후 필드 추가/수정)
export interface AdminLoginResponse {
  token?: string
  // 백엔드 응답에 맞춰 추가
}

// 이상탐지 이벤트 단건 (admin/anomaly-events)
export interface AnomalyEvent {
  id: number
  type: string
  message: string
  status: string
  occurredAt: string
  fromNode: string
  toNode: string
  plate: string
}

// 이상탐지 이벤트 목록 페이지 응답
export interface AnomalyEventsPageResponse {
  content: AnomalyEvent[]
  totalElements: number
  page: number
  size: number
  totalPages: number
}

// 주차장 맵 데이터 단건 (GET /parking/map)
// slotId 기준 오름차순: 1-4 A1~A4(하단), 5-8 B1~B4(상단2행), 9-12 C1~C4(상단1행)
export interface ParkingMapSlot {
  slotId: number
  nodeCode: string
  nodeStatus: string // NORMAL | BLOCKED
  slotType: string // NORMAL | DISABLED
  slotStatus: string // EMPTY | OCCUPIED
}

