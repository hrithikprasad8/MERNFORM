//here we are going to write the database connection code later we call this in main file.
const colors = require("colors");
const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Mongodb connected successfully: ${conn.connection.host}`.yellow
    );
  } catch (error) {
    console.log(`Mongodb connection failed: ${error.message}`.red);
    process.exit(1);
  }
};

module.exports = connectDB;
