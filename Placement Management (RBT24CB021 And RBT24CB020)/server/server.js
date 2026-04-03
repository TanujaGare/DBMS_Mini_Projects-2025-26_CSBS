try { require('dotenv').config(); } catch(e) {}
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Health check - no DB needed
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// DB middleware with error handling
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB Connection Error:', err.message);
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/drives', require('./routes/drives'));
app.use('/api/applications', require('./routes/applications'));

app.get('/', (req, res) => {
  res.json({ message: 'Placement Management API', status: 'running' });
});

module.exports = app;
