import { io } from 'socket.io-client';
export const upbitSocket = io(`/upbit`, { autoConnect: true });
