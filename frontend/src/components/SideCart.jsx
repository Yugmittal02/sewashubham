import React, { useState, useEffect, memo, useCallback } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaTrash,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaArrowRight,
} from "react-icons/fa";

const SideCart = memo(({ isOpen, onClose }) => {
  const { cart, total, updateQuantity, removeFromCart, getItemCount } = useCart();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  const handleCheckout = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      navigate("/cart");
    }, 300);
  }, [onClose, navigate]);

  const handleRemoveItem = useCallback((cartId) => {
    removeFromCart(cartId);
  }, [removeFromCart]);

  const handleUpdateQty = useCallback((cartId, delta) => {
    updateQuantity(cartId, delta);
  }, [updateQuantity]);

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isAnimating && isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 md:w-[420px] bg-white z-[101] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isAnimating && isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ willChange: 'transform' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-orange-500 to-amber-500 text-white safe-area-top">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaShoppingBag size={18} />
            </div>
            <div>
              <h2 className="font-bold text-lg">Your Cart</h2>
              <p className="text-xs opacity-90">
                {getItemCount()} item{getItemCount() !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center active:scale-95 transition-transform"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 scroll-container">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaShoppingBag className="text-gray-300" size={40} />
              </div>
              <p className="text-gray-500 font-medium text-lg">
                Your cart is empty
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Add items to get started
              </p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl active:scale-95 transition-transform"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.cartId}
                  className="bg-gray-50 p-4 rounded-2xl border border-gray-100"
                >
                  <div className="flex gap-3">
                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-base truncate">
                        {item.name}
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.size && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md font-medium">
                            {item.size}
                          </span>
                        )}
                        {item.selectedAddons?.map((addon, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-md"
                          >
                            +{addon}
                          </span>
                        ))}
                      </div>
                      <p className="text-orange-600 font-bold text-lg mt-2">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => handleRemoveItem(item.cartId)}
                        className="w-8 h-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <FaTrash size={12} />
                      </button>
                      <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1">
                        <button
                          onClick={() => handleUpdateQty(item.cartId, -1)}
                          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center active:scale-90 transition-transform"
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="font-bold text-gray-800 w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.cartId, 1)}
                          className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center active:scale-90 transition-transform"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Checkout Section */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            {/* Total */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">
                  Subtotal
                </p>
                <p className="text-2xl font-black text-gray-900">
                  ₹{total.toFixed(0)}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                + taxes calculated at checkout
              </p>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full h-14 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-orange-300/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <FaArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </>
  );
});

SideCart.displayName = 'SideCart';

export default SideCart;

