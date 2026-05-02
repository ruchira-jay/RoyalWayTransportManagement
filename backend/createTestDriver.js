// Script to create a test driver for testing the approval system
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createTestDriver = async () => {
  try {
    // Connect to MongoDB (without deprecated options)
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royalway');
    
    console.log('Connected to MongoDB');
    
    // Check if test driver already exists
    const existingDriver = await User.findOne({ email: 'testdriver@royalway.com' });
    
    if (existingDriver) {
      console.log('\n⚠️  Test driver already exists!');
      console.log('Email: testdriver@royalway.com');
      console.log('Status:', existingDriver.driverStatus);
      console.log('\nTo delete and recreate, run: node backend/deleteTestDriver.js');
      mongoose.connection.close();
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Create test driver
    const testDriver = await User.create({
      name: 'Test Driver',
      email: 'testdriver@royalway.com',
      password: hashedPassword,
      role: 'driver',
      dateOfBirth: new Date('1990-05-15'),
      phoneNumber: '0771234567',
      nicNumber: '901234567V',
      driverLicenseImage: 'test_license_123',
      assignedRoute: 'Kandy Town to Kurunegala',
      driverStatus: 'pending',
      createdAt: new Date()
    });
    
    console.log('\n✅ Test driver created successfully!');
    console.log('\n=== Driver Details ===');
    console.log('Name:', testDriver.name);
    console.log('Email:', testDriver.email);
    console.log('Password: password123');
    console.log('Phone:', testDriver.phoneNumber);
    console.log('NIC:', testDriver.nicNumber);
    console.log('Route:', testDriver.assignedRoute);
    console.log('Status:', testDriver.driverStatus);
    console.log('Age:', new Date().getFullYear() - new Date(testDriver.dateOfBirth).getFullYear());
    console.log('\n=== Next Steps ===');
    console.log('1. Refresh the Drivers page in the frontend');
    console.log('2. You should see the test driver with all details');
    console.log('3. Click "Approve" to test the approval flow');
    console.log('4. Try logging in with:');
    console.log('   Email: testdriver@royalway.com');
    console.log('   Password: password123');
    console.log('   (Should be blocked until approved)');
    
    mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestDriver();
