const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import models
const User = require('./models/User');
const Student = require('./models/Student');
const Attendance = require('./models/Attendance');
const Notification = require('./models/Notification');

async function viewDatabase() {
  try {
    console.log('\n' + '='.repeat(80));
    console.log('📊 ROYALWAY DATABASE VIEWER');
    console.log('='.repeat(80) + '\n');

    // Users Statistics
    console.log('👥 USERS COLLECTION:');
    console.log('-'.repeat(80));
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ role: 'admin' });
    const drivers = await User.countDocuments({ role: 'driver' });
    const parents = await User.countDocuments({ role: 'parent' });
    const approvedDrivers = await User.countDocuments({ role: 'driver', driverStatus: 'approved' });
    const pendingDrivers = await User.countDocuments({ role: 'driver', driverStatus: 'pending' });
    const rejectedDrivers = await User.countDocuments({ role: 'driver', driverStatus: 'rejected' });

    console.log(`Total Users: ${totalUsers}`);
    console.log(`  - Admins: ${admins}`);
    console.log(`  - Drivers: ${drivers} (Approved: ${approvedDrivers}, Pending: ${pendingDrivers}, Rejected: ${rejectedDrivers})`);
    console.log(`  - Parents: ${parents}`);
    console.log('');

    // List all users
    const allUsers = await User.find().select('-password');
    console.log('All Users:');
    allUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}${user.role === 'driver' ? ` - Status: ${user.driverStatus}` : ''}`);
    });
    console.log('');

    // Students Statistics
    console.log('👨‍🎓 STUDENTS COLLECTION:');
    console.log('-'.repeat(80));
    const totalStudents = await Student.countDocuments();
    console.log(`Total Students: ${totalStudents}`);
    console.log('');

    // List all students
    const allStudents = await Student.find().populate('parentId', 'name email').populate('assignedDriver', 'name phoneNumber');
    console.log('All Students:');
    allStudents.forEach((student, index) => {
      console.log(`  ${index + 1}. ${student.childName || student.name} (Class: ${student.childClass || student.grade})`);
      console.log(`     Parent: ${student.parentId?.name || student.parentName} (${student.parentEmail})`);
      console.log(`     Route: ${student.route}`);
      console.log(`     Driver: ${student.assignedDriver?.name || 'Not assigned'}`);
      console.log('');
    });

    // Attendance Statistics
    console.log(' ATTENDANCE COLLECTION:');
    console.log('-'.repeat(80));
    const totalAttendance = await Attendance.countDocuments();
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = await Attendance.countDocuments({ date: today });
    console.log(`Total Attendance Records: ${totalAttendance}`);
    console.log(`Today's Attendance Records: ${todayAttendance}`);
    console.log('');

    // Today's attendance details
    if (todayAttendance > 0) {
      const todayRecords = await Attendance.find({ date: today }).populate('studentId', 'childName name');
      console.log("Today's Attendance Details:");
      todayRecords.forEach((record, index) => {
        const studentName = record.studentId?.childName || record.studentId?.name || 'Unknown';
        const morningStatus = record.morningPickup?.status || 'pending';
        const eveningStatus = record.eveningDropoff?.status || 'pending';
        const absent = record.isAbsent ? 'ABSENT' : 'Present';
        console.log(`  ${index + 1}. ${studentName} - ${absent}`);
        console.log(`     Morning Pickup: ${morningStatus}${record.morningPickup?.time ? ` at ${new Date(record.morningPickup.time).toLocaleTimeString()}` : ''}`);
        console.log(`     Evening Dropoff: ${eveningStatus}${record.eveningDropoff?.time ? ` at ${new Date(record.eveningDropoff.time).toLocaleTimeString()}` : ''}`);
        console.log('');
      });
    }

    // Notifications Statistics
    console.log('🔔 NOTIFICATIONS COLLECTION:');
    console.log('-'.repeat(80));
    const totalNotifications = await Notification.countDocuments();
    const unreadNotifications = await Notification.countDocuments({ isRead: false });
    console.log(`Total Notifications: ${totalNotifications}`);
    console.log(`Unread Notifications: ${unreadNotifications}`);
    console.log('');

    // List recent notifications
    const recentNotifications = await Notification.find().sort({ createdAt: -1 }).limit(5);
    if (recentNotifications.length > 0) {
      console.log('Recent Notifications (Last 5):');
      recentNotifications.forEach((notif, index) => {
        console.log(`  ${index + 1}. [${notif.type}] ${notif.message}`);
        console.log(`     Created: ${new Date(notif.createdAt).toLocaleString()}`);
        console.log(`     Read: ${notif.isRead ? 'Yes' : 'No'}`);
        console.log('');
      });
    }

    console.log('='.repeat(80));
    console.log('Database view complete!');
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('Error viewing database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the viewer
viewDatabase();
