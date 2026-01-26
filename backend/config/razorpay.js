const Razorpay = require("razorpay");

// Lazy initialization of Razorpay instance to ensure env variables are loaded
let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error(
        "Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.",
      );
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

// Export a proxy object that lazily initializes the Razorpay instance
module.exports = {
  get orders() {
    return getRazorpayInstance().orders;
  },
  get payments() {
    return getRazorpayInstance().payments;
  },
  get refunds() {
    return getRazorpayInstance().refunds;
  },
};
