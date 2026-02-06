import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowRight, FaStar, FaClock, FaShieldAlt } from 'react-icons/fa';

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
            style={{ background: 'linear-gradient(135deg, #FAF7F2 0%, #F5F0E8 50%, #EDE5DA 100%)' }}>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating food images */}
                <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=120&h=120&fit=crop"
                    alt="Cake"
                    className="absolute top-[5%] left-[5%] w-16 h-16 md:w-24 md:h-24 object-cover rounded-2xl opacity-70 shadow-lg"
                    style={{ animation: 'float 6s ease-in-out infinite', border: '3px solid #E8E3DB' }} />
                <img src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=120&h=120&fit=crop"
                    alt="Coffee"
                    className="absolute top-[15%] right-[5%] w-14 h-14 md:w-20 md:h-20 object-cover rounded-2xl opacity-60 shadow-lg"
                    style={{ animation: 'float 5s ease-in-out infinite 0.5s', border: '3px solid #E8E3DB' }} />
                <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop"
                    alt="Burger"
                    className="absolute top-[45%] left-[2%] md:left-[8%] w-18 h-18 md:w-24 md:h-24 object-cover rounded-2xl opacity-65 shadow-lg"
                    style={{ animation: 'float 7s ease-in-out infinite 1s', border: '3px solid #E8E3DB' }} />
                <img src="https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=120&h=120&fit=crop"
                    alt="Birthday Cake"
                    className="absolute bottom-[20%] right-[3%] w-20 h-20 md:w-28 md:h-28 object-cover rounded-2xl opacity-60 shadow-lg"
                    style={{ animation: 'float 6s ease-in-out infinite 1.5s', border: '3px solid #E8E3DB' }} />

                {/* Glowing orbs */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full blur-[100px]"
                    style={{ background: 'rgba(201, 169, 98, 0.2)' }}></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full blur-[100px]"
                    style={{ background: 'rgba(107, 68, 35, 0.15)' }}></div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-center px-6 py-12">
                {/* Logo */}
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl flex items-center justify-center mb-6 md:mb-8"
                    style={{
                        background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF7F2 100%)',
                        border: '4px solid #C9A962',
                        boxShadow: '0 20px 60px rgba(107, 68, 35, 0.2), 0 0 0 8px rgba(201, 169, 98, 0.1)',
                        animation: 'float 4s ease-in-out infinite'
                    }}>
                    <span className="text-6xl md:text-7xl">🧁</span>
                </div>

                {/* Branding */}
                <h1 className="text-5xl md:text-7xl font-script mb-2" style={{ color: '#6B4423' }}>
                    Bakery Delight
                </h1>
                <p className="text-lg font-semibold tracking-[0.3em] uppercase mb-2" style={{ color: '#A89580' }}>
                    Bakery & Cafe
                </p>

                {/* Tagline */}
                <p className="text-base mb-8 max-w-sm" style={{ color: '#8B7355' }}>
                    ✨ Fresh Bakes • Delicious Moments • Happy Memories ✨
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.8)', border: '2px solid #E8E3DB' }}>
                        <FaStar size={14} color="#F5A623" />
                        <span className="text-sm font-semibold" style={{ color: '#6B4423' }}>4.9 Rating</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.8)', border: '2px solid #E8E3DB' }}>
                        <FaClock size={14} color="#6B4423" />
                        <span className="text-sm font-semibold" style={{ color: '#6B4423' }}>30min Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.8)', border: '2px solid #E8E3DB' }}>
                        <FaShieldAlt size={14} color="#22C55E" />
                        <span className="text-sm font-semibold" style={{ color: '#6B4423' }}>Safe Payment</span>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => navigate('/menu')}
                    className="group w-full max-w-xs text-white font-bold text-lg py-5 px-10 rounded-2xl shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
                    style={{
                        background: 'linear-gradient(135deg, #6B4423 0%, #5C4033 100%)',
                        boxShadow: '0 16px 48px rgba(107, 68, 35, 0.35)'
                    }}
                >
                    <span>🍰 Browse Our Menu</span>
                    <FaArrowRight className="transition-transform group-hover:translate-x-2" />
                </button>

                {/* Secondary CTA */}
                <button
                    onClick={() => navigate('/login')}
                    className="mt-4 text-sm font-semibold transition-all hover:underline"
                    style={{ color: '#6B4423' }}
                >
                    Already a customer? Login →
                </button>
            </div>

            {/* Footer */}
            <div className="relative z-10 text-center pb-8 px-6">
                <p className="text-sm font-medium" style={{ color: '#A89580' }}>
                    Made with ❤️ for our lovely customers
                </p>
                <p className="text-xs mt-2" style={{ color: '#C4B5A0' }}>
                    © 2024 Bakery Delight. All rights reserved.
                </p>
            </div>

            {/* CSS for animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(2deg); }
                }
            `}</style>
        </div>
    );
};

export default Welcome;
