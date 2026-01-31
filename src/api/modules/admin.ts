// 관리자 API 관련 코드
// #TODO: 백엔드 구현 후 수정 필요
import { adminInstance } from '../index'
import type {
  AdminLoginRequest,
  AdminLoginResponse,
  AnomalyEventsPageResponse
} from '../types'

/** 이상탐지 이벤트 목록 조회 (필터: sort=latest|oldest, type=HUMAN|OBSTACLE) */
export const getAnomalyEvents = (params?: {
  page?: number
  size?: number
  sort?: 'latest' | 'oldest'
  type?: 'HUMAN' | 'OBSTACLE'
}) => {
  const search = new URLSearchParams()
  if (params?.page != null) search.set('page', String(params.page))
  if (params?.size != null) search.set('size', String(params.size))
  if (params?.sort === 'latest') search.set('sort', 'occurredAt,desc')
  else if (params?.sort === 'oldest') search.set('sort', 'occurredAt,asc')
  if (params?.type) search.set('type', params.type)
  const query = search.toString()
  return adminInstance.get<AnomalyEventsPageResponse>(
    `/admin/anomaly-events${query ? `?${query}` : ''}`
  )
}

/** 관리자 로그인 (요청: username, password) */
export const postAdminLogin = (body: AdminLoginRequest) => {
  return adminInstance.post<AdminLoginResponse>('/admin/login', body)
}
