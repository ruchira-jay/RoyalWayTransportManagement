const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const driverRoutes = require('./routes/driverRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const locationRoutes = require('./routes/locationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const Attendance = require('./models/Attendance');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Database connection
connectDB();

// Schedule automatic attendance reset every day at 6:00 AM
cron.schedule('0 6 * * *', async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Delete old attendance records (older than today)
    const result = await Attendance.deleteMany({
      date: { $lt: today }
    });
    
    console.log(`[${new Date().toISOString()}] Automatic attendance cleanup: Deleted ${result.deletedCount} old records`);
  } catch (error) {
    console.error('Error in automatic attendance cleanup:', error);
  }
}, {
  timezone: "Asia/Colombo" // Sri Lanka timezone
});

console.log('Scheduled job: Attendance cleanup at 6:00 AM daily');

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to RoyalWay School Transportation System API' });
});

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'test.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/admin', adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
