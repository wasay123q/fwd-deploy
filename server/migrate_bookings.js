// Migration script to add booking references to existing payments
require("dotenv").config();
const mongoose = require("mongoose");
const Payment = require("./models/Payment");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/tourist_app");
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

const migrateBookings = async () => {
  try {
    await connectDB();

    // Find all payments without a booking reference
    const paymentsWithoutRef = await Payment.find({ 
      $or: [
        { bookingReference: { $exists: false } },
        { bookingReference: null },
        { bookingReference: "" }
      ]
    });

    console.log(`\n📋 Found ${paymentsWithoutRef.length} payments without booking references\n`);

    if (paymentsWithoutRef.length === 0) {
      console.log("✅ All payments already have booking references!");
      process.exit(0);
    }

    const year = new Date().getFullYear();
    let counter = 1;

    for (const payment of paymentsWithoutRef) {
      const bookingReference = `BOOK-${year}-${String(counter).padStart(5, '0')}`;
      
      payment.bookingReference = bookingReference;
      await payment.save();
      
      console.log(`✅ Updated payment ${payment._id} -> ${bookingReference}`);
      counter++;
    }

    console.log(`\n🎉 Migration complete! Updated ${paymentsWithoutRef.length} payments.\n`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
};

// Run migration
migrateBookings();
