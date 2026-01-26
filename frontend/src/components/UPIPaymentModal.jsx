import React, { useState } from "react";
import {
  FaTimes,
  FaLock,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";
import useRazorpay from "../hooks/useRazorpay";

const RazorpayPaymentModal = ({
  isOpen,
  onClose,
  amount,
  onRazorpaySuccess,
  customerInfo,
  items,
  orderType,
  deliveryAddress,
  customerNote,
}) => {
  // Razorpay hook
  const {
    initiatePayment,
    loading: razorpayLoading,
    error: razorpayError,
    setError: setRazorpayError,
  } = useRazorpay();

  // Handle Razorpay payment
  const handleRazorpayPayment = () => {
    setRazorpayError(null);

    initiatePayment({
      amount,
      customerInfo,
      items,
      orderType,
      deliveryAddress,
      customerNote,
      onSuccess: (result) => {
        console.log("Payment successful:", result);
        if (onRazorpaySuccess) {
          onRazorpaySuccess(result);
        }
        // Don't call onClose() here - navigation will unmount the component
        // Calling onClose could trigger state changes that cause race conditions
      },
      onFailure: (error) => {
        console.error("Payment failed:", error);
      },
      onDismiss: () => {
        console.log("Payment dismissed");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-5 border-b border-gray-100 rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-800">
                Secure Payment
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Pay securely with Razorpay
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Amount Display */}
        <div className="px-6 py-5">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border-2 border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium mb-1">
                  Amount to Pay
                </p>
                <p className="text-4xl font-black text-gray-900">
                  ₹{amount.toFixed(0)}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-orange-500/10 text-orange-600 px-3 py-1.5 rounded-full">
                <FaLock size={12} />
                <span className="text-xs font-bold">SECURE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Razorpay Error Display */}
        {razorpayError && (
          <div className="px-6 pb-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {razorpayError}
            </div>
          </div>
        )}

        {/* Razorpay Payment */}
        <div className="px-6 pb-6">
          {/* Benefits */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 mb-4 border border-green-100">
            <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              Secure Payment with Razorpay
            </h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Instant payment confirmation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                UPI, Cards, Netbanking supported
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                100% secure & verified
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Faster order processing
              </li>
            </ul>
          </div>

          {/* Pay Now Button */}
          <button
            onClick={handleRazorpayPayment}
            disabled={razorpayLoading}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-transform shadow-lg shadow-orange-200/50 disabled:opacity-70"
          >
            {razorpayLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <FaCreditCard size={18} />
                Pay ₹{amount.toFixed(0)} Securely
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
            <FaLock size={10} />
            Secured by Razorpay
          </p>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RazorpayPaymentModal;
