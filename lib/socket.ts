import { io, Socket } from 'socket.io-client';
import { tokens } from './tokens';

const CHAT_WS_URL =
  process.env.NEXT_PUBLIC_CHAT_WS_URL ?? 'http://localhost:3003';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(CHAT_WS_URL, {
      autoConnect: false,
      auth: {
        token: tokens.getAccess(),
      },
      extraHeaders: {
        authorization: `Bearer ${tokens.getAccess()}`,
      },
    });
  }
  return socket;
}

export function connectSocket(): void {
  const s = getSocket();
  const token = tokens.getAccess();
  s.auth = { token };
  (s.io.opts.extraHeaders as Record<string, string>).authorization =
    `Bearer ${token}`;
  if (!s.connected) s.connect();
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
