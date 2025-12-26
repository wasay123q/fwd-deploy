const express = require("express");
const router = express.Router();
const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  logBooking,
  verifyPayment,
  getUserPaymentStatus,
  requestRefund,
} = require("../controllers/paymentController");

const { protect, admin } = require("../middleware/authMiddleware");

router.post("/payments", protect, createPayment);
router.get("/payments", protect, getPayments);
router.get("/payments/user/status", protect, getUserPaymentStatus);
router.put("/payments/:id/verify", protect, admin, verifyPayment);
router.put("/payments/:id/refund", protect, requestRefund);
router.get("/payments/:id", protect, getPaymentById);
router.put("/payments/:id", protect, updatePayment);
router.delete("/payments/:id", protect, deletePayment);
router.post("/book", logBooking);

module.exports = router;
