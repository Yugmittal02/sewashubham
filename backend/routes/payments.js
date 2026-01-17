const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const {
  verifyToken,
  optionalVerifyToken,
  isAdmin,
} = require("../middleware/authMiddleware");
const { validateObjectId } = require("../middleware/validation");

// Get Razorpay key (public)
router.get("/key", paymentController.getRazorpayKey);

// Create payment order (optional auth - guest checkout supported)
router.post(
  "/create-order",
  optionalVerifyToken,
  paymentController.createPaymentOrder
);

// Verify payment after completion
router.post("/verify", optionalVerifyToken, paymentController.verifyPayment);

// Razorpay webhook (no auth - verified by signature)
router.post("/webhook", paymentController.handleWebhook);

// Get payment status for an order
router.get(
  "/status/:orderId",
  validateObjectId("orderId"),
  paymentController.getPaymentStatus
);

// Admin: Manual payment verification
router.put(
  "/manual-verify/:orderId",
  verifyToken,
  isAdmin,
  validateObjectId("orderId"),
  paymentController.manualVerifyPayment
);

module.exports = router;
