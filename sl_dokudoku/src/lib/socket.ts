import { io, Socket } from 'socket.io-client';

interface Collaborator {
  id: string;
  name: string;
  email: string;
}

export function useSocket() {
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
  return socket;
} 