import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(isDirector: boolean = false) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const rawBase = import.meta.env.VITE_API_URL || '';
    const socketHost = rawBase
      ? (rawBase.startsWith('http') ? rawBase : `https://${rawBase}`)
      : 'https://zavero-backend.onrender.com';

    const socket = io(socketHost, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      if (isDirector) {
        socket.emit('join_director_room');
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [isDirector]);

  return { socket: socketRef.current, isConnected };
}
