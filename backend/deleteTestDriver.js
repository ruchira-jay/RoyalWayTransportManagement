// Script to delete the test driver
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const deleteTestDriver = async () => {
  try {
    // Connect to MongoDB (without deprecated options)
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royalway');
    
    console.log('Connected to MongoDB');
    
    // Delete test driver
    const result = await User.deleteOne({ email: 'testdriver@royalway.com' });
    
    if (result.deletedCount > 0) {
      console.log('✅ Test driver deleted successfully!');
    } else {
      console.log('⚠️  Test driver not found.');
    }
    
    mongoose.connection.close();
    console.log('Database connection closed.');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

deleteTestDriver();
