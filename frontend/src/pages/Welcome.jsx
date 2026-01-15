import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUtensils, FaUserShield, FaArrowRight } from 'react-icons/fa';

const Welcome = () => {
    const navigate = useNavigate();
    const { customer } = useAuth(); // Assuming useAuth is exported from context

    useEffect(() => {
        if (customer) {
            navigate('/menu');
        }
    }, [customer, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex flex-col items-center justify-center p-6 text-gray-800 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating food icons with animations */}
                {/* Floating food images with animations - Optimized for Mobile */}
                <img src="https://ik.imagekit.io/ayushrathore1/dessert?updatedAt=1768506158643" alt="Dessert" className="absolute top-[5%] left-[5%] w-16 h-16 md:w-24 md:h-24 object-cover rounded-full opacity-60 animate-float-slow shadow-lg" />
                <img src="https://ik.imagekit.io/ayushrathore1/drinks?updatedAt=1768506197569" alt="Drinks" className="absolute top-[15%] right-[5%] w-14 h-14 md:w-20 md:h-20 object-cover rounded-full opacity-50 animate-float-medium shadow-lg" />
                <img src="https://ik.imagekit.io/ayushrathore1/bun?updatedAt=1768506241846" alt="Bun" className="absolute top-[45%] left-[-5%] md:left-[5%] w-20 h-20 md:w-28 md:h-28 object-cover rounded-full opacity-60 animate-float-fast shadow-lg" />
                
                <img src="https://ik.imagekit.io/ayushrathore1/dessert?updatedAt=1768506158643" alt="Dessert" className="absolute bottom-[15%] right-[5%] w-24 h-24 md:w-32 md:h-32 object-cover rounded-full opacity-50 animate-float-slow shadow-lg" />
                <img src="https://ik.imagekit.io/ayushrathore1/drinks?updatedAt=1768506197569" alt="Drinks" className="absolute bottom-[35%] left-[5%] w-16 h-16 md:w-24 md:h-24 object-cover rounded-full opacity-40 animate-float-medium shadow-lg" />
                <img src="https://ik.imagekit.io/ayushrathore1/bun?updatedAt=1768506241846" alt="Bun" className="absolute top-[55%] right-[-10%] md:right-[25%] w-14 h-14 md:w-20 md:h-20 object-cover rounded-full opacity-50 animate-float-fast shadow-lg" />
                
                {/* Glowing orbs */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-orange-200/20 rounded-full blur-[80px] md:blur-[100px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-amber-200/20 rounded-full blur-[80px] md:blur-[100px]"></div>
            </div>
            
            {/* Main Content */}
            <div className="relative z-10 text-center max-w-md animate-fade-in-up px-4">
                {/* Logo with glassmorphism */}
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-2xl shadow-orange-100 border-4 border-orange-50 animate-bounce-gentle">
                    <FaUtensils className="text-4xl md:text-5xl text-orange-500" />
                </div>
                
                {/* Branding */}
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 drop-shadow-sm text-gray-800">
                    Shubham<span className="text-orange-500">Pattis</span>
                </h1>
                <p className="text-xl font-bold tracking-widest uppercase text-gray-400 mb-3">
                    Bakery & Cafe
                </p>
                <p className="text-base text-gray-500 mb-10 font-medium">
                    ✨ Fresh Bakes • Delicious Moments • Happy Memories ✨
                </p>
                
                {/* CTA Buttons */}
                <div className="space-y-4">
                    <button 
                        onClick={() => navigate('/menu')}
                        className="group w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg py-4 px-8 rounded-2xl shadow-xl shadow-orange-200 hover:shadow-2xl hover:shadow-orange-300 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 hover:gap-5"
                    >
                        <span>Browse Our Menu</span>
                        <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                    </button>
                    
{/* Admin Login button removed as per redesign */}
                </div>
                
                {/* Footer */}
                <p className="mt-14 text-sm text-gray-400 font-medium">
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
