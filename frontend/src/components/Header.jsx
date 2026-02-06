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
                    {/* Left Side - Logo */}
                    <div
                        className="header-logo flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <span className="logo-emoji text-3xl filter drop-shadow-sm">🍰</span>
                        <div className="flex flex-col items-start leading-none ml-1">
                            <h1 className="bakery-logo text-xl md:text-2xl font-serif font-bold text-amber-900 tracking-wide">Sewa Shubham</h1>
                            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-amber-700 font-semibold mt-0.5">Bakery</span>
                        </div>
                    </div>

                    {/* Right Side - Icons Group */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="header-icon-btn p-2 text-amber-800 hover:bg-amber-100 rounded-full transition-colors"
                            aria-label="Account"
                        >
                            <FaUser size={18} />
                        </button>

                        <button
                            onClick={() => navigate('/cart')}
                            className="cart-header-btn relative p-2 text-amber-800 hover:bg-amber-100 rounded-full transition-colors"
                            aria-label="Cart"
                        >
                            <FaShoppingCart size={20} />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
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
