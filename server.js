// server.js
require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');

const sequelize           = require('./config/database');
const { errorHandler }    = require('./middleware/errorHandler');

// ── Import routes ─────────────────────────────────────────────────────────────
const authRoutes      = require('./routes/auth');
const categoryRoutes  = require('./routes/categories');
const productRoutes   = require('./routes/products');
const orderRoutes     = require('./routes/orders');
const addressRoutes   = require('./routes/addresses');
const adminRoutes = require('./routes/admin');
const deliverySlotRoutes = require('./routes/deliverySlots');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*',  // In production: restrict to your Flutter app domain / IP
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'Chopzy API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});
app.use('/uploads', express.static('public/uploads'));

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/categories',  categoryRoutes);
app.use('/api/products',    productRoutes);
app.use('/api/orders',      orderRoutes);
app.use('/api/addresses',   addressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/delivery-slots', deliverySlotRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found.`,
  });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);



// ── Start server ──────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log('✅ MySQL connected');

    // Sync models (creates tables if they don't exist; never drops data)
    await sequelize.sync({ alter: false });
    console.log('✅ Models synced');

    app.listen(PORT, () => {
      console.log(`\n🚀 Chopzy API running at http://localhost:${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/health`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
