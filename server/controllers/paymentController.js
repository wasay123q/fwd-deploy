const Payment = require("../models/Payment");

// @desc    Create a new booking/payment
// @route   POST /api/payments
// @access  Public
exports.createPayment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    // ✅ PERMANENT FIX: Robust ID Generation
    const year = new Date().getFullYear();
    
    // 1. Find the very last booking reference created this year
    const lastPayment = await Payment.findOne({ 
      bookingReference: { $regex: `^BOOK-${year}` } 
    }).sort({ bookingReference: -1 }); // Sort descending to get the highest number

    // 2. Determine the next sequence number
    let nextSequence = 1;
    if (lastPayment && lastPayment.bookingReference) {
      const parts = lastPayment.bookingReference.split('-');
      const lastNumber = parseInt(parts[2], 10);
      if (!isNaN(lastNumber)) {
        nextSequence = lastNumber + 1;
      }
    }

    // 3. Generate the new ID (e.g., BOOK-2025-00006)
    const bookingReference = `BOOK-${year}-${String(nextSequence).padStart(5, '0')}`;
    console.log('📝 Generated robust booking reference:', bookingReference);
    
    const payment = new Payment({ 
      ...req.body, 
      user: req.user._id,
      bookingReference 
    });
    
    const savedPayment = await payment.save();
    console.log('💾 Payment saved successfully!');
    console.log('   User ID:', req.user._id);
    console.log('   Payment ID:', savedPayment._id);
    console.log('   Booking Ref:', bookingReference);
    
    res.status(201).json({ 
      message: "Payment stored successfully", 
      _id: savedPayment._id,
      bookingReference: savedPayment.bookingReference 
    });
  } catch (error) {
    console.error("❌ Error saving payment:", error);
    // Handle duplicates gracefully just in case of race conditions
    if (error.code === 11000) {
      return res.status(500).json({ message: "Booking ID conflict. Please try again." });
    }
    res.status(500).json({ message: "Failed to store payment" });
  }
};

// @desc    Get all payments for the logged-in user
// @route   GET /api/payments
// @access  Private
exports.getPayments = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    let query = {};

    // If not admin, only show own payments
    if (req.user.role !== "admin") {
      query.user = req.user._id;
    }

    console.log(
      `🔍 Fetching payments for ${req.user.role} user:`,
      req.user.email
    );
    const payments = await Payment.find(query).sort({ timestamp: -1 });
    console.log(
      `✅ Found ${payments.length} payments for ${req.user.role}`
    );
    if (payments.length > 0 && req.user.role !== 'admin') {
      console.log('User payments:', payments.map(p => `${p.bookingReference} - ${p.verificationStatus}`).join(', '));
    }
    res.json(payments);
  } catch (error) {
    console.error("❌ Error fetching payments:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Error retrieving payments", error: error.message });
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Public
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    console.error("❌ Error fetching payment:", error);
    res.status(500).json({ message: "Error retrieving payment data" });
  }
};

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Public
exports.updatePayment = async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updated) {
      res.json({ message: "Payment updated successfully", updated });
    } else {
      res.status(404).json({ message: "Payment not found for update" });
    }
  } catch (error) {
    console.error("❌ Error updating payment:", error);
    res.status(500).json({ message: "Failed to update payment" });
  }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Public
exports.deletePayment = async (req, res) => {
  try {
    const result = await Payment.findByIdAndDelete(req.params.id);
    if (result) {
      console.log("🗑️ Booking cancelled:", result);
      res.json({ message: "Booking cancelled successfully." });
    } else {
      res.status(404).json({ message: "Booking ID not found." });
    }
  } catch (error) {
    console.error("❌ Error cancelling booking:", error);
    res.status(500).json({ message: "Error cancelling booking." });
  }
};

// @desc    Log booking request (Legacy endpoint)
// @route   POST /api/book
// @access  Public
exports.logBooking = (req, res) => {
  const booking = req.body;
  console.log("📥 Booking received:", booking);
  res.status(201).json({ message: "Booking successful!" });
};

// @desc    Verify payment (Admin only)
// @route   PUT /api/payments/:id/verify
// @access  Admin
exports.verifyPayment = async (req, res) => {
  try {
    const { status, rejectionReason, suspensionReason } = req.body;
    
    if (!['verified', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({ message: "Invalid verification status" });
    }

    const updateData = {
      verificationStatus: status,
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
    };

    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    
    if (status === 'suspended' && suspensionReason) {
      updateData.suspensionReason = suspensionReason;
    }

    console.log(`🔄 Attempting to ${status} payment:`, req.params.id);
    console.log('Update data:', updateData);
    
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: false }
    );

    if (!payment) {
      console.log('❌ Payment not found:', req.params.id);
      return res.status(404).json({ message: "Payment not found" });
    }

    console.log(`✅ Payment ${status} successfully!`);
    console.log(`   Payment ID: ${payment._id}`);
    console.log(`   User: ${payment.username}`);
    console.log(`   Destination: ${payment.destination}`);
    console.log(`   Booking Ref: ${payment.bookingReference}`);
    console.log(`   Status: ${payment.verificationStatus}`);
    
    res.json({ 
      success: true,
      message: `Payment ${status} successfully`, 
      payment 
    });
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    res.status(500).json({ message: "Failed to verify payment" });
  }
};

// @desc    Get user's payment status
// @route   GET /api/payments/user/status
// @access  Private
exports.getUserPaymentStatus = async (req, res) => {
  try {
    console.log('🔍 User requesting payment status:', req.user.email, 'ID:', req.user._id);
    
    const payments = await Payment.find({ user: req.user._id })
      .sort({ timestamp: -1 });
    
    console.log(`✅ Found ${payments.length} payments for user ${req.user.email}`);
    if (payments.length > 0) {
      console.log('Payment IDs:', payments.map(p => p._id.toString()).join(', '));
      console.log('Payment statuses:', payments.map(p => p.verificationStatus).join(', '));
    }
    
    res.json(payments);
  } catch (error) {
    console.error("❌ Error fetching payment status:", error);
    res.status(500).json({ message: "Error retrieving payment status" });
  }
};

// @desc    Request refund for a booking
// @route   PUT /api/payments/:id/refund
// @access  Private
exports.requestRefund = async (req, res) => {
  try {
    const { reason } = req.body;
    
    console.log('🔄 Refund requested for payment:', req.params.id);
    console.log('   User:', req.user.email);
    console.log('   Reason:', reason);
    
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    // Verify the user owns this payment
    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only refund your own bookings" });
    }
    
    // Only allow refund for pending bookings
    if (payment.verificationStatus !== 'pending') {
      return res.status(400).json({ 
        message: `Cannot refund a ${payment.verificationStatus} booking. Only pending bookings can be refunded.` 
      });
    }
    
    // Update to refunded status
    payment.verificationStatus = 'refunded';
    payment.refundedAt = new Date();
    payment.refundedBy = req.user._id;
    payment.refundReason = reason || 'User requested refund';
    
    await payment.save();
    
    console.log('✅ Booking refunded successfully!');
    console.log(`   Payment ID: ${payment._id}`);
    console.log(`   Booking Ref: ${payment.bookingReference}`);
    console.log(`   Status: ${payment.verificationStatus}`);
    
    res.json({ 
      success: true,
      message: 'Refund request processed successfully. Admin will process the refund.', 
      payment 
    });
  } catch (error) {
    console.error("❌ Error processing refund:", error);
    res.status(500).json({ message: "Failed to process refund request" });
  }
};