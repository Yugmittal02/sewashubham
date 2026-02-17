import React from 'react';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/cupcake_logo.svg';

const Header = () => {
    const { getItemCount } = useCart();
    const { customer } = useAuth();
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
                            onClick={() => navigate(customer ? '/dashboard' : '/login')}
                            className="header-icon-btn w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                            style={{ background: 'rgba(252, 128, 25, 0.1)', border: '2px solid #FC8019' }}
                            aria-label="Account"
                        >
                            <FaUser size={16} color="#FC8019" />
                        </button>

                        <div
                            className="header-logo flex flex-col cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            <div className="flex items-center gap-2">
                                <img
                                    src={logo}
                                    alt="Sewa Shubham Bakery"
                                    className="h-10 md:h-14 object-contain"
                                />
                                <div className="hidden sm:block">
                                    <h1 className="text-sm font-bold text-gray-800 leading-none">Sewa Shubham</h1>
                                    <p className="text-[10px] text-gray-400">Bakery & Cafe</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-[9px] text-gray-400">📍 Delivering to Bharatpur</span>
                                <span className="text-[8px] text-[#FC8019] font-bold">▼</span>
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
