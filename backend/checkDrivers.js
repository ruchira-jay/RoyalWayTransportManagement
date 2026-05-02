// Script to check and display all drivers in the database
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkDrivers = async () => {
  try {
    // Connect to MongoDB (without deprecated options)
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royalway');
    
    console.log('Connected to MongoDB');
    
    // Find all users with role 'driver'
    const drivers = await User.find({ role: 'driver' });
    
    console.log('\n=== DRIVERS IN DATABASE ===');
    console.log(`Total drivers found: ${drivers.length}\n`);
    
    if (drivers.length === 0) {
      console.log('No drivers found in database.');
    } else {
      drivers.forEach((driver, index) => {
        console.log(`Driver ${index + 1}:`);
        console.log(`  ID: ${driver._id}`);
        console.log(`  Name: ${driver.name || 'N/A'}`);
        console.log(`  Email: ${driver.email || 'N/A'}`);
        console.log(`  Phone: ${driver.phoneNumber || 'N/A'}`);
        console.log(`  NIC: ${driver.nicNumber || 'N/A'}`);
        console.log(`  Route: ${driver.assignedRoute || 'N/A'}`);
        console.log(`  Status: ${driver.driverStatus || 'N/A'}`);
        console.log(`  Date of Birth: ${driver.dateOfBirth || 'N/A'}`);
        console.log(`  Created: ${driver.createdAt || 'N/A'}`);
        console.log('---');
      });
    }
    
    // Check for old Driver model records
    const oldDriverCollection = mongoose.connection.collection('drivers');
    const oldDrivers = await oldDriverCollection.find({}).toArray();
    
    if (oldDrivers.length > 0) {
      console.log('\n=== OLD DRIVER COLLECTION FOUND ===');
      console.log(`Found ${oldDrivers.length} records in old 'drivers' collection`);
      console.log('These are from the old Driver model and should be deleted.');
      console.log('\nTo delete old records, run: node backend/cleanupOldDrivers.js');
    }
    
    mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkDrivers();
