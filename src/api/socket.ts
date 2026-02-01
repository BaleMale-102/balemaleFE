import { ref } from 'vue'

// 주차장 실시간 데이터 / default 정의 필요
export const parkingData = ref(null)
let socket: WebSocket | null = null

export const connectSocket = () => {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
  ) {
    return
  }
  const socketUrl = import.meta.env.VITE_SOCKET_URL

  socket = new WebSocket(socketUrl)

  socket.onopen = () => {
    // console.log('웹소켓 연결 성공')
  }

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    parkingData.value = data
    // console.log('메시지 수신:', data)
  }

  socket.onclose = () => {
    // console.log('웹소켓 연결 종료')
    setTimeout(connectSocket, 5000) // 5초 후 재연결 시도
  }

  socket.onerror = (error) => {
    // console.error('웹소켓 오류:', error)
    socket?.close()
  }
}

export const sendMessage = (message: any) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message))
  }
}
