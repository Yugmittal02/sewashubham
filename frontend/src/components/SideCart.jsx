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
  FaGift,
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

  const freeDeliveryThreshold = 299;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - total);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-300 ${isAnimating && isOpen ? "opacity-100" : "opacity-0"
          }`}
        style={{ background: 'rgba(61, 43, 31, 0.7)', backdropFilter: 'blur(4px)' }}
        onClick={handleClose}
      />

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 md:w-[420px] z-[101] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isAnimating && isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ background: '#FAF7F2', willChange: 'transform' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 safe-area-top"
          style={{ background: 'linear-gradient(180deg, #2D1F16 0%, #3D2B1F 100%)', borderBottom: '3px solid #C9A962' }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(201, 169, 98, 0.2)' }}>
              <FaShoppingBag size={18} color="#C9A962" />
            </div>
            <div>
              <h2 className="font-bold text-lg" style={{ color: '#D4B896' }}>Your Cart</h2>
              <p className="text-xs" style={{ color: 'rgba(212, 184, 150, 0.7)' }}>
                {getItemCount()} item{getItemCount() !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <FaTimes size={18} color="#D4B896" />
          </button>
        </div>

        {/* Free Delivery Progress */}
        {cart.length > 0 && remainingForFreeDelivery > 0 && (
          <div className="mx-4 mt-4 p-3 rounded-xl animate-fade-in"
            style={{ background: 'linear-gradient(135deg, #FEF3E2 0%, #FDE8CC 100%)', border: '2px solid #C9A962' }}>
            <div className="flex items-center gap-2 mb-2">
              <FaGift size={14} color="#C9A962" />
              <span className="text-xs font-semibold" style={{ color: '#6B4423' }}>
                Add ₹{remainingForFreeDelivery.toFixed(0)} more for FREE Delivery!
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E8E3DB' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (total / freeDeliveryThreshold) * 100)}%`,
                  background: 'linear-gradient(90deg, #C9A962 0%, #D4B87A 100%)'
                }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 scroll-container hide-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-28 h-28 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #FEF3E2 0%, #FDE8CC 100%)', border: '3px solid #E8E3DB' }}>
                <span className="text-5xl">🛒</span>
              </div>
              <p className="font-semibold text-lg" style={{ color: '#4A3728' }}>
                Your cart is empty
              </p>
              <p className="text-sm mt-1" style={{ color: '#8B7355' }}>
                Add delicious items to get started!
              </p>
              <button
                onClick={handleClose}
                className="mt-6 px-8 py-3 text-white font-bold rounded-xl active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg, #6B4423 0%, #5C4033 100%)', boxShadow: '0 4px 16px rgba(107, 68, 35, 0.3)' }}
              >
                🍰 Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div
                  key={item.cartId}
                  className="p-4 rounded-2xl animate-fade-in"
                  style={{
                    background: 'white',
                    border: '2px solid #E8E3DB',
                    boxShadow: '0 2px 8px rgba(74, 55, 40, 0.06)',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="flex gap-3">
                    {/* Item Image */}
                    {item.image && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ border: '2px solid #E8E3DB' }}>
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate" style={{ color: '#4A3728' }}>
                        {item.name}
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.size && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                            style={{ background: '#FEF3E2', color: '#6B4423' }}>
                            {item.size}
                          </span>
                        )}
                        {item.selectedAddons?.map((addon, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md"
                            style={{ background: '#F5F0E8', color: '#8B7355' }}
                          >
                            +{addon}
                          </span>
                        ))}
                      </div>
                      <p className="font-bold text-base mt-2" style={{ color: '#6B4423' }}>
                        ₹{(Number(item.price) || 0) * (Number(item.quantity) || 1)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => handleRemoveItem(item.cartId)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{ color: '#E57373' }}
                      >
                        <FaTrash size={11} />
                      </button>
                      <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: '#F5F0E8', border: '2px solid #E8E3DB' }}>
                        <button
                          onClick={() => handleUpdateQty(item.cartId, -1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-90 transition-transform"
                          style={{ background: 'white' }}
                        >
                          <FaMinus size={9} color="#6B4423" />
                        </button>
                        <span className="font-bold w-5 text-center text-sm" style={{ color: '#4A3728' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.cartId, 1)}
                          className="w-7 h-7 rounded-lg text-white flex items-center justify-center active:scale-90 transition-transform"
                          style={{ background: 'linear-gradient(135deg, #6B4423 0%, #5C4033 100%)' }}
                        >
                          <FaPlus size={9} />
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
          <div className="p-4 border-t-2" style={{ borderColor: '#E8E3DB', background: 'white' }}>
            {/* Total */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs uppercase font-medium" style={{ color: '#8B7355' }}>
                  Subtotal
                </p>
                <p className="text-2xl font-bold" style={{ color: '#4A3728' }}>
                  ₹{total.toFixed(0)}
                </p>
              </div>
              {remainingForFreeDelivery <= 0 && (
                <div className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: '#DCFCE7', color: '#166534' }}>
                  🎉 FREE Delivery
                </div>
              )}
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full h-14 text-white font-bold text-base rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #6B4423 0%, #5C4033 100%)',
                boxShadow: '0 8px 24px rgba(107, 68, 35, 0.35)'
              }}
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
