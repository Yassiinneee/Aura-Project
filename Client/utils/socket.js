import { io } from "socket.io-client";

let socket = null;

export function getSocket(token, email) {
  const BACKEND_URL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
    : (typeof window !== 'undefined' ? window.location.origin : '');

  if (!socket) {
    socket = io(BACKEND_URL, {
      auth: { token: token || localStorage.getItem('aura_token') },
      query: { email: email || '' },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

