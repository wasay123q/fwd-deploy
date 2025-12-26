const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const User = require("./server/models/User");
const User = require('./models/User'); 
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");

    const adminEmail = "admin@gmail.com";
    const adminPassword = "wasay123";
    const adminUsername = "admin";

    // Check if admin exists
    const userExists = await User.findOne({ email: adminEmail });

    if (userExists) {
      console.log("⚠️ Admin user already exists");
      process.exit();
    }

    // Create admin user
    const user = await User.create({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    console.log("🎉 Admin user created successfully!");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);

    process.exit();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
