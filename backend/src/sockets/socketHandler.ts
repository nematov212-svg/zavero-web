import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let ioInstance: SocketIOServer | null = null;

export const initSocket = (httpServer: HttpServer, allowedOrigins: string[]): SocketIOServer => {
  ioInstance = new SocketIOServer(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true,
    },
  });

  ioInstance.on('connection', (socket) => {
    console.log(`⚡ Client connected to WebSocket: ${socket.id}`);

    socket.on('join_director_room', () => {
      socket.join('director_room');
      console.log(`👑 Socket ${socket.id} joined director_room`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

export const getIO = (): SocketIOServer | null => {
  return ioInstance;
};

export const notifyNewLead = (lead: any) => {
  if (ioInstance) {
    ioInstance.to('director_room').emit('new_lead', lead);
    ioInstance.emit('stats_updated'); // broadcast to everyone (public site will refresh counters)
  }
};

export const notifyLeadStatusUpdated = (lead: any) => {
  if (ioInstance) {
    ioInstance.to('director_room').emit('lead_status_updated', lead);
  }
};

export const notifyCafeUpdated = (cafe: any) => {
  if (ioInstance) {
    ioInstance.to('director_room').emit('cafe_updated', cafe);
    ioInstance.emit('stats_updated'); // updates public counters (e.g. 2 -> 3 cafes)
  }
};

export const notifyOrderCreated = (order: any) => {
  if (ioInstance) {
    ioInstance.to('director_room').emit('order_created', order);
    ioInstance.emit('stats_updated'); // updates orders count on website in real-time
  }
};
