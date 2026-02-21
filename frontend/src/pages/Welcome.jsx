import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowRight, FaUtensils } from 'react-icons/fa';

const Welcome = () => {
    const navigate = useNavigate();
    const { customer } = useAuth();

    useEffect(() => {
        if (customer) {
            navigate('/menu');
        }
    }, [customer, navigate]);

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Gradient - Warm peach/orange matching screenshot */}
            <div className="absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(180deg, #FFF5EB 0%, #FFE8D0 30%, #FFDFC0 60%, #FFE8D0 100%)',
                }}
            ></div>

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #F97316 1px, transparent 1px),
                                      radial-gradient(circle at 75% 75%, #F97316 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            ></div>

            {/* Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-40"
                style={{ background: '#FFD6A8' }}></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-40"
                style={{ background: '#FFCFA0' }}></div>

            {/* Floating Food Items - Matching the screenshot layout */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                {/* Top Left - Cake/Dessert */}
                <div className="absolute top-[3%] left-[2%] animate-float-slow">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden shadow-xl"
                        style={{ boxShadow: '0 8px 30px rgba(249, 115, 22, 0.15)' }}>
                        <img
                            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop&q=80"
                            alt="Chocolate Cake"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Top Right - Drink */}
                <div className="absolute top-[10%] right-[2%] animate-float-medium">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden shadow-xl"
                        style={{ boxShadow: '0 8px 30px rgba(249, 115, 22, 0.15)' }}>
                        <img
                            src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&h=300&fit=crop&q=80"
                            alt="Iced Drink"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Bottom Left - Pastry/Dessert */}
                <div className="absolute bottom-[22%] left-[-3%] animate-float-fast">
                    <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden shadow-xl"
                        style={{ boxShadow: '0 8px 30px rgba(249, 115, 22, 0.15)' }}>
                        <img
                            src="https://images.unsplash.com/photo-1626803775151-61d756612f97?w=300&h=300&fit=crop&q=80"
                            alt="Pastry"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Bottom Right - Drink */}
                <div className="absolute bottom-[8%] right-[-1%] animate-float-slow">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden shadow-xl"
                        style={{ boxShadow: '0 8px 30px rgba(249, 115, 22, 0.15)' }}>
                        <img
                            src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&h=300&fit=crop&q=80"
                            alt="Iced Drink"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Mid Right - Small floating drink */}
                <div className="absolute top-[45%] right-[0%] animate-float-medium">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden shadow-lg"
                        style={{ boxShadow: '0 8px 30px rgba(249, 115, 22, 0.12)' }}>
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

                {/* Fork/Knife Icon in White Circle */}
                <div className="mb-6 relative">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center"
                        style={{
                            background: '#FFFFFF',
                            boxShadow: '0 8px 40px rgba(249, 115, 22, 0.15), 0 2px 10px rgba(0,0,0,0.05)',
                        }}>
                        <FaUtensils size={40} color="#F97316" />
                    </div>
                </div>

                {/* Brand Name - "ShubhamPattis" */}
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                    <span style={{ color: '#1a1a2e' }}>Shubham</span>
                    <span style={{ color: '#F97316' }}>Pattis</span>
                </h1>

                {/* Subtitle - "BAKERY & CAFE" */}
                <p className="text-sm md:text-base font-semibold tracking-[0.25em] uppercase mb-6"
                    style={{ color: '#9CA3AF' }}>
                    Bakery & Cafe
                </p>

                {/* Tagline */}
                <p className="text-base md:text-lg font-medium max-w-md mb-10 leading-relaxed"
                    style={{ color: '#6B7280' }}>
                    ✨ Fresh Bakes • Delicious Moments • Happy Memories ✨
                </p>

                {/* Main CTA Button */}
                <button
                    onClick={() => navigate('/menu')}
                    className="group text-white font-bold text-lg py-4 px-10 rounded-2xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 active:scale-95 w-full max-w-sm justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                        boxShadow: '0 8px 30px rgba(249, 115, 22, 0.35)',
                    }}
                >
                    Browse Our Menu
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Footer - "Made with ❤️ for our lovely customers" */}
            <div className="relative z-20 pb-8 text-center">
                <p className="text-sm font-medium" style={{ color: '#D97706' }}>
                    Made with <span className="text-red-500">❤️</span> for our lovely customers
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
            `}
            </style>
        </div>
    );
};

export default Welcome;
