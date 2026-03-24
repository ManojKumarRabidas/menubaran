import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import routes from './routes.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Mount API routes
app.use('/api', routes);

// Socket.io Connection Handler
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // TODO: Define socket event handlers
  // socket.on('order:new', (data) => {
  //   console.log('[Socket] New order:', data);
  //   io.to(data.restaurantId).emit('order:new', data);
  // });

  // socket.on('order:statusUpdate', (data) => {
  //   console.log('[Socket] Order status update:', data);
  //   io.to(data.restaurantId).emit('order:statusUpdate', data);
  // });

  // socket.on('table:requestBill', (data) => {
  //   console.log('[Socket] Bill request:', data);
  //   io.to(data.restaurantId).emit('table:requestBill', data);
  // });

  // socket.on('table:requestWater', (data) => {
  //   console.log('[Socket] Water request:', data);
  //   io.to(data.restaurantId).emit('table:requestWater', data);
  // });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Export io so route handlers can emit events later
// io is exported so route handlers can call io.to(restaurantId).emit(...) when ready
export { io };

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});
