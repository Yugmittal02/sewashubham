import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowRight, FaStar, FaClock, FaShieldAlt } from 'react-icons/fa';
import logo from '../assets/brand_logo.png';

const Welcome = () => {
    const navigate = useNavigate();
    const { customer } = useAuth();

    useEffect(() => {
        if (customer) {
            navigate('/menu');
        }
    }, [customer, navigate]);

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF0DC 50%, #FFECD6 100%)' }}>

            {/* Background Elements (Static & Professional) - Positioned in Corners */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Top Left */}
                <img src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=150&h=150&fit=crop&q=80"
                    alt="Cake"
                    className="absolute top-4 left-4 w-20 h-20 md:w-32 md:h-32 object-cover rounded-2xl shadow-xl drop-shadow-xl"
                    style={{ border: '3px solid #FF8E53', opacity: 0.9 }} />

                {/* Top Right */}
                <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&h=150&fit=crop&q=80"
                    alt="Coffee"
                    className="absolute top-4 right-4 w-20 h-20 md:w-32 md:h-32 object-cover rounded-2xl shadow-xl drop-shadow-xl"
                    style={{ border: '3px solid #FF6B6B', opacity: 0.9 }} />

                {/* Bottom Left - Avoid overlapping footer */}
                <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&h=150&fit=crop&q=80"
                    alt="Pastry"
                    className="absolute bottom-24 left-4 w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl shadow-xl drop-shadow-xl"
                    style={{ border: '3px solid #FDA085', opacity: 0.9 }} />

                {/* Bottom Right - Avoid overlapping footer */}
                <img src="https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=150&h=150&fit=crop&q=80"
                    alt="Birthday Cake"
                    className="absolute bottom-24 right-4 w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl shadow-xl drop-shadow-xl"
                    style={{ border: '3px solid #FF6B6B', opacity: 0.9 }} />

                {/* Subtle Background Glows */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full blur-[120px]"
                    style={{ background: 'rgba(255, 142, 83, 0.12)' }}></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full blur-[120px]"
                    style={{ background: 'rgba(255, 107, 107, 0.12)' }}></div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-center px-6 py-12 gap-4 md:gap-8">

                {/* Logo - HUGE (3x Size Request) - No Bottom Margin to decrease space */}
                <div className="w-80 h-80 md:w-96 md:h-96 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-orange-400 opacity-20 blur-3xl rounded-full scale-110"></div>
                    <img
                        src={logo}
                        alt="Sewa Shubham Bakery"
                        className="w-full h-full object-contain drop-shadow-2xl relative z-10"
                    />
                </div>

                {/* Tagline */}
                <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight italic max-w-lg leading-relaxed px-2 mb-8"
                    style={{
                        background: 'linear-gradient(90deg, #D9480F 0%, #E8590C 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 4px 12px rgba(232, 89, 12, 0.15)'
                    }}>
                    ✨ Fresh Bakes • Delicious Moments ✨
                </h2>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-4 w-full max-w-md px-2 z-20">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm"
                        style={{ border: '1.5px solid #FF8E53', boxShadow: '0 4px 12px rgba(255, 142, 83, 0.1)' }}>
                        <FaStar size={14} color="#FF8E53" />
                        <span className="text-xs md:text-sm font-bold text-gray-800">4.9 Rating</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm"
                        style={{ border: '1.5px solid #FF6B6B', boxShadow: '0 4px 12px rgba(255, 107, 107, 0.1)' }}>
                        <FaClock size={14} color="#FF6B6B" />
                        <span className="text-xs md:text-sm font-bold text-gray-800">30min Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm"
                        style={{ border: '1.5px solid #20C997', boxShadow: '0 4px 12px rgba(32, 201, 151, 0.1)' }}>
                        <FaShieldAlt size={14} color="#20C997" />
                        <span className="text-xs md:text-sm font-bold text-gray-800">Safe Payment</span>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => navigate('/menu')}
                    className="group w-full max-w-xs text-white font-black text-lg md:text-xl py-4 md:py-5 px-8 md:px-10 rounded-2xl shadow-xl active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden mt-4 z-20"
                    style={{
                        background: 'linear-gradient(45deg, #FF512F 0%, #DD2476 100%)',
                        boxShadow: '0 20px 40px -10px rgba(255, 81, 47, 0.4)'
                    }}
                >
                    <span className="relative z-10 drop-shadow-md">🍰 Browse Our Menu</span>
                    <FaArrowRight className="relative z-10 drop-shadow-md" />
                </button>

                {/* Secondary CTA */}
                <button
                    onClick={() => navigate('/login')}
                    className="mt-2 text-sm font-bold hover:text-orange-600 hover:underline z-20 relative"
                    style={{ color: '#E8590C' }}
                >
                    Already a customer? Login →
                </button>
            </div>

            {/* Footer */}
            <div className="relative z-10 text-center pb-8 px-6">
                <p className="text-sm font-semibold" style={{ color: '#862E9C' }}>
                    Made with ❤️ for our lovely customers
                </p>
                <p className="text-xs mt-2 font-medium" style={{ color: '#ADB5BD' }}>
                    © 2024 Bakery Delight. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Welcome;
