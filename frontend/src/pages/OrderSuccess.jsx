import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaReceipt } from 'react-icons/fa';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Trigger animation after mount
        setTimeout(() => setShowContent(true), 100);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background celebration elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Confetti-like elements */}
                <div className="absolute top-10 left-10 w-4 h-4 bg-orange-400 rounded-full animate-float-1 opacity-60"></div>
                <div className="absolute top-20 right-20 w-3 h-3 bg-green-400 rounded-full animate-float-2 opacity-60"></div>
                <div className="absolute top-40 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-float-3 opacity-60"></div>
                <div className="absolute bottom-40 right-1/3 w-4 h-4 bg-pink-400 rounded-full animate-float-1 opacity-60"></div>
                <div className="absolute bottom-20 left-20 w-3 h-3 bg-blue-400 rounded-full animate-float-2 opacity-60"></div>
                <div className="absolute top-1/3 right-10 w-2 h-2 bg-purple-400 rounded-full animate-float-3 opacity-60"></div>
                
                {/* Glowing orbs */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-300/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl"></div>
            </div>

            {/* Main Content */}
            <div className={`relative z-10 text-center max-w-sm transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Success Icon */}
                <div className="relative mb-8">
                    <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-300/50 animate-pulse-slow">
                        <FaCheckCircle className="text-5xl text-white" />
                    </div>
                    {/* Ring animation */}
                    <div className="absolute inset-0 w-28 h-28 mx-auto rounded-full border-4 border-green-300/50 animate-ping-slow"></div>
                </div>

                {/* Text */}
                <h1 className="text-3xl font-black text-gray-800 mb-3">
                    Order Placed! 🎉
                </h1>
                <p className="text-gray-600 mb-2 font-medium">
                    Your order has been successfully placed.
                </p>
                <p className="text-sm text-gray-500 mb-8">
                    We're preparing your delicious food. It'll be ready soon!
                </p>

                {/* Order Info Card */}
                <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 mb-6">
                    <div className="flex items-center justify-center gap-3 text-green-600">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <FaReceipt />
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-500">Estimated Time</p>
                            <p className="font-bold text-gray-800">15-20 minutes</p>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                    <button 
                        onClick={() => navigate('/menu')}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-orange-200/50 hover:shadow-orange-300/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <FaHome /> Back to Menu
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all"
                    >
                        Go to Home
                    </button>
                </div>
            </div>

            {/* Custom CSS */}
            <style>{`
                @keyframes float-1 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(180deg); }
                }
                @keyframes float-2 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(-180deg); }
                }
                @keyframes float-3 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-25px) rotate(90deg); }
                }
                @keyframes ping-slow {
                    0% { transform: scale(1); opacity: 0.5; }
                    75%, 100% { transform: scale(1.5); opacity: 0; }
                }
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
                .animate-float-2 { animation: float-2 5s ease-in-out infinite; }
                .animate-float-3 { animation: float-3 3.5s ease-in-out infinite; }
                .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
                .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default OrderSuccess;
