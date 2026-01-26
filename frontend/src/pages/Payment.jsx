import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  createOrder,
  registerCustomer,
  getFeeSettings,
  calculateDeliveryFee,
  getPaymentStatus,
} from "../services/api";
import {
  FaArrowLeft,
  FaMoneyBillWave,
  FaCreditCard,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaTruck,
  FaGift,
} from "react-icons/fa";
import UPIPaymentModal from "../components/UPIPaymentModal";
import OffersDropdown from "../components/OffersDropdown";
import CelebrationMessage from "../components/CelebrationMessage";
import Footer from "../components/Footer";

const Payment = () => {
  const { cart, total, clearCart } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get data passed from Cart page
  const { orderType, deliveryAddress } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [checkingPendingPayment, setCheckingPendingPayment] = useState(false);
  const isProcessingRef = useRef(false); // Ref for immediate check

  // Fee states
  const [feeSettings, setFeeSettings] = useState({
    deliveryFeeBase: 30,
    deliveryFeePerKm: 5,
    freeDeliveryThreshold: 500,
  });
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [freeDelivery, setFreeDelivery] = useState(false);

  // Offer states
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [discount, setDiscount] = useState(0);

  // Celebration states
  const [showSavingsCelebration, setShowSavingsCelebration] = useState(false);
  const [celebrationAmount, setCelebrationAmount] = useState(0);

  // Calculations - No tax, no platform fee
  const subtotal = total;
  const grandTotal = subtotal + deliveryFee - discount;

  // Check for pending payment on page load (for UPI app return)
  useEffect(() => {
    const checkPendingPayment = async () => {
      const pendingOrderId = sessionStorage.getItem("pending_order_id");
      if (pendingOrderId) {
        // Close modal and show loading immediately
        setShowUPIModal(false);
        setCheckingPendingPayment(true);

        try {
          console.log("Checking pending payment for order:", pendingOrderId);

          // Poll a few times in case payment is processing
          let attempts = 0;
          const maxAttempts = 5;
          const pollInterval = 2000; // 2 seconds

          const pollPaymentStatus = async () => {
            attempts++;
            const { data } = await getPaymentStatus(pendingOrderId);

            if (data.paymentStatus === "Paid") {
              console.log("Payment confirmed! Redirecting to order success...");
              // Payment was successful
              sessionStorage.removeItem("pending_order_id");
              sessionStorage.setItem("payment_success", Date.now().toString());
              isProcessingRef.current = true;
              setIsProcessingOrder(true);
              setCheckingPendingPayment(false);

              // IMPORTANT: Navigate FIRST, then clear cart
              navigate("/order-success", {
                state: {
                  customerName: customer?.name,
                  orderDate: new Date().toISOString(),
                  orderId: pendingOrderId,
                  paymentVerified: true,
                  paymentMethod: "Razorpay",
                  totalAmount: data.totalAmount,
                },
                replace: true,
              });

              // Clear cart after navigation initiated
              setTimeout(() => {
                clearCart();
              }, 100);
              return true;
            } else if (data.paymentStatus === "Failed") {
              // Payment failed, clear pending order
              console.log("Payment failed");
              sessionStorage.removeItem("pending_order_id");
              setCheckingPendingPayment(false);
              return true;
            } else if (attempts < maxAttempts) {
              // Still initiated, poll again
              console.log(
                `Payment still processing, polling again (${attempts}/${maxAttempts})...`,
              );
              await new Promise((resolve) => setTimeout(resolve, pollInterval));
              return pollPaymentStatus();
            }

            // Max attempts reached, payment might not have been completed
            console.log("Max polling attempts reached, clearing pending order");
            sessionStorage.removeItem("pending_order_id");
            setCheckingPendingPayment(false);
            return false;
          };

          await pollPaymentStatus();
        } catch (error) {
          console.error("Error checking payment status:", error);
          sessionStorage.removeItem("pending_order_id");
          setCheckingPendingPayment(false);
        }
      }
    };

    checkPendingPayment();
  }, [navigate, customer, clearCart]);

  // Load fee settings on mount
  useEffect(() => {
    loadFeeSettings();
  }, []);

  // Dynamically load Razorpay script only on Payment page (performance optimization)
  useEffect(() => {
    if (
      !window.Razorpay &&
      !document.querySelector('script[src*="razorpay"]')
    ) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Calculate delivery fee when delivery address is set
  useEffect(() => {
    if (orderType === "Delivery" && deliveryAddress?.coordinates) {
      calculateDelivery();
    }
  }, [orderType, deliveryAddress, subtotal]);

  // Redirect if no cart or order type (but not during order processing)
  useEffect(() => {
    // Use ref for immediate check to prevent race condition
    if (isProcessingOrder || isProcessingRef.current) return; // Don't redirect during order processing

    // Don't redirect if we just completed a successful payment
    // Check sessionStorage for recent successful payment
    const recentPayment = sessionStorage.getItem("payment_success");
    if (recentPayment) {
      const paymentTime = parseInt(recentPayment, 10);
      // If payment was within last 10 seconds, don't redirect
      if (Date.now() - paymentTime < 10000) {
        return;
      }
      sessionStorage.removeItem("payment_success");
    }

    // Small delay to ensure state is settled after payment flow
    const timer = setTimeout(() => {
      // Double-check ref hasn't been set during timeout
      if (isProcessingRef.current) return;

      if (cart.length === 0 && !isProcessingOrder) {
        navigate("/cart");
      }
      if (!orderType && !isProcessingOrder) {
        navigate("/cart");
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [cart, orderType, navigate, isProcessingOrder]);

  const loadFeeSettings = async () => {
    try {
      const { data } = await getFeeSettings();
      setFeeSettings(data);
    } catch (error) {
      console.error("Error loading fee settings:", error);
    }
  };

  const calculateDelivery = async () => {
    try {
      const { data } = await calculateDeliveryFee(
        deliveryAddress.coordinates.lat,
        deliveryAddress.coordinates.lng,
        subtotal,
      );
      if (data.deliverable) {
        setDeliveryFee(data.deliveryFee);
        setFreeDelivery(data.freeDelivery);
      } else {
        alert(data.message);
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error calculating delivery:", error);
      // Use fallback flat fee
      if (subtotal >= feeSettings.freeDeliveryThreshold) {
        setDeliveryFee(0);
        setFreeDelivery(true);
      } else {
        setDeliveryFee(feeSettings.deliveryFeeBase);
        setFreeDelivery(false);
      }
    }
  };

  const handleOfferSelect = (offer) => {
    if (offer) {
      setSelectedOffer(offer);
      setDiscount(offer.calculatedDiscount);
      setCelebrationAmount(offer.calculatedDiscount);
      setShowSavingsCelebration(true);
    } else {
      setSelectedOffer(null);
      setDiscount(0);
    }
  };

  const handleCheckout = async () => {
    if (paymentMethod === "Razorpay") {
      setShowUPIModal(true);
      return;
    }
    await processOrder();
  };

  const processOrder = async () => {
    if (!customer || !customer.name || !customer.phone) {
      alert("Customer information is required. Please go back to cart.");
      navigate("/cart");
      return;
    }

    setLoading(true);

    try {
      const customerRes = await registerCustomer({
        name: customer.name,
        phone: customer.phone,
      });
      const userId = customerRes.data.user._id;

      const orderData = {
        user: userId,
        items: cart.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          size: item.size,
          addons: item.selectedAddons,
          price: item.price * item.quantity,
        })),
        totalAmount: grandTotal,
        paymentMethod,
        orderType,
        deliveryAddress: orderType === "Delivery" ? deliveryAddress : undefined,
        appliedOffer: selectedOffer
          ? {
              offerId: selectedOffer._id,
              code: selectedOffer.code,
              discountAmount: discount,
            }
          : undefined,
        deliveryFee,
      };

      const response = await createOrder(orderData);

      // Set both ref (immediate) and state to prevent redirect race condition
      isProcessingRef.current = true;
      setIsProcessingOrder(true);

      // Mark successful order in sessionStorage to prevent redirect on any re-renders
      sessionStorage.setItem("payment_success", Date.now().toString());

      // Clear cart first
      clearCart();

      // Navigate to order success with replace to prevent back navigation
      navigate("/order-success", {
        state: {
          customerName: customer.name,
          orderDate: new Date().toISOString(),
          orderId: response.data._id,
          savedAmount: discount,
          paymentMethod: paymentMethod,
          totalAmount: grandTotal,
        },
        replace: true,
      });
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message;
      alert(msg || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUPIPaymentInitiated = () => {
    processOrder();
  };

  const handleRazorpaySuccess = (result) => {
    // Set both ref (immediate) and state to prevent redirect race condition
    isProcessingRef.current = true;
    setIsProcessingOrder(true);

    // Mark successful payment in sessionStorage to prevent redirect on any re-renders
    sessionStorage.setItem("payment_success", Date.now().toString());

    // IMPORTANT: Navigate FIRST, then clear cart
    // This prevents race condition where cart clear triggers empty cart redirect
    navigate("/order-success", {
      state: {
        customerName: customer?.name,
        orderDate: new Date().toISOString(),
        orderId: result.orderId,
        paymentId: result.paymentId,
        paymentVerified: !result.paymentPending,
        paymentMethod: "Razorpay",
        savedAmount: discount,
        donationAmount,
      },
      replace: true,
    });

    // Clear cart AFTER navigation is initiated
    // Use setTimeout to ensure navigation is processed first
    setTimeout(() => {
      clearCart();
    }, 100);
  };

  const paymentMethods = [
    {
      id: "Razorpay",
      label: "Pay Online",
      icon: FaCreditCard,
      desc: "UPI • Cards • Netbanking",
    },
    {
      id: "Cash",
      label: "Cash on Delivery",
      icon: FaMoneyBillWave,
      desc: "Pay when order arrives",
    },
  ];

  // Show loading overlay when checking pending payment
  if (checkingPendingPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/30 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center max-w-sm mx-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Verifying Payment...
          </h2>
          <p className="text-gray-500 text-sm">
            Please wait while we confirm your payment status
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/30 pb-32">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl px-4 py-4 shadow-sm border-b border-gray-100 flex justify-between items-center sticky top-0 z-10 safe-area-top">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 active:scale-95 active:bg-gray-200 transition-all"
          >
            <FaArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-800">Payment</h1>
            <p className="text-sm text-gray-500">Complete your order</p>
          </div>
        </div>
        {customer && (
          <div className="flex flex-col items-end">
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">
              {orderType}
            </div>
            <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
              <span className="text-xs font-bold text-orange-800 max-w-[80px] truncate">
                {customer.name}
              </span>
            </div>
          </div>
        )}
      </header>

      <div className="p-4 space-y-4">
        {/* Order Summary Card */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              🛒 Order Summary
            </h3>
            <span className="text-sm text-gray-500">
              {cart.length} item{cart.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {cart.map((item) => (
              <div
                key={item.cartId}
                className="flex justify-between text-sm text-gray-600"
              >
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span className="font-semibold">
                  ₹{(item.price * item.quantity).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address Display */}
        {orderType === "Delivery" && deliveryAddress && (
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaMapMarkerAlt className="text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 mb-1">
                  Delivery Address
                </h4>
                <p className="text-sm text-gray-600">
                  {deliveryAddress.manualAddress}
                </p>
                {deliveryAddress.landmark && (
                  <p className="text-xs text-gray-400 mt-1">
                    Landmark: {deliveryAddress.landmark}
                  </p>
                )}
              </div>
              <button
                onClick={() => navigate("/cart")}
                className="text-xs text-orange-600 font-bold"
              >
                Change
              </button>
            </div>
            {freeDelivery && (
              <div className="mt-3 flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm font-semibold">
                <FaTruck />
                <span>🎉 Free Delivery Applied!</span>
              </div>
            )}
          </div>
        )}

        {/* Offers Dropdown */}
        <OffersDropdown
          orderTotal={subtotal}
          onOfferSelect={handleOfferSelect}
          selectedOffer={selectedOffer}
        />

        {/* Payment Methods */}
        <div>
          <h3 className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
            💳 Payment Method
          </h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`w-full p-5 rounded-3xl border-2 flex items-center gap-4 transition-all active:scale-[0.98] ${
                  paymentMethod === method.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    paymentMethod === method.id
                      ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <method.icon size={24} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-800 text-base">
                    {method.label}
                  </p>
                  <p className="text-sm text-gray-500">{method.desc}</p>
                </div>
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === method.id
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300"
                  }`}
                >
                  {paymentMethod === method.id && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bill Summary - Simplified (No Tax, No Platform Fee) */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-base mb-4">
            🧾 Bill Details
          </h3>
          <div className="space-y-3 text-base">
            <div className="flex justify-between text-gray-600">
              <span>Item Total</span>
              <span className="font-semibold">₹{subtotal.toFixed(0)}</span>
            </div>
            {orderType === "Delivery" && (
              <div className="flex justify-between text-gray-500">
                <span className="flex items-center gap-1">
                  <FaTruck size={12} />
                  Delivery Fee
                </span>
                {freeDelivery ? (
                  <span className="text-green-600 font-semibold">FREE</span>
                ) : (
                  <span>₹{deliveryFee.toFixed(0)}</span>
                )}
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span className="flex items-center gap-1">
                  <FaGift size={12} />
                  Discount
                </span>
                <span>- ₹{discount.toFixed(0)}</span>
              </div>
            )}
            <div className="border-t-2 border-dashed border-gray-200 pt-4 mt-4">
              <div className="flex justify-between text-xl font-black text-gray-900">
                <span>To Pay</span>
                <span className="text-orange-600">
                  ₹{grandTotal.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Button - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-gray-100 safe-area-bottom">
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full h-16 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-orange-300/50 active:scale-[0.98] transition-all flex justify-between items-center px-6 disabled:opacity-50"
        >
          <div className="flex items-center gap-3">
            {paymentMethod === "Razorpay" ? (
              <FaCreditCard size={22} />
            ) : (
              <FaMoneyBillWave size={22} />
            )}
            <span>
              {loading
                ? "Placing Order..."
                : paymentMethod === "Razorpay"
                  ? "Pay Securely"
                  : "Place Order (COD)"}
            </span>
          </div>
          <span className="bg-white/25 px-5 py-2 rounded-xl font-black text-xl">
            ₹{grandTotal.toFixed(0)}
          </span>
        </button>
      </div>

      {/* UPI Payment Modal */}
      <UPIPaymentModal
        isOpen={showUPIModal}
        onClose={() => setShowUPIModal(false)}
        amount={grandTotal}
        orderDetails={{ orderId: `ORD-${Date.now()}` }}
        onPaymentInitiated={handleUPIPaymentInitiated}
        onRazorpaySuccess={handleRazorpaySuccess}
        customerInfo={customer}
        items={cart}
        orderType={orderType}
        deliveryAddress={deliveryAddress}
        customerNote=""
      />

      {/* Celebration Messages */}
      {showSavingsCelebration && (
        <CelebrationMessage
          type="savings"
          amount={celebrationAmount}
          onClose={() => setShowSavingsCelebration(false)}
          autoCloseDelay={2500}
        />
      )}

      {/* Custom CSS */}
      <style>{`
        .safe-area-top { padding-top: env(safe-area-inset-top); }
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>

      <Footer />
    </div>
  );
};

export default Payment;
