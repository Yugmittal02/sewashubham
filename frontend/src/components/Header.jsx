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
            <div className="px-4 py-2.5" style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div className="flex justify-between items-center max-w-6xl mx-auto">
                    {/* Left - Logo + Brand Name */}
                    <div
                        className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"
                        onClick={() => navigate('/')}
                    >
                        <img
                            src={logo}
                            alt="Sewa Shubham Bakery"
                            className="h-[72px] w-[72px] object-contain"
                        />
                        <div>
                            <h1 className="text-2xl font-extrabold leading-tight" style={{ color: '#2D1810' }}>
                                Sewa Shubham
                            </h1>
                            <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: '#C97B4B' }}>
                                Bakery
                            </p>
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
