const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/royalway';

async function cleanupIncompleteDrivers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Find incomplete drivers (missing required fields)
    const incompleteDrivers = await User.find({
      role: 'driver',
      $or: [
        { phoneNumber: { $exists: false } },
        { phoneNumber: null },
        { phoneNumber: '' },
        { nicNumber: { $exists: false } },
        { nicNumber: null },
        { nicNumber: '' },
        { assignedRoute: { $exists: false } },
        { assignedRoute: null },
        { assignedRoute: '' }
      ]
    });

    console.log('=== INCOMPLETE DRIVERS CLEANUP ===\n');
    console.log(`Found ${incompleteDrivers.length} incomplete driver(s)\n`);

    if (incompleteDrivers.length === 0) {
      console.log('✓ No incomplete drivers found. Database is clean!\n');
      await mongoose.connection.close();
      return;
    }

    console.log('Incomplete drivers to be deleted:\n');
    incompleteDrivers.forEach((driver, index) => {
      console.log(`${index + 1}. ${driver.name || 'No Name'}`);
      console.log(`   Email: ${driver.email}`);
      console.log(`   ID: ${driver._id}`);
      console.log(`   Missing: ${!driver.phoneNumber ? 'Phone ' : ''}${!driver.nicNumber ? 'NIC ' : ''}${!driver.assignedRoute ? 'Route' : ''}`);
      console.log('');
    });

    // Delete incomplete drivers
    const result = await User.deleteMany({
      role: 'driver',
      $or: [
        { phoneNumber: { $exists: false } },
        { phoneNumber: null },
        { phoneNumber: '' },
        { nicNumber: { $exists: false } },
        { nicNumber: null },
        { nicNumber: '' },
        { assignedRoute: { $exists: false } },
        { assignedRoute: null },
        { assignedRoute: '' }
      ]
    });

    console.log(`✓ Deleted ${result.deletedCount} incomplete driver(s)\n`);

    // Show remaining drivers
    const remainingDrivers = await User.find({ role: 'driver' });
    console.log(`Remaining drivers: ${remainingDrivers.length}\n`);

    if (remainingDrivers.length > 0) {
      console.log('Complete drivers in database:\n');
      remainingDrivers.forEach((driver, index) => {
        console.log(`${index + 1}. ${driver.name}`);
        console.log(`   Email: ${driver.email}`);
        console.log(`   Phone: ${driver.phoneNumber}`);
        console.log(`   Status: ${driver.driverStatus}`);
        console.log('');
      });
    }

    console.log('✓ Cleanup complete!');
    console.log('\nNext steps:');
    console.log('1. Refresh the frontend Drivers page');
    console.log('2. You should now see only complete driver records');
    console.log('3. All driver details should display correctly\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

cleanupIncompleteDrivers();
