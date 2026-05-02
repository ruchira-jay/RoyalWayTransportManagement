const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const User = require('../models/User');

// Get all attendance reports grouped by date
const getAllAttendanceReports = async (req, res) => {
  try {
    // Get all attendance records sorted by date (newest first)
    const attendanceRecords = await Attendance.find()
      .populate('studentId')
      .populate('driverId')
      .sort({ date: -1 })
      .limit(100); // Limit to last 100 records

    // Group by date
    const groupedByDate = {};
    
    for (const record of attendanceRecords) {
      const dateKey = record.date.toISOString().split('T')[0];
      
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = {
          date: dateKey,
          totalStudents: 0,
          present: 0,
          absent: 0,
          records: []
        };
      }
      
      groupedByDate[dateKey].totalStudents++;
      
      if (record.isAbsent) {
        groupedByDate[dateKey].absent++;
      } else if (record.morningPickup.status === 'picked') {
        groupedByDate[dateKey].present++;
      }
      
      groupedByDate[dateKey].records.push({
        studentName: record.studentId?.childName || 'Unknown',
        studentClass: record.studentId?.childClass || 'N/A',
        driverName: record.driverId?.name || 'Unknown',
        status: record.isAbsent ? 'Absent' : 
                record.morningPickup.status === 'picked' ? 'Present' : 'Not Marked',
        morningPickupTime: record.morningPickup.time,
        eveningDropoffTime: record.eveningDropoff.time
      });
    }
    
    // Convert to array
    const reports = Object.values(groupedByDate);
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance report for a specific date
const getAttendanceReportByDate = async (req, res) => {
  try {
    const { date } = req.params;
    
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const attendanceRecords = await Attendance.find({
      date: {
        $gte: selectedDate,
        $lt: nextDay
      }
    })
      .populate('studentId')
      .populate('driverId');
    
    const report = {
      date: date,
      totalStudents: attendanceRecords.length,
      present: 0,
      absent: 0,
      notMarked: 0,
      records: []
    };
    
    for (const record of attendanceRecords) {
      if (record.isAbsent) {
        report.absent++;
      } else if (record.morningPickup.status === 'picked') {
        report.present++;
      } else {
        report.notMarked++;
      }
      
      report.records.push({
        studentId: record.studentId?._id,
        studentName: record.studentId?.childName || 'Unknown',
        studentClass: record.studentId?.childClass || 'N/A',
        parentName: record.studentId?.parentName || 'Unknown',
        driverName: record.driverId?.name || 'Unknown',
        route: record.driverId?.assignedRoute || 'N/A',
        status: record.isAbsent ? 'Absent' : 
                record.morningPickup.status === 'picked' ? 'Present' : 'Not Marked',
        morningPickupTime: record.morningPickup.time,
        morningDropoffTime: record.morningDropoff.time,
        eveningPickupTime: record.eveningPickup.time,
        eveningDropoffTime: record.eveningDropoff.time
      });
    }
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get today's attendance
    const todayAttendance = await Attendance.find({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    // Get total counts
    const totalStudents = await Student.countDocuments();
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const totalParents = await User.countDocuments({ role: 'parent' });
    
    // Calculate today's stats
    let todayPresent = 0;
    let todayAbsent = 0;
    let todayNotMarked = 0;
    
    todayAttendance.forEach(record => {
      if (record.isAbsent) {
        todayAbsent++;
      } else if (record.morningPickup.status === 'picked') {
        todayPresent++;
      } else {
        todayNotMarked++;
      }
    });
    
    res.json({
      totalStudents,
      totalDrivers,
      totalParents,
      today: {
        date: today.toISOString().split('T')[0],
        present: todayPresent,
        absent: todayAbsent,
        notMarked: todayNotMarked,
        total: todayAttendance.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAttendanceReports,
  getAttendanceReportByDate,
  getDashboardStats
};
