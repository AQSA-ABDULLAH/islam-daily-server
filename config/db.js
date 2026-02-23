const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://aqsaabdullah38403_db_user:FtBNJ0yjJukC3vwq@cluster0.yyjamcp.mongodb.net/"); // options removed
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit if DB fails
  }
};

module.exports = connectDB;
