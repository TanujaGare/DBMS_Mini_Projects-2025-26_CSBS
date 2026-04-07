require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4000;

// Allow requests from any origin (set CORS_ORIGIN in Vercel env for production)
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true
}));
app.use(express.json());

// ── MongoDB Connection (serverless-friendly) ──
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// Ensure DB is connected before handling any request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// ── Routes ──
app.get('/', (req, res) => res.json({ message: 'Chef\'s Table API is alive' }));
app.use('/api/auth', authRoutes);
app.use('/api', authenticateToken, apiRoutes);

// ── Local Dev Server ──
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  }).catch(err => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
}

// Export for Vercel serverless
module.exports = app;
