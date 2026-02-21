import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaArrowLeft } from 'react-icons/fa';

import logo from '../assets/brand_logo.png';

const Header = () => {
    const { getItemCount } = useCart();
    const { customer } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const itemCount = getItemCount();

    const showBackButton = location.pathname !== '/' && location.pathname !== '/menu';

    return (
        <header className="sticky top-0 z-50">
            <div className="px-4 py-2.5" style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div className="flex justify-between items-center max-w-6xl mx-auto">
                    {/* Left - Logo + Brand Name */}
                    <div className="flex items-center gap-3">
                        {showBackButton && (
                            <button
                                onClick={() => navigate(-1)}
                                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <FaArrowLeft size={18} color="#4A3728" />
                            </button>
                        )}
                        <div
                            className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
                            onClick={() => navigate('/')}
                        >
                            <img
                                src={logo}
                                alt="Sewa Shubham Bakery"
                                className="h-16 w-auto object-contain"
                            />
                            <div>
                                <h1 className="text-xl font-extrabold leading-tight" style={{ color: '#2D1810' }}>
                                    Sewa Shubham
                                </h1>
                                <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: '#C97B4B' }}>
                                    Bakery
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right - Account + Cart */}
                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={() => navigate(customer ? '/dashboard' : '/login')}
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
                            style={{ background: '#FFF5EE', border: '1.5px solid #F0D6C0' }}
                            aria-label="Account"
                        >
                            <FaUser size={14} color="#C97B4B" />
                        </button>
                        <button
                            onClick={() => navigate('/cart')}
                            className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
                            style={{ background: 'linear-gradient(135deg, #C97B4B 0%, #E8956A 100%)' }}
                            aria-label="Cart"
                        >
                            <FaShoppingCart size={14} color="#FFFFFF" />
                            {itemCount > 0 && (
                                <span
                                    className="absolute -top-1 -right-1 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center"
                                    style={{ background: '#E53935', minWidth: '18px', height: '18px', boxShadow: '0 2px 4px rgba(229,57,53,0.3)' }}
                                >
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
