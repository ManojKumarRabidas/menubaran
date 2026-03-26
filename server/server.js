// import express from 'express';
// import cors from 'cors';
// import http from 'http';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import { Server as SocketIO } from 'socket.io';
// import mongoose from 'mongoose';
// import routes from './routes/index.js';
// import { runSeed } from './scripts/seed.js';
// import dotenv from 'dotenv';
// dotenv.config();

// const app = express();
// const server = http.createServer(app);
// app.use(helmet());

// // ── Security: Rate limiting (100 req / 15 min per IP) ──────────────────────
// app.use('/api', rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { error: 'Too many requests, please try again later.' }
// }));

// // ── Middleware ───────────────────────────────────────────────────────────────
// app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
// app.use(express.json({ limit: '10kb' })); // Security: body size limit

// // ── Routes ───────────────────────────────────────────────────────────────────
// app.get("/", (req, res) => {
//   res.send("API is running");
// });
// app.use('/api', routes);

// // ── Socket.io ────────────────────────────────────────────────────────────────
// const io = new SocketIO(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || '*',
//     methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   }
// });

// // Security: per-IP socket connection cap
// const ipConnections = new Map();
// const MAX_CONNECTIONS_PER_IP = 10;

// io.on('connection', (socket) => {
//   const ip = socket.handshake.address;
//   const count = (ipConnections.get(ip) ?? 0) + 1;

//   if (count > MAX_CONNECTIONS_PER_IP) {
//     socket.disconnect(true);
//     return;
//   }

//   ipConnections.set(ip, count);
//   console.log(`[Socket] Connected: ${socket.id} | IP: ${ip} | Active: ${count}`);

//   // TODO: Define socket event handlers here
//   // socket.on('order:new', (data) => { ... });

//   socket.on('disconnect', () => {
//     const remaining = (ipConnections.get(ip) ?? 1) - 1;
//     remaining > 0 ? ipConnections.set(ip, remaining) : ipConnections.delete(ip);
//     console.log(`[Socket] Disconnected: ${socket.id}`);
//   });
// });

// export { io };

// // ── Bootstrap ────────────────────────────────────────────────────────────────
// const PORT = process.env.PORT || 5000;

// // Catch-all: shows every unmatched route — remove after debugging
// app.use((req, res) => {
//   res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
// });

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(async () => {
//     console.log('[DB] Connected to MongoDB');
//     await runSeed();                          // idempotent — safe every startup
//     server.listen(PORT, () =>
//       console.log(`[Server] Running on http://localhost:${PORT}`)
//     );
//   })
//   .catch((err) => {
//     console.error('[DB] Connection failed:', err.message);
//     process.exit(1);
//   });


import express from 'express';
import cors from 'cors';
import http from 'http';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server as SocketIO } from 'socket.io';
import mongoose from 'mongoose';
import routes from './routes/index.js';
import { runSeed } from './scripts/seed.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);

// ── CORS config (shared — used by both Express and Socket.io) ────────────────
// Supports multiple origins: FRONTEND_URL=http://localhost:3000,https://yourapp.com
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
  : ['http://localhost:3000'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ── CRITICAL: preflight must be before helmet and everything else ─────────────
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// ── Security: HTTP headers ────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));

// ── Security: Rate limiting (100 req / 15 min per IP) ────────────────────────
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}));

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.send('API is running'));
app.use('/api', routes);

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Cannot ${req.method} ${req.path}` });
});

// ── Socket.io ─────────────────────────────────────────────────────────────────
const io = new SocketIO(server, { cors: corsOptions });

const ipConnections = new Map();
const MAX_CONNECTIONS_PER_IP = 10;

io.on('connection', (socket) => {
  const ip = socket.handshake.address;
  const count = (ipConnections.get(ip) ?? 0) + 1;

  if (count > MAX_CONNECTIONS_PER_IP) {
    socket.disconnect(true);
    return;
  }

  ipConnections.set(ip, count);
  console.log(`[Socket] Connected: ${socket.id} | IP: ${ip} | Active: ${count}`);

  // TODO: Define socket event handlers here

  socket.on('disconnect', () => {
    const remaining = (ipConnections.get(ip) ?? 1) - 1;
    remaining > 0 ? ipConnections.set(ip, remaining) : ipConnections.delete(ip);
    console.log(`[Socket] Disconnected: ${socket.id}`);
  });
});

export { io };

// ── Bootstrap ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('[DB] Connected to MongoDB');
    await runSeed();
    server.listen(PORT, () =>
      console.log(`[Server] Running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('[DB] Connection failed:', err.message);
    process.exit(1);
  });