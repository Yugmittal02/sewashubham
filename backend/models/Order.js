const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      quantity: { type: Number, required: true },
      size: String,
      addons: [String],
      price: Number, // Price tracking at time of order
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"],
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Online", "UPI", "Razorpay"],
    default: "Cash",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Initiated", "Paid", "Failed", "Refunded"],
    default: "Pending",
  },
  // Razorpay payment fields
  razorpayOrderId: {
    type: String,
    index: true,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  paymentVerifiedAt: {
    type: Date,
  },
  deliveryAddress: {
    address: String,
    manualAddress: String,
    landmark: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  customerNote: String,
  // Donation tracking
  donationAmount: {
    type: Number,
    default: 0
  },
  // Applied offer tracking
  appliedOffer: {
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
    code: String,
    discountAmount: Number
  },
  // Fee breakdown
  deliveryFee: {
    type: Number,
    default: 0
  },
  platformFee: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  // Order type
  orderType: {
    type: String,
    enum: ['Dine-in', 'Takeaway', 'Delivery'],
    default: 'Dine-in'
  },
  // Admin acceptance
  isAccepted: {
    type: Boolean,
    default: false
  },
  acceptedAt: {
    type: Date
  },
  // Payment screenshot for manual verification (temporary while Razorpay under review)
  paymentScreenshot: {
    url: String,
    uploadedAt: Date,
    verified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    verifiedBy: String
  },
  createdAt: { type: Date, default: Date.now },
});

// Index for faster queries on payment status
orderSchema.index({ paymentStatus: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
