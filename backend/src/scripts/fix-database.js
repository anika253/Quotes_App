// Script to fix MongoDB indexes and migrate old user data
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for migration');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

const fixDatabase = async () => {
  try {
    await connectDB();
    
    // Drop the old phoneNumber unique index
    try {
      const collection = mongoose.connection.collection('users');
      const indexes = await collection.indexes();
      console.log('Current indexes:', indexes);
      
      // Check if phoneNumber index exists
      const phoneNumberIndex = indexes.find(idx => idx.key && idx.key.phoneNumber);
      if (phoneNumberIndex) {
        console.log('Dropping old phoneNumber index...');
        await collection.dropIndex('phoneNumber_1');
        console.log('✅ Old phoneNumber index dropped');
      } else {
        console.log('No phoneNumber index found');
      }
      
      // Clean up duplicate emails first
      console.log('Cleaning up duplicate emails...');
      const duplicates = await collection.aggregate([
        { $match: { email: { $ne: null } } },
        { $group: { _id: "$email", count: { $sum: 1 }, ids: { $push: "$_id" } } },
        { $match: { count: { $gt: 1 } } }
      ]).toArray();
      
      for (const dup of duplicates) {
        console.log(`Found ${dup.count} duplicates for email: ${dup._id}`);
        // Keep the first one, delete the rest
        const toDelete = dup.ids.slice(1);
        await collection.deleteMany({ _id: { $in: toDelete } });
        console.log(`  Deleted ${toDelete.length} duplicate(s)`);
      }
      
      // Delete users without passwords or emails (old OTP users)
      console.log('Cleaning up invalid users...');
      const invalidUsers = await collection.deleteMany({
        $or: [
          { email: { $exists: false } },
          { email: null },
          { email: "" },
          { password: { $exists: false } },
          { password: null }
        ]
      });
      console.log(`  Deleted ${invalidUsers.deletedCount} invalid user(s)`);
      
      // Ensure email index exists
      const emailIndex = indexes.find(idx => idx.key && idx.key.email);
      if (!emailIndex) {
        console.log('Creating email unique index...');
        try {
          await collection.createIndex({ email: 1 }, { unique: true, sparse: true });
          console.log('✅ Email unique index created');
        } catch (error) {
          console.log('⚠️  Could not create email index (may already exist or have duplicates):', error.message);
        }
      } else {
        console.log('Email index already exists');
      }
      
    } catch (error) {
      console.error('Error fixing indexes:', error.message);
    }
    
    // Migrate remaining users - remove phoneNumber field
    try {
      const usersWithPhone = await User.find({ 
        phoneNumber: { $exists: true }
      });
      
      console.log(`Found ${usersWithPhone.length} users with phoneNumber to clean up`);
      
      for (const user of usersWithPhone) {
        await User.updateOne({ _id: user._id }, { $unset: { phoneNumber: "" } });
        console.log(`✅ Cleaned user: ${user.email || user._id}`);
      }
      
      console.log('✅ Migration complete');
    } catch (error) {
      console.error('Error migrating users:', error.message);
    }
    
    await mongoose.connection.close();
    console.log('Database fix complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

fixDatabase();

