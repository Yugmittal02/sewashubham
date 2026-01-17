const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Order = require("../models/Order");
const User = require("../models/User");

// Create Razorpay order for payment
exports.createPaymentOrder = async (req, res) => {
  try {
    const {
      amount,
      currency = "INR",
      orderId,
      customerInfo,
      items,
      orderType,
      deliveryAddress,
      customerNote,
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // First, create or get the user
    let userId;
    if (customerInfo && customerInfo.name && customerInfo.phone) {
      let user = await User.findOne({ phone: customerInfo.phone });
      if (!user) {
        user = new User({ name: customerInfo.name, phone: customerInfo.phone });
        await user.save();
      } else {
        // Update name if it's different
        if (user.name !== customerInfo.name) {
          user.name = customerInfo.name;
          await user.save();
        }
      }
      userId = user._id;
    } else if (req.user) {
      userId = req.user.userId;
    } else {
      return res.status(400).json({ message: "Customer information required" });
    }

    // Create order in our database first with pending payment status
    const orderData = {
      user: userId,
      items: items.map((item) => ({
        product: item._id || item.product,
        name: item.name,
        quantity: item.quantity,
        size: item.size,
        addons: item.selectedAddons || item.addons,
        price: item.price * item.quantity,
      })),
      totalAmount: amount,
      paymentMethod: "Razorpay",
      paymentStatus: "Initiated",
      customerNote: orderType
        ? `${orderType}. ${customerNote || ""}`
        : customerNote,
      deliveryAddress: orderType === "Delivery" ? deliveryAddress : undefined,
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    // Create Razorpay order
    const razorpayOptions = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: currency,
      receipt: newOrder._id.toString(),
      notes: {
        orderId: newOrder._id.toString(),
        customerName: customerInfo?.name || "Guest",
        customerPhone: customerInfo?.phone || "",
      },
    };

    const razorpayOrder = await razorpay.orders.create(razorpayOptions);

    // Update our order with Razorpay order ID
    newOrder.razorpayOrderId = razorpayOrder.id;
    await newOrder.save();

    res.status(201).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      orderId: newOrder._id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create payment order error:", error);
    res.status(500).json({
      message: "Error creating payment order",
      error: error.message,
    });
  }
};

// Verify Razorpay payment signature
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ message: "Missing payment verification parameters" });
    }

    // Generate signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      // Update order status to failed
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: "Failed",
          razorpayPaymentId: razorpay_payment_id,
        }
      );
      return res.status(400).json({
        success: false,
        message: "Payment verification failed - Invalid signature",
      });
    }

    // Fetch payment details from Razorpay to verify amount
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Update order with payment details
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: "Paid",
        paymentVerifiedAt: new Date(),
        status: "Pending", // Order is now confirmed, ready for processing
      },
      { new: true }
    ).populate("user", "name phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      order: {
        _id: order._id,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

// Handle Razorpay Webhooks
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature
    const signature = req.headers["x-razorpay-signature"];

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");

      if (signature !== expectedSignature) {
        console.error("Webhook signature verification failed");
        return res.status(400).json({ message: "Invalid webhook signature" });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log("Razorpay Webhook Event:", event);

    switch (event) {
      case "payment.captured":
        await handlePaymentCaptured(payload);
        break;
      case "payment.failed":
        await handlePaymentFailed(payload);
        break;
      case "order.paid":
        await handleOrderPaid(payload);
        break;
      default:
        console.log("Unhandled webhook event:", event);
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
};

// Helper: Handle payment captured webhook
async function handlePaymentCaptured(payload) {
  const payment = payload.payment.entity;
  const razorpayOrderId = payment.order_id;

  await Order.findOneAndUpdate(
    { razorpayOrderId: razorpayOrderId },
    {
      razorpayPaymentId: payment.id,
      paymentStatus: "Paid",
      paymentVerifiedAt: new Date(),
    }
  );

  console.log(`Payment captured for order: ${razorpayOrderId}`);
}

// Helper: Handle payment failed webhook
async function handlePaymentFailed(payload) {
  const payment = payload.payment.entity;
  const razorpayOrderId = payment.order_id;

  await Order.findOneAndUpdate(
    { razorpayOrderId: razorpayOrderId },
    {
      razorpayPaymentId: payment.id,
      paymentStatus: "Failed",
    }
  );

  console.log(`Payment failed for order: ${razorpayOrderId}`);
}

// Helper: Handle order paid webhook
async function handleOrderPaid(payload) {
  const order = payload.order.entity;

  await Order.findOneAndUpdate(
    { razorpayOrderId: order.id },
    {
      paymentStatus: "Paid",
      paymentVerifiedAt: new Date(),
    }
  );

  console.log(`Order paid: ${order.id}`);
}

// Get payment status for an order
exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).select(
      "paymentStatus paymentMethod razorpayPaymentId paymentVerifiedAt totalAmount status"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      razorpayPaymentId: order.razorpayPaymentId,
      paymentVerifiedAt: order.paymentVerifiedAt,
      totalAmount: order.totalAmount,
      orderStatus: order.status,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment status" });
  }
};

// Admin: Manual payment verification (for cash/offline verification)
exports.manualVerifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { verificationNote } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "Paid",
        paymentVerifiedAt: new Date(),
        customerNote: verificationNote
          ? `${
              req.body.existingNote || ""
            } | Admin verified: ${verificationNote}`.trim()
          : undefined,
      },
      { new: true }
    ).populate("user", "name phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Payment manually verified",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying payment manually" });
  }
};

// Get Razorpay key for frontend
exports.getRazorpayKey = async (req, res) => {
  try {
    res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      isConfigured: !!process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Razorpay configuration" });
  }
};
