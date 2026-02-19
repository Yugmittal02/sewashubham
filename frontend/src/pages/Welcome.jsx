import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowRight, FaUtensils } from 'react-icons/fa';
import brandLogo from '../assets/brand_logo.png';

const Welcome = () => {
    const navigate = useNavigate();
    const { customer } = useAuth();

    useEffect(() => {
        if (customer) {
            navigate('/menu');
        }
    }, [customer, navigate]);

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-white">
            {/* Background Gradient - Very subtle and bright */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF7] via-[#FFF8F0] to-[#FFF0DC] z-0"></div>

            {/* Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-[100px] opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[100px] opacity-60"></div>

            {/* Floating Food Items - Placed naturally like the reference */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                {/* Top Left - Cake/Dessert */}
                <div className="absolute top-[5%] left-[5%] animate-float-slow">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-2xl shadow-orange-100/50">
                        <img
                            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop&q=80"
                            alt="Chocolate Cake"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Top Right - Drink */}
                <div className="absolute top-[15%] right-[5%] animate-float-medium">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden shadow-2xl shadow-orange-100/50">
                        <img
                            src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&h=300&fit=crop&q=80"
                            alt="Iced Drink"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Bottom Left - Pastry/Dessert */}
                <div className="absolute bottom-[20%] left-[-2%] animate-float-fast">
                    <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl shadow-orange-100/50">
                        <img
                            src="https://images.unsplash.com/photo-1626803775151-61d756612f97?w=300&h=300&fit=crop&q=80"
                            alt="Pastry"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Bottom Right - Small Drink/Item */}
                <div className="absolute bottom-[10%] right-[0%] animate-float-slow">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden shadow-xl shadow-orange-100/50">
                        <img
                            src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=300&fit=crop&q=80"
                            alt="Milkshake"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-20 text-center px-6">

                {/* Logo */}
                <div className="mb-2 relative">
                    <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                        <img
                            src={brandLogo}
                            alt="Sewa Shubham Bakery"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>

                {/* Brand Name */}
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-gray-900">
                    <span className="text-slate-800">Sewa Shubham </span>
                    <span className="text-orange-500">Bakery</span>
                </h1>

                {/* Tagline */}
                <p className="text-lg md:text-xl font-medium text-slate-600 max-w-lg mb-10 leading-relaxed">
                    Fresh Bakes • Delicious Moments • <span className="text-yellow-500 font-bold">Happy Memories ✨</span>
                </p>

                {/* Main CTA Button */}
                <button
                    onClick={() => navigate('/menu')}
                    className="group bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 px-8 rounded-2xl shadow-lg shadow-orange-500/30 flex items-center gap-3 transition-all duration-300 transform hover:scale-105 active:scale-95 w-full max-w-xs justify-center"
                >
                    Browse Our Menu
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Secondary/Login Link */}
                <button
                    onClick={() => navigate('/login')}
                    className="mt-6 text-sm font-medium text-gray-400 hover:text-orange-500 transition-colors"
                >
                    Member Login
                </button>

            </div>

            {/* Footer - Copyright */}
            <div className="relative z-20 pb-6 text-center">
                <p className="text-xs md:text-sm font-medium text-gray-300">
                    Made with <span className="text-red-400">❤️</span> for our lovely customers
                </p>
            </div>


            {/* Keyframe Animations for Floating */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(2deg); }
                }
                @keyframes float-reverse {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(15px) rotate(-2deg); }
                }
                 .animate-float-slow {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-medium {
                    animation: float-reverse 5s ease-in-out infinite;
                }
                .animate-float-fast {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Welcome;

