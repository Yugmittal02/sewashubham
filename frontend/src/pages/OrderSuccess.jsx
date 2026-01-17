import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaCheckCircle,
  FaReceipt,
  FaPhoneAlt,
  FaSpinner,
  FaUtensils,
  FaBoxOpen,
  FaClock,
  FaGift,
  FaHeart,
  FaTruck,
} from "react-icons/fa";
import { fetchOrderStatus, getStoreSettings } from "../services/api";
import Footer from "../components/Footer";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  // Redirect if direct access without state
  useEffect(() => {
    if (!state?.orderId) {
      navigate("/");
    }
  }, [state, navigate]);

  const [showContent, setShowContent] = useState(false);
  const [adminPhone, setAdminPhone] = useState("9876543210");
  const [orderData, setOrderData] = useState(null);
  const [orderStatus, setOrderStatus] = useState("Pending");
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 100);

    // Fetch store settings
    const loadSettings = async () => {
      try {
        const { data } = await getStoreSettings();
        if (data.adminPhone) {
          setAdminPhone(data.adminPhone);
        }
      } catch (error) {
        console.error("Failed to load store settings:", error);
      }
    };
    loadSettings();

    // Poll for order status
    if (state?.orderId) {
      const pollStatus = async () => {
        try {
          const { data } = await fetchOrderStatus(state.orderId);
          setOrderData(data);
          setOrderStatus(data.status);
          setIsAccepted(data.isAccepted || false);
        } catch (error) {
          console.error("Failed to track order:", error);
        }
      };

      pollStatus();
      const interval = setInterval(pollStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [state?.orderId]);

  const steps = [
    { status: "Pending", label: "Order Received", icon: FaReceipt },
    { status: "Preparing", label: "Preparing", icon: FaUtensils },
    { status: "Ready", label: "Ready", icon: FaBoxOpen },
    { status: "Delivered", label: "Completed", icon: FaCheckCircle },
  ];

  const getCurrentStepIndex = () => {
    if (orderStatus === "Cancelled") return -1;
    const idx = steps.findIndex((s) => s.status === orderStatus);
    return idx === -1 ? 0 : idx;
  };

  const currentStepIndex = getCurrentStepIndex();

  // Calculate subtotal from items
  const subtotal = orderData?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float-1">🎉</div>
        <div className="absolute top-20 right-10 text-4xl opacity-10 animate-float-2">✨</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-10 animate-float-3">🎊</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8 px-4">
        <div
          className={`relative z-10 max-w-md mx-auto transition-all duration-700 ${
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {/* Status Header */}
          <div className="text-center mb-6">
            {!isAccepted && orderStatus === "Pending" ? (
              <>
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
                  <FaClock className="text-yellow-600 text-3xl animate-pulse" />
                </div>
                <h1 className="text-2xl font-black text-gray-800 mb-1">
                  Waiting for Confirmation
                </h1>
                <p className="text-gray-500 font-medium">
                  The store will confirm your order shortly!
                </p>
              </>
            ) : orderStatus === "Cancelled" ? (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
                  <span className="text-3xl">❌</span>
                </div>
                <h1 className="text-2xl font-black text-gray-800 mb-1">
                  Order Cancelled
                </h1>
                <p className="text-gray-500 font-medium">
                  This order was cancelled.
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl animate-pulse-slow">
                  <FaCheckCircle className="text-green-600 text-3xl" />
                </div>
                <h1 className="text-2xl font-black text-gray-800 mb-1">
                  Order Confirmed! 🎉
                </h1>
                <p className="text-gray-500 font-medium">
                  Thank You, {state?.customerName || "Friend"}!
                </p>
              </>
            )}

            {/* Payment Verified Badge */}
            {state?.paymentVerified && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                <FaCheckCircle />
                Payment Verified
              </div>
            )}

            {/* Savings Badge */}
            {state?.savedAmount > 0 && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold ml-2">
                <FaGift />
                You saved ₹{state.savedAmount}!
              </div>
            )}

            {/* Donation Badge */}
            {state?.donationAmount > 0 && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-bold ml-2">
                <FaHeart />
                Donated ₹{state.donationAmount}
              </div>
            )}
          </div>

          {/* Status Tracker */}
          {orderStatus !== "Cancelled" && (
            <div className="bg-white rounded-3xl p-5 shadow-xl shadow-green-100/50 border border-white mb-4">
              <div className="flex justify-between relative">
                {/* Connector Line */}
                <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-100 -z-0 rounded-full mx-4">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-1000"
                    style={{
                      width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                    }}
                  ></div>
                </div>

                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const Icon = step.icon;

                  return (
                    <div
                      key={idx}
                      className="relative z-10 flex flex-col items-center gap-2"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200"
                            : "bg-white border-gray-200 text-gray-300"
                        }`}
                      >
                        <Icon size={14} />
                      </div>
                      <span
                        className={`text-[10px] font-bold transition-all duration-300 ${
                          isCurrent ? "text-green-600 scale-110" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Status Message */}
              <div className="mt-5 bg-green-50 rounded-xl p-3 text-green-800 text-sm font-bold flex items-center justify-center gap-2">
                {orderStatus === "Pending" && !isAccepted && (
                  <FaSpinner className="animate-spin" />
                )}
                {orderStatus === "Preparing" && (
                  <FaUtensils className="animate-bounce" />
                )}
                <span>
                  {orderStatus === "Pending" && !isAccepted && "Waiting for store to accept..."}
                  {orderStatus === "Pending" && isAccepted && "Order accepted! Processing..."}
                  {orderStatus === "Preparing" && "Chef is preparing your food!"}
                  {orderStatus === "Ready" && "Your order is ready!"}
                  {orderStatus === "Delivered" && "Order Completed! Enjoy!"}
                </span>
              </div>
            </div>
          )}

          {/* Receipt / Order Details */}
          <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 mb-4">
            <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
              <FaReceipt className="text-orange-500" />
              Order Receipt
            </h3>

            {/* Order Info */}
            <div className="flex justify-between text-sm mb-3 pb-3 border-b border-gray-100">
              <span className="text-gray-500">Order ID</span>
              <span className="font-bold text-gray-700 font-mono">
                #{state?.orderId?.slice(-6).toUpperCase() || "---"}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-3 pb-3 border-b border-gray-100">
              <span className="text-gray-500">Date & Time</span>
              <span className="font-medium text-gray-700">
                {state?.orderDate
                  ? new Date(state.orderDate).toLocaleString("en-IN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "---"}
              </span>
            </div>
            {orderData?.orderType && (
              <div className="flex justify-between text-sm mb-3 pb-3 border-b border-gray-100">
                <span className="text-gray-500">Order Type</span>
                <span className="font-medium text-gray-700 flex items-center gap-1">
                  {orderData.orderType === "Delivery" && <FaTruck size={12} />}
                  {orderData.orderType}
                </span>
              </div>
            )}

            {/* Items */}
            {orderData?.items && orderData.items.length > 0 && (
              <div className="mb-3 pb-3 border-b border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold mb-2">Items</p>
                <div className="space-y-2">
                  {orderData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.quantity}× {item.name}
                        {item.size && <span className="text-gray-400 ml-1">({item.size})</span>}
                      </span>
                      <span className="font-semibold text-gray-700">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bill Breakdown */}
            <div className="space-y-2 text-sm">
              {orderData && (
                <>
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  {orderData.taxAmount > 0 && (
                    <div className="flex justify-between text-gray-500">
                      <span>Tax (GST)</span>
                      <span>₹{orderData.taxAmount.toFixed(0)}</span>
                    </div>
                  )}
                  {orderData.platformFee > 0 && (
                    <div className="flex justify-between text-gray-500">
                      <span>Platform Fee</span>
                      <span>₹{orderData.platformFee.toFixed(2)}</span>
                    </div>
                  )}
                  {orderData.deliveryFee > 0 && (
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery Fee</span>
                      <span>₹{orderData.deliveryFee.toFixed(0)}</span>
                    </div>
                  )}
                  {orderData.appliedOffer?.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount</span>
                      <span>- ₹{orderData.appliedOffer.discountAmount.toFixed(0)}</span>
                    </div>
                  )}
                  {orderData.donationAmount > 0 && (
                    <div className="flex justify-between text-pink-600 font-medium">
                      <span>Donation 💕</span>
                      <span>+ ₹{orderData.donationAmount.toFixed(0)}</span>
                    </div>
                  )}
                </>
              )}

              <div className="border-t border-dashed border-gray-200 pt-3 mt-3">
                <div className="flex justify-between text-lg font-black text-gray-900">
                  <span>Total</span>
                  <span className="text-orange-600">
                    ₹{orderData?.totalAmount?.toFixed(0) || state?.totalAmount || "---"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Contact Button */}
          <a
            href={`tel:${adminPhone}`}
            className="block w-full bg-white border-2 border-orange-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-orange-50 hover:border-orange-200 transition-colors flex items-center justify-center gap-2 mb-4"
          >
            <FaPhoneAlt className="text-orange-500" />
            <span>Call Store: {adminPhone}</span>
          </a>

          {/* Home Button */}
          <button
            onClick={() => navigate("/menu")}
            className="w-full text-gray-400 font-semibold text-sm hover:text-gray-600 transition-colors text-center"
          >
            Return to Menu
          </button>
        </div>
      </div>

      <Footer />

      {/* Custom CSS */}
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-180deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(90deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 5s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 3.5s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
