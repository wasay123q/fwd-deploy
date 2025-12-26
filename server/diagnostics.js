// Diagnostic script to check system health
require("dotenv").config();
const mongoose = require("mongoose");
const Payment = require("./models/Payment");
const User = require("./models/User");

const runDiagnostics = async () => {
  console.log('\n🔍 Running System Diagnostics...\n');
  
  try {
    // Check MongoDB connection
    console.log('1️⃣ Checking MongoDB connection...');
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/travelApp"
    );
    console.log('✅ MongoDB connected successfully\n');
    
    // Check payments collection
    console.log('2️⃣ Checking Payments collection...');
    const totalPayments = await Payment.countDocuments();
    const pendingPayments = await Payment.countDocuments({ verificationStatus: 'pending' });
    const verifiedPayments = await Payment.countDocuments({ verificationStatus: 'verified' });
    const rejectedPayments = await Payment.countDocuments({ verificationStatus: 'rejected' });
    const suspendedPayments = await Payment.countDocuments({ verificationStatus: 'suspended' });
    
    console.log(`   Total Payments: ${totalPayments}`);
    console.log(`   ⏳ Pending: ${pendingPayments}`);
    console.log(`   ✅ Verified: ${verifiedPayments}`);
    console.log(`   ❌ Rejected: ${rejectedPayments}`);
    console.log(`   ⏸️  Suspended: ${suspendedPayments}\n`);
    
    // Check for payments without booking reference
    const paymentsWithoutRef = await Payment.countDocuments({ 
      $or: [
        { bookingReference: { $exists: false } },
        { bookingReference: null },
        { bookingReference: "" }
      ]
    });
    
    if (paymentsWithoutRef > 0) {
      console.log(`⚠️  WARNING: ${paymentsWithoutRef} payments without booking reference`);
      console.log('   Run: node migrate_bookings.js\n');
    }
    
    // Check users
    console.log('3️⃣ Checking Users collection...');
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   👑 Admins: ${adminUsers}`);
    console.log(`   👤 Regular Users: ${regularUsers}\n`);
    
    // Show recent payments
    console.log('4️⃣ Recent Payments (last 3):');
    const recentPayments = await Payment.find()
      .sort({ timestamp: -1 })
      .limit(3)
      .select('bookingReference username destination verificationStatus totalAmount timestamp');
    
    recentPayments.forEach((p, idx) => {
      console.log(`   ${idx + 1}. ${p.bookingReference || 'NO-REF'} - ${p.username} - ${p.destination}`);
      console.log(`      Status: ${p.verificationStatus} | Amount: Rs.${p.totalAmount} | Date: ${p.timestamp?.toLocaleDateString()}`);
    });
    
    console.log('\n✅ Diagnostics complete!\n');
    
    // Check for potential issues
    console.log('5️⃣ Potential Issues:');
    let issuesFound = false;
    
    if (totalPayments === 0) {
      console.log('   ⚠️  No payments in database');
      issuesFound = true;
    }
    
    if (adminUsers === 0) {
      console.log('   ⚠️  No admin users found. Run: node create_admin.js');
      issuesFound = true;
    }
    
    if (paymentsWithoutRef > 0) {
      console.log(`   ⚠️  ${paymentsWithoutRef} payments need booking references`);
      issuesFound = true;
    }
    
    if (!issuesFound) {
      console.log('   ✅ No issues detected!');
    }
    
    console.log('\n');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Make sure MongoDB is running');
    console.error('  2. Check MONGO_URI in .env file');
    console.error('  3. Try: mongod --dbpath <your-db-path>');
    process.exit(1);
  }
};

runDiagnostics();
