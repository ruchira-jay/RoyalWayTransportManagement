const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const User = require('../models/User');

// Get or create today's attendance for a student
const getTodayAttendance = async (studentId, driverId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let attendance = await Attendance.findOne({
    studentId,
    date: {
      $gte: today,
      $lt: tomorrow
    }
  });

  if (!attendance) {
    attendance = await Attendance.create({
      studentId,
      driverId,
      date: today
    });
  }

  return attendance;
};

// Mark morning pickup
const markMorningPickup = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { driverId } = req.body;

    const attendance = await getTodayAttendance(studentId, driverId);
    
    attendance.morningPickup.status = 'picked';
    attendance.morningPickup.time = new Date();
    await attendance.save();

    // Get student and parent info for notification
    const student = await Student.findById(studentId).populate('parentId');
    
    // TODO: Send notification to parent
    console.log(`Notification: Driver picked up ${student.childName}`);

    res.json({ 
      message: 'Morning pickup marked successfully',
      attendance 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark morning dropoff
const markMorningDropoff = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { driverId } = req.body;

    const attendance = await getTodayAttendance(studentId, driverId);
    
    attendance.morningDropoff.status = 'dropped';
    attendance.morningDropoff.time = new Date();
    await attendance.save();

    const student = await Student.findById(studentId).populate('parentId');
    
    console.log(`Notification: Driver dropped off ${student.childName} at school`);

    res.json({ 
      message: 'Morning dropoff marked successfully',
      attendance 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark evening pickup
const markEveningPickup = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { driverId } = req.body;

    const attendance = await getTodayAttendance(studentId, driverId);
    
    attendance.eveningPickup.status = 'picked';
    attendance.eveningPickup.time = new Date();
    await attendance.save();

    const student = await Student.findById(studentId).populate('parentId');
    
    console.log(`Notification: Driver picked up ${student.childName} from school`);

    res.json({ 
      message: 'Evening pickup marked successfully',
      attendance 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark evening dropoff
const markEveningDropoff = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { driverId } = req.body;

    const attendance = await getTodayAttendance(studentId, driverId);
    
    attendance.eveningDropoff.status = 'dropped';
    attendance.eveningDropoff.time = new Date();
    await attendance.save();

    const student = await Student.findById(studentId).populate('parentId');
    
    console.log(`Notification: Driver dropped off ${student.childName} at home`);

    res.json({ 
      message: 'Evening dropoff marked successfully',
      attendance 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark student as absent
const markAbsent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { driverId } = req.body;

    const attendance = await getTodayAttendance(studentId, driverId);
    
    attendance.isAbsent = true;
    attendance.morningPickup.status = 'absent';
    attendance.morningDropoff.status = 'absent';
    attendance.eveningPickup.status = 'absent';
    attendance.eveningDropoff.status = 'absent';
    await attendance.save();

    const student = await Student.findById(studentId).populate('parentId');
    
    console.log(`Notification: ${student.childName} marked as absent`);

    res.json({ 
      message: 'Student marked as absent',
      attendance 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get today's attendance for all students of a driver
const getTodayAttendanceForDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    
    // Get driver's route
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Get all students on this route
    const students = await Student.find({ route: driver.assignedRoute });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get attendance for each student
    const attendanceData = await Promise.all(
      students.map(async (student) => {
        let attendance = await Attendance.findOne({
          studentId: student._id,
          date: {
            $gte: today,
            $lt: tomorrow
          }
        });

        if (!attendance) {
          attendance = await Attendance.create({
            studentId: student._id,
            driverId,
            date: today
          });
        }

        return {
          student: {
            _id: student._id,
            childName: student.childName,
            childClass: student.childClass,
            parentName: student.parentName,
            studentId: student.studentId
          },
          attendance
        };
      })
    );

    res.json(attendanceData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get morning attendance report (for Attendance screen)
const getMorningAttendanceReport = async (req, res) => {
  try {
    const { driverId } = req.params;
    
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const students = await Student.find({ route: driver.assignedRoute });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const report = await Promise.all(
      students.map(async (student) => {
        const attendance = await Attendance.findOne({
          studentId: student._id,
          date: {
            $gte: today,
            $lt: tomorrow
          }
        });

        return {
          student: {
            _id: student._id,
            childName: student.childName,
            childClass: student.childClass,
            parentName: student.parentName,
            studentId: student.studentId
          },
          status: attendance?.isAbsent ? 'Absent' : 
                  attendance?.morningPickup.status === 'picked' ? 'Present' : 
                  'Not Marked',
          morningPickupTime: attendance?.morningPickup.time,
          eveningDropoffTime: attendance?.eveningDropoff.time,
          eveningDropoffStatus: attendance?.eveningDropoff.status
        };
      })
    );

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get child's attendance for parent
const getChildAttendance = async (req, res) => {
  try {
    const { parentId } = req.params;
    
    // Find student by parent ID
    const student = await Student.findOne({ parentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's attendance
    const attendance = await Attendance.findOne({
      studentId: student._id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (!attendance) {
      return res.json({
        childName: student.childName,
        status: 'Not Started',
        morningPickup: null,
        morningDropoff: null,
        eveningPickup: null,
        eveningDropoff: null,
        isAbsent: false
      });
    }

    res.json({
      childName: student.childName,
      status: attendance.isAbsent ? 'Absent' : 
              attendance.morningPickup.status === 'picked' ? 'Active' : 
              'Not Started',
      morningPickup: attendance.morningPickup,
      morningDropoff: attendance.morningDropoff,
      eveningPickup: attendance.eveningPickup,
      eveningDropoff: attendance.eveningDropoff,
      isAbsent: attendance.isAbsent
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance report for a specific date
const getAttendanceByDate = async (req, res) => {
  try {
    const { driverId, date } = req.params;
    
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const students = await Student.find({ route: driver.assignedRoute });

    // Parse the date string (format: YYYY-MM-DD)
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const report = await Promise.all(
      students.map(async (student) => {
        const attendance = await Attendance.findOne({
          studentId: student._id,
          date: selectedDate
        });

        return {
          student: {
            _id: student._id,
            childName: student.childName,
            childClass: student.childClass,
            parentName: student.parentName,
            studentId: student.studentId
          },
          status: attendance?.isAbsent ? 'Absent' : 
                  attendance?.morningPickup.status === 'picked' ? 'Present' : 
                  'Not Marked',
          morningPickupTime: attendance?.morningPickup.time,
          eveningDropoffTime: attendance?.eveningDropoff.time,
          eveningDropoffStatus: attendance?.eveningDropoff.status
        };
      })
    );

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset today's attendance (create fresh records)
const resetTodayAttendance = async (req, res) => {
  try {
    const { driverId } = req.params;
    
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const students = await Student.find({ route: driver.assignedRoute });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Delete today's attendance records
    await Attendance.deleteMany({
      driverId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Create fresh records
    const newRecords = await Promise.all(
      students.map(async (student) => {
        return await Attendance.create({
          studentId: student._id,
          driverId,
          date: today
        });
      })
    );

    res.json({ 
      message: 'Attendance reset successfully',
      recordsCreated: newRecords.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  markMorningPickup,
  markMorningDropoff,
  markEveningPickup,
  markEveningDropoff,
  markAbsent,
  getTodayAttendanceForDriver,
  getMorningAttendanceReport,
  getChildAttendance,
  getAttendanceByDate,
  resetTodayAttendance
};
