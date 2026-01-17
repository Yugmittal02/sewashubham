import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getFeeSettings } from "../services/api";
import {
  FaTrash,
  FaArrowLeft,
  FaMinus,
  FaPlus,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaTruck,
  FaEdit,
} from "react-icons/fa";
import CustomerEntry from "../components/CustomerEntry";
import LocationPicker from "../components/LocationPicker";
import CustomizeModal from "../components/CustomizeModal";
import Footer from "../components/Footer";

const Cart = () => {
  const { cart, total, updateQuantity, removeFromCart } = useCart();
  const { customer, logoutCustomer } = useAuth();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState("Dine-in");
  const [showCustomerEntry, setShowCustomerEntry] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [feeSettings, setFeeSettings] = useState({
    platformFee: 0.98,
    taxRate: 5,
  });
  const [editingItem, setEditingItem] = useState(null);

  // Load fee settings on mount
  useEffect(() => {
    loadFeeSettings();
  }, []);

  const loadFeeSettings = async () => {
    try {
      const { data } = await getFeeSettings();
      setFeeSettings(data);
    } catch (error) {
      console.error("Error loading fee settings:", error);
    }
  };

  const subtotal = total;
  const tax = subtotal * (feeSettings.taxRate / 100);
  const estimatedTotal = subtotal + tax + feeSettings.platformFee;

  // Navigate to payment page
  const proceedToPayment = () => {
    navigate("/payment", {
      state: {
        orderType,
        deliveryAddress,
      },
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (!customer || !customer.name || !customer.phone) {
      setShowCustomerEntry(true);
      return;
    }

    // Check for delivery address if order type is Delivery
    if (orderType === "Delivery" && !deliveryAddress) {
      setShowLocationPicker(true);
      return;
    }

    // Navigate to payment page
    proceedToPayment();
  };

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
            <h1 className="text-xl font-black text-gray-800">Your Cart</h1>
            <p className="text-sm text-gray-500">
              {cart.length} item{cart.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        {customer && (
          <div className="flex flex-col items-end">
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">
              Ordering as
            </div>
            <div className="flex items-center gap-2 bg-orange-50 pl-3 pr-1 py-1 rounded-lg border border-orange-100">
              <span className="text-xs font-bold text-orange-800 max-w-[80px] truncate">
                {customer.name}
              </span>
              <button
                onClick={logoutCustomer}
                className="w-5 h-5 flex items-center justify-center bg-white rounded-md text-orange-500 shadow-sm"
              >
                <span className="text-[10px] font-bold">✕</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Order Type Toggle - Large Touch */}
      <div className="mx-4 mt-4">
        <div className="bg-white p-1.5 rounded-2xl flex shadow-sm border border-gray-100">
          {["Dine-in", "Takeaway", "Delivery"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setOrderType(type);
                // Clear delivery address if switching away from Delivery
                if (type !== "Delivery") {
                  setDeliveryAddress(null);
                }
              }}
              className={`flex-1 h-12 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                orderType === type
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200/50"
                  : "text-gray-500 active:bg-gray-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Address Selection */}
      {orderType === "Delivery" && (
        <div className="mx-4 mt-4">
          <button
            onClick={() => setShowLocationPicker(true)}
            className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${
              deliveryAddress
                ? "border-green-400 bg-green-50"
                : "border-dashed border-gray-300 bg-white"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                deliveryAddress
                  ? "bg-green-100 text-green-600"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              <FaMapMarkerAlt size={20} />
            </div>
            <div className="flex-1 text-left">
              {deliveryAddress ? (
                <>
                  <p className="font-bold text-gray-800 text-sm">
                    {deliveryAddress.manualAddress}
                  </p>
                  {deliveryAddress.landmark && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {deliveryAddress.landmark}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="font-bold text-gray-800">Add Delivery Address</p>
                  <p className="text-xs text-gray-500">
                    Tap to select your location
                  </p>
                </>
              )}
            </div>
            <span className="text-orange-600 font-bold text-sm">
              {deliveryAddress ? "Change" : "Add"}
            </span>
          </button>
        </div>
      )}

      {/* Cart Items - Large Touch Targets */}
      <div className="p-4 space-y-4">
        {cart.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-7xl mb-4">🛒</p>
            <p className="text-gray-500 font-medium text-lg">
              Your cart is empty
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="mt-6 bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl active:scale-95 transition-transform"
            >
              Browse Menu →
            </button>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.cartId}
              className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="flex gap-4">
                {/* Item Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {item.size && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">
                        {item.size}
                      </span>
                    )}
                    {item.selectedAddons?.map((addon, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg font-medium"
                      >
                        +{addon}
                      </span>
                    ))}
                  </div>
                  <p className="text-orange-600 font-black text-xl mt-2">
                    ₹{item.price}
                  </p>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setEditingItem(item)}
                  className="w-12 h-12 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl flex items-center justify-center active:scale-90 transition-all"
                >
                  <FaEdit size={18} />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => removeFromCart(item.cartId)}
                  className="w-12 h-12 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl flex items-center justify-center active:scale-90 transition-all"
                >
                  <FaTrash size={18} />
                </button>
              </div>

              {/* Quantity Controls - Large */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => updateQuantity(item.cartId, -1)}
                  className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center active:scale-90 active:bg-gray-200 transition-all"
                >
                  <FaMinus size={14} />
                </button>
                <span className="font-black text-2xl w-10 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.cartId, 1)}
                  className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 rounded-2xl flex items-center justify-center active:scale-90 active:from-orange-500 active:to-orange-600 active:text-white transition-all"
                >
                  <FaPlus size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <>
          {/* Bill Summary - Simplified */}
          <div className="mx-4 bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-base mb-4">
              🧾 Bill Summary
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between text-gray-600">
                <span>Item Total</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>GST ({feeSettings.taxRate}%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Platform Fee</span>
                <span>₹{feeSettings.platformFee.toFixed(2)}</span>
              </div>
              {orderType === "Delivery" && (
                <div className="flex justify-between text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaTruck size={12} />
                    Delivery Fee
                  </span>
                  <span className="text-orange-600 font-medium">
                    Calculated at checkout
                  </span>
                </div>
              )}
              <div className="border-t-2 border-dashed border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-xl font-black text-gray-900">
                  <span>Estimated</span>
                  <span className="text-orange-600">
                    ₹{estimatedTotal.toFixed(0)}+
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Final amount includes delivery fee & offers
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Checkout Button - Fixed, Large & Prominent */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-gray-100 safe-area-bottom">
          <button
            onClick={handleCheckout}
            className="w-full h-16 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-orange-300/50 active:scale-[0.98] transition-all flex justify-between items-center px-6"
          >
            <div className="flex items-center gap-3">
              <FaShoppingBag size={22} />
              <span>Proceed to Payment</span>
            </div>
            <span className="bg-white/25 px-5 py-2 rounded-xl font-black text-xl">
              ₹{estimatedTotal.toFixed(0)}+
            </span>
          </button>
        </div>
      )}

      {/* Customer Entry Modal */}
      {showCustomerEntry && (
        <div className="relative z-[100]">
          <CustomerEntry onClose={() => setShowCustomerEntry(false)} />
        </div>
      )}

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end justify-center sm:items-center p-0 sm:p-4">
          <div className="bg-white w-full h-[90vh] sm:h-auto sm:max-w-md sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-500" />
                Delivery Location
              </h3>
              <button
                onClick={() => setShowLocationPicker(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 font-bold"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <LocationPicker
                onLocationSelect={(addressData) => {
                  setDeliveryAddress(addressData);
                  setShowLocationPicker(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Customize Modal for Editing */}
      {editingItem && (
        <CustomizeModal
          product={{
            _id: editingItem._id,
            name: editingItem.name,
            description: editingItem.description || "",
            basePrice: editingItem.basePrice || editingItem.price,
            image: editingItem.image,
            sizes: editingItem.sizes || [],
            addons: editingItem.addons || [],
          }}
          onClose={(didAdd) => {
            if (didAdd) {
              // Remove old item when new one is added
              removeFromCart(editingItem.cartId);
            }
            setEditingItem(null);
          }}
        />
      )}

      {/* Custom CSS */}
      <style>{`
        .safe-area-top { padding-top: env(safe-area-inset-top); }
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>

      <Footer />
    </div>
  );
};

export default Cart;
