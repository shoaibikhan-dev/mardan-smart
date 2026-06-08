const express    = require('express');
const helmet     = require('helmet');
const morgan     = require('morgan');
const path       = require('path');
const rateLimit  = require('express-rate-limit');
const promClient = require('prom-client');
const compression = require('compression');
require('dotenv').config();

const { connectDB } = require('./config/db');
const { connectRedis } = require('./config/redis');
const app = express();

// ── Prometheus: collect BEFORE any routes so all metrics are captured ─────────
promClient.collectDefaultMetrics({ prefix: 'msc_' });

// Connect Database
connectDB();
connectRedis();

// ── Gzip Compression ──────────────────────────────────────────────────────────
app.use(compression());

// ── CORS (Custom bulletproof middleware) ──────────────────────────────────────
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin',  req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
}));

// ── Logging ───────────────────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Body Parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Rate Limiters ─────────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many registration attempts. Please try again in 1 hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Static Uploads ────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes         = require('./routes/authRoutes');
const complaintRoutes    = require('./routes/complaintRoutes');
const userRoutes         = require('./routes/userRoutes');
const categoryRoutes     = require('./routes/categoryRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.post('/api/auth/login',    loginLimiter);
app.post('/api/auth/register', registerLimiter);

app.use('/api/auth',          authRoutes);
app.use('/api/complaints',    complaintRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/categories',    categoryRoutes);
app.use('/api/notifications', notificationRoutes);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status:    'OK',
    project:   'Mardan Smart City Complaint Portal',
    version:   process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    uptime:    process.uptime(),
  });
});

// ── Prometheus Metrics Endpoint ───────────────────────────────────────────────
app.get('/api/metrics', async (_req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.send(await promClient.register.metrics());
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.status ? err.message : 'Internal Server Error',
  });
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🏙️  Mardan Smart City API → http://localhost:${PORT}`);
  console.log(`📊  Metrics          → http://localhost:${PORT}/api/metrics`);
  console.log(`❤️   Health           → http://localhost:${PORT}/api/health`);
});

module.exports = app;
