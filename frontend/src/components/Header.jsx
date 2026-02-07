import React from 'react';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { getItemCount } = useCart();
    const navigate = useNavigate();
    const itemCount = getItemCount();

    return (
        <header className="sticky top-0 z-50">
            {/* Top Header Bar */}
            <div className="bakery-header relative">
                <div className="header-container flex justify-between items-center px-4 py-2">
                    {/* Left Side - Account + Logo */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="header-icon-btn w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                            style={{ background: 'rgba(252, 128, 25, 0.1)', border: '2px solid #FC8019' }}
                            aria-label="Account"
                        >
                            <FaUser size={16} color="#FC8019" />
                        </button>

                        <div
                            className="header-logo flex items-center gap-2 cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            <span className="logo-emoji text-3xl filter drop-shadow-sm">🍰</span>
                            <div className="flex flex-col items-start leading-none ml-1">
                                <h1 className="bakery-logo text-xl md:text-2xl font-serif font-bold tracking-wide" style={{ color: '#FC8019' }}>Sewa Shubham</h1>
                                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold mt-0.5" style={{ color: '#E57312' }}>Bakery</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Cart Only */}
                    <button
                        onClick={() => navigate('/cart')}
                        className="cart-header-btn relative w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                        style={{ background: 'linear-gradient(135deg, #FC8019 0%, #FF9A3C 100%)' }}
                        aria-label="Cart"
                    >
                        <FaShoppingCart size={18} color="#FFFFFF" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm" style={{ background: '#E53935' }}>
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
