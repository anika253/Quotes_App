const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

let mongo_uri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongo_uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
