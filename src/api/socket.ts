let socket: WebSocket | null = null

export const connectSocket = () => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL

  socket = new WebSocket(socketUrl)

  socket.onopen = () => {
    console.log('웹소켓 연결 성공')
  }

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log('메시지 수신:', data)
    // 여기서 Pinia 스토어 등에 데이터를 업데이트할 수 있습니다.
  }

  socket.onclose = () => {
    console.log('웹소켓 연결 종료')
  }
}

export const sendMessage = (message: any) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message))
  }
}
