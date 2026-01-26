import { publicInstance } from '../index'
import type { ApiResponse, Car, ParkedCar } from '../types'

// 차량 목록 조회 api 호출
export const getCars = () => {
  return publicInstance.get<ApiResponse<Car[]>>('/cars')
}

// 차량 등록 api 호출
export const registerCar = (newCar: Car) => {
  return publicInstance.post<ApiResponse<Car>>('/cars', newCar)
}

// 주차완료된 차량 리스트 조회 api 호출
export const getParkedCars = () => {
  return publicInstance.get<ApiResponse<ParkedCar[]>>('/entry/list') // TODO : url 주소 수정 필요
}