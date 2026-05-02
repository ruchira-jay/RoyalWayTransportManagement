const User = require('../models/User');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'royalway_secret_key', {
    expiresIn: '30d'
  });
};

// Calculate age from date of birth
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Register user
const register = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let userData = { name, email, password, role };

    // Parent registration
    if (role === 'parent') {
      const { children } = req.body;
      
      if (!children || !Array.isArray(children) || children.length === 0) {
        return res.status(400).json({ message: 'Please add at least one child' });
      }

      // Store first child info in user for backward compatibility
      userData.childName = children[0].childName;
      userData.childClass = children[0].childClass;
      userData.childDateOfBirth = children[0].childDateOfBirth;
      userData.selectedRoute = children[0].selectedRoute;
      userData.children = children; // Store all children
    }

    // Driver registration
    if (role === 'driver') {
      const { dateOfBirth, phoneNumber, nicNumber, driverLicenseImage, assignedRoute } = req.body;
      
      console.log('Driver fields:', { dateOfBirth, phoneNumber, nicNumber, driverLicenseImage, assignedRoute });
      
      if (!dateOfBirth || !phoneNumber || !nicNumber || !assignedRoute) {
        return res.status(400).json({ message: 'Please provide all driver details' });
      }

      // Check age requirement (25+)
      const age = calculateAge(dateOfBirth);
      console.log('Driver age:', age);
      if (age < 25) {
        return res.status(400).json({ message: `Driver must be at least 25 years old. Current age: ${age}` });
      }

      userData.dateOfBirth = dateOfBirth;
      userData.phoneNumber = phoneNumber;
      userData.nicNumber = nicNumber;
      userData.driverLicenseImage = driverLicenseImage;
      userData.assignedRoute = assignedRoute;
      userData.driverStatus = 'pending'; // Require admin approval
    }

    console.log('Creating user with data:', userData);
    // Create user
    const user = await User.create(userData);
    console.log('User created successfully:', user._id);

    // Create student record for parent
    if (role === 'parent') {
      // Create student records for all children
      for (const child of userData.children) {
        const studentId = `STU${Date.now()}${Math.floor(Math.random() * 1000)}`;
        
        // Find driver for this route
        const driver = await User.findOne({ 
          role: 'driver', 
          assignedRoute: child.selectedRoute,
          driverStatus: 'approved'
        });

        await Student.create({
          studentId,
          childName: child.childName,
          parentName: userData.name,
          childClass: child.childClass,
          childDateOfBirth: child.childDateOfBirth,
          route: child.selectedRoute,
          parentId: user._id,
          parentEmail: user.email,
          assignedDriver: driver ? driver._id : null
        });
      }
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      childName: user.childName,
      childClass: user.childClass,
      childDateOfBirth: user.childDateOfBirth,
      selectedRoute: user.selectedRoute,
      assignedRoute: user.assignedRoute,
      driverStatus: user.driverStatus,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Admin login (for frontend website)
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded admin credentials
    const ADMIN_EMAIL = 'admin@royalway.com';
    const ADMIN_PASSWORD = 'admin123';

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Create admin token
    const adminToken = jwt.sign(
      { id: 'admin', role: 'admin', email: ADMIN_EMAIL },
      process.env.JWT_SECRET || 'royalway_secret_key',
      { expiresIn: '30d' }
    );

    res.json({
      _id: 'admin',
      name: 'Admin',
      email: ADMIN_EMAIL,
      role: 'admin',
      token: adminToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user (for mobile app)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if driver is approved
    if (user.role === 'driver' && user.driverStatus !== 'approved') {
      if (user.driverStatus === 'pending') {
        return res.status(403).json({ message: 'Your account is pending approval. Please wait for admin approval.' });
      } else if (user.driverStatus === 'rejected') {
        return res.status(403).json({ message: 'Your account has been rejected. Please contact administration.' });
      }
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      childName: user.childName,
      childClass: user.childClass,
      childDateOfBirth: user.childDateOfBirth,
      selectedRoute: user.selectedRoute,
      assignedRoute: user.assignedRoute,
      phoneNumber: user.phoneNumber,
      nicNumber: user.nicNumber,
      dateOfBirth: user.dateOfBirth,
      driverLicenseImage: user.driverLicenseImage,
      driverStatus: user.driverStatus,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get driver by route
const getDriverByRoute = async (req, res) => {
  try {
    const { route } = req.params;
    
    const driver = await User.findOne({ 
      role: 'driver', 
      assignedRoute: route,
      driverStatus: 'approved'
    }).select('-password');

    if (!driver) {
      return res.status(404).json({ message: 'No driver assigned to this route yet' });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, adminLogin, getDriverByRoute };
