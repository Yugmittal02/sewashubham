import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaUserShield, FaArrowRight } from 'react-icons/fa';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-400 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating food icons with animations */}
                <div className="absolute top-[10%] left-[10%] text-7xl opacity-20 animate-float-slow">🍰</div>
                <div className="absolute top-[20%] right-[15%] text-5xl opacity-15 animate-float-medium">🥐</div>
                <div className="absolute top-[50%] left-[5%] text-6xl opacity-20 animate-float-fast">☕</div>
                <div className="absolute bottom-[20%] right-[10%] text-7xl opacity-15 animate-float-slow">🍪</div>
                <div className="absolute bottom-[40%] left-[20%] text-5xl opacity-10 animate-float-medium">🎂</div>
                <div className="absolute top-[60%] right-[25%] text-4xl opacity-15 animate-float-fast">🧁</div>
                
                {/* Glowing orbs */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl"></div>
            </div>
            
            {/* Main Content */}
            <div className="relative z-10 text-center max-w-md animate-fade-in-up">
                {/* Logo with glassmorphism */}
                <div className="w-32 h-32 bg-white/90 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-900/30 border border-white/50 animate-bounce-gentle">
                    <FaUtensils className="text-5xl text-orange-600" />
                </div>
                
                {/* Branding */}
                <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-2 drop-shadow-lg">
                    Sewa<span className="text-yellow-200">Shubham</span>
                </h1>
                <p className="text-xl font-bold tracking-widest uppercase opacity-90 mb-3">
                    Bakery & Cafe
                </p>
                <p className="text-base opacity-80 mb-10 font-medium">
                    ✨ Fresh Bakes • Delicious Moments • Happy Memories ✨
                </p>
                
                {/* CTA Buttons */}
                <div className="space-y-4">
                    <button 
                        onClick={() => navigate('/menu')}
                        className="group w-full bg-white text-orange-600 font-bold text-lg py-4 px-8 rounded-2xl shadow-xl shadow-orange-900/20 hover:shadow-2xl hover:shadow-orange-900/30 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 hover:gap-5"
                    >
                        <span>Browse Our Menu</span>
                        <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                    </button>
                    
                    <button 
                        onClick={() => navigate('/admin/login')}
                        className="w-full bg-white/15 backdrop-blur-md text-white font-semibold py-3.5 px-6 rounded-xl border border-white/30 hover:bg-white/25 hover:border-white/50 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <FaUserShield /> Admin Login
                    </button>
                </div>
                
                {/* Footer */}
                <p className="mt-14 text-sm opacity-60 font-medium">
                    Made with ❤️ for our lovely customers
                </p>
            </div>

            {/* Custom CSS for animations */}
            <style>{`
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes float-medium {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(-5deg); }
                }
                @keyframes float-fast {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(3deg); }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes bounce-gentle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
                .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
                .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
                .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
                .animate-bounce-gentle { animation: bounce-gentle 3s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default Welcome;
