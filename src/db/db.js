const { DB_NAME } = require('../constants.js');
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}\n`
    );
  } catch (error) {
    console.error('MongoDB connection error: ', error);
    process.exit(1);
  }
};

module.exports = connectDB;
