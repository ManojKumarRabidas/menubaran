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
// Production origins come from FRONTEND_URL env var (comma-separated).
// In development, all localhost ports + common hosting domains are allowed.

const PROD_ORIGINS = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim()).filter(Boolean)
  : [];

// Patterns that are always trusted regardless of env var
const TRUSTED_PATTERNS = [
  /^https?:\/\/localhost(:\d+)?$/,            // any localhost port
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,         // loopback
  /\.vercel\.app$/,                            // Vercel preview + production
  /\.vercel\.run$/,                            // Vercel live preview
  /\.onrender\.com$/,                          // Render.com
  /\.railway\.app$/,                           // Railway
  /\.netlify\.app$/,                           // Netlify
  /\.ngrok\.io$/,                              // ngrok tunnels (local testing)
  /\.ngrok-free\.app$/,                        // ngrok free tier
];

function isOriginAllowed(origin) {
  if (!origin) return true;                                    // curl / Postman / mobile
  if (PROD_ORIGINS.includes(origin)) return true;             // explicit env list
  return TRUSTED_PATTERNS.some(pattern => pattern.test(origin)); // wildcard patterns
}

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) return callback(null, true);
    console.warn(`[CORS] Blocked origin: ${origin}`);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, // Some legacy browsers (IE11) choke on 204
};

// ── CRITICAL: preflight must be before helmet and everything else ─────────────
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// ── Security: HTTP headers ────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));

// ── Security: Rate limiting (500 req / 15 min per IP) ────────────────────────
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,                  // raised from 100 — multi-tab dev was hitting the cap
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