import { io, type Socket } from 'socket.io-client'
import { SOCKET_CHANNELS, SOCKET_EVENTS, type SiteSettingsRealtimePayload } from '../types/socket'

type SiteSettingsListener = (payload: SiteSettingsRealtimePayload) => void

const SOCKET_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5001'

let socketInstance: Socket | null = null
let connectionReadyHandler: ((payload: { socketId: string; timestamp: string }) => void) | null = null

function getSocketInstance() {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })
  }

  return socketInstance
}

export function connectSocket() {
  const socket = getSocketInstance()

  if (!connectionReadyHandler) {
    connectionReadyHandler = (payload) => {
      socket.emit('client:ready', payload)
    }
    socket.on(SOCKET_EVENTS.CONNECTION_READY, connectionReadyHandler)
  }

  if (!socket.connected) {
    socket.connect()
  }

  return socket
}

export function disconnectSocket() {
  if (!socketInstance) {
    return
  }

  if (connectionReadyHandler) {
    socketInstance.off(SOCKET_EVENTS.CONNECTION_READY, connectionReadyHandler)
    connectionReadyHandler = null
  }

  socketInstance.disconnect()
  socketInstance = null
}

export function subscribeToSiteSettings(listener: SiteSettingsListener) {
  const socket = connectSocket()

  socket.on(SOCKET_EVENTS.SITE_SETTINGS_UPDATED, listener)

  return () => {
    socket.off(SOCKET_EVENTS.SITE_SETTINGS_UPDATED, listener)
  }
}

export function getSocketConnectionStatus() {
  const socket = socketInstance

  return {
    connected: socket?.connected ?? false,
    connecting: socket ? socket.connected === false && socket.disconnected === false : false,
  }
}

export { SOCKET_CHANNELS, SOCKET_EVENTS }
