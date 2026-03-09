require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');

const seedUsers = async () => {
  await connectDB();
  
  const users = [
    { name: 'Admin User', email: 'admin@vibrix.edu', password: 'admin123', role: 'admin', department: 'Administration' },
    { name: 'Faculty User', email: 'faculty@vibrix.edu', password: 'faculty123', role: 'faculty', department: 'Computer Science' },
    { name: 'Student User', email: 'student@vibrix.edu', password: 'student123', role: 'student', department: 'IT' }
  ];

  for (const userData of users) {
    try {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`${userData.role} already exists (${userData.email}). Removing and recreating...`);
        await User.deleteOne({ email: userData.email });
      }
      
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        passwordHash: hashedPassword
      });
      await user.save();
      console.log(`Created ${userData.role}:`, user.email);
    } catch (err) {
      console.log(`Error creating ${userData.role}:`, err.message);
    }
  }
  
  mongoose.connection.close();
};

seedUsers();
