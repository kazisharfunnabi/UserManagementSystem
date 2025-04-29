const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace 'your_database_name' with the actual name of your database
    await mongoose.connect('mongodb://localhost:27017/userDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  }
};

module.exports = connectDB;
