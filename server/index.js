require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/mood', require('./routes/mood'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/profile', require('./routes/profile'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'MindWell API is running', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`MindWell Server running on port ${PORT}`);
});

module.exports = app;
