const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/royalway';

async function diagnoseDriverIssue() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Get all drivers
    const drivers = await User.find({ role: 'driver' });
    
    console.log('=== DRIVER DATA DIAGNOSIS ===\n');
    console.log(`Total Drivers Found: ${drivers.length}\n`);

    if (drivers.length === 0) {
      console.log('❌ No drivers found in database');
      console.log('Solution: Register a driver through the mobile app\n');
      await mongoose.connection.close();
      return;
    }

    // Check each driver's data completeness
    console.log('Checking data completeness for each driver:\n');
    
    let completeDrivers = 0;
    let incompleteDrivers = 0;

    drivers.forEach((driver, index) => {
      const hasAllFields = driver.name && driver.email && driver.phoneNumber && 
                          driver.nicNumber && driver.assignedRoute;
      
      if (hasAllFields) {
        completeDrivers++;
      } else {
        incompleteDrivers++;
      }

      console.log(`${index + 1}. ${driver.name || 'MISSING NAME'}`);
      console.log(`   ID: ${driver._id}`);
      console.log(`   Email: ${driver.email || '❌ MISSING'}`);
      console.log(`   Phone: ${driver.phoneNumber || '❌ MISSING'}`);
      console.log(`   NIC: ${driver.nicNumber || '❌ MISSING'}`);
      console.log(`   Route: ${driver.assignedRoute || '❌ MISSING'}`);
      console.log(`   Status: ${driver.driverStatus || 'pending'}`);
      console.log(`   Complete: ${hasAllFields ? '✓ YES' : '❌ NO'}`);
      console.log('');
    });

    console.log('=== SUMMARY ===\n');
    console.log(`Complete Drivers (all fields): ${completeDrivers}`);
    console.log(`Incomplete Drivers (missing fields): ${incompleteDrivers}\n`);

    if (incompleteDrivers > 0) {
      console.log('⚠️  ISSUE DETECTED: Some drivers have incomplete data\n');
      console.log('This happens when:');
      console.log('1. Drivers were created before all fields were added to the schema');
      console.log('2. Registration process was incomplete');
      console.log('3. Database migration issues\n');
      
      console.log('SOLUTIONS:\n');
      console.log('Option 1: Clean up incomplete drivers');
      console.log('  Run: node cleanupOldDrivers.js\n');
      
      console.log('Option 2: Manually update incomplete drivers in MongoDB\n');
      
      console.log('Option 3: Keep them (they won\'t break the system)\n');
    } else {
      console.log('✓ All drivers have complete data\n');
    }

    // Check if backend is returning data correctly
    console.log('=== BACKEND API CHECK ===\n');
    console.log('The backend should return drivers with these fields:');
    console.log('- _id');
    console.log('- name');
    console.log('- email');
    console.log('- phoneNumber');
    console.log('- nicNumber');
    console.log('- assignedRoute');
    console.log('- driverStatus');
    console.log('- dateOfBirth');
    console.log('- createdAt\n');

    console.log('Sample driver object that backend returns:');
    if (drivers[0]) {
      const sampleDriver = {
        _id: drivers[0]._id,
        name: drivers[0].name,
        email: drivers[0].email,
        phoneNumber: drivers[0].phoneNumber,
        nicNumber: drivers[0].nicNumber,
        assignedRoute: drivers[0].assignedRoute,
        driverStatus: drivers[0].driverStatus,
        dateOfBirth: drivers[0].dateOfBirth,
        createdAt: drivers[0].createdAt
      };
      console.log(JSON.stringify(sampleDriver, null, 2));
    }

    console.log('\n=== FRONTEND TROUBLESHOOTING ===\n');
    console.log('If drivers are not showing in frontend:');
    console.log('1. Check if backend is running: http://localhost:5000');
    console.log('2. Check browser console for errors (F12)');
    console.log('3. Check Network tab for API calls');
    console.log('4. Verify API endpoint: GET /api/drivers');
    console.log('5. Check CORS settings');
    console.log('6. Clear browser cache and reload\n');

    console.log('If drivers show but details are "N/A":');
    console.log('1. Check if driver has all required fields (see above)');
    console.log('2. Verify field names match in frontend code');
    console.log('3. Check console.log in Drivers.js for API response\n');

    await mongoose.connection.close();
    console.log('✓ Diagnosis complete');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

diagnoseDriverIssue();
