// Script to clean up old driver collection records
require('dotenv').config();
const mongoose = require('mongoose');

const cleanupOldDrivers = async () => {
  try {
    // Connect to MongoDB (without deprecated options)
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royalway');
    
    console.log('Connected to MongoDB');
    
    // Check for old Driver collection
    const oldDriverCollection = mongoose.connection.collection('drivers');
    const oldDrivers = await oldDriverCollection.find({}).toArray();
    
    if (oldDrivers.length === 0) {
      console.log('No old driver records found. Database is clean!');
    } else {
      console.log(`Found ${oldDrivers.length} old driver records.`);
      console.log('Deleting old driver collection...');
      
      const result = await oldDriverCollection.deleteMany({});
      console.log(`Deleted ${result.deletedCount} old driver records.`);
      console.log('✓ Cleanup complete!');
    }
    
    mongoose.connection.close();
    console.log('Database connection closed.');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

cleanupOldDrivers();
