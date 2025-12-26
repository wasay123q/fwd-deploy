const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    unique: true,
    sparse: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  duration: Number,
  people: {
    type: Number,
    required: true,
  },
  pricePerPerson: Number,
  totalAmount: Number,
  timestamp: { type: Date, default: Date.now },
  paymentScreenshot: {
    type: String,
    default: null,
  },
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected", "suspended", "refunded"],
    default: "pending",
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
  rejectionReason: {
    type: String,
    default: null,
  },
  suspensionReason: {
    type: String,
    default: null,
  },
  refundedAt: {
    type: Date,
    default: null,
  },
  refundedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  refundReason: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
