import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaReceipt, FaPhoneAlt, FaSpinner, FaUtensils, FaBoxOpen, FaMotorcycle } from 'react-icons/fa';
import { fetchOrderStatus, getStoreSettings } from '../services/api';
import Footer from '../components/Footer';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    
    // Redirect if direct access without state (optional security/UX)
    useEffect(() => {
        if (!state?.orderId) {
            navigate('/');
        }
    }, [state, navigate]);

    const [showContent, setShowContent] = useState(false);
    const [adminPhone, setAdminPhone] = useState('9876543210');
    const [orderStatus, setOrderStatus] = useState('Pending');

    useEffect(() => {
        // Trigger animation after mount
        setTimeout(() => setShowContent(true), 100);
        
        // Fetch store settings for admin phone
        const loadSettings = async () => {
            try {
                const { data } = await getStoreSettings();
                if (data.adminPhone) {
                    setAdminPhone(data.adminPhone);
                }
            } catch (error) {
                console.error('Failed to load store settings:', error);
            }
        };
        loadSettings();

        // Poll for order status
        if (state?.orderId) {
            const pollStatus = async () => {
                try {
                    const { data } = await fetchOrderStatus(state.orderId);
                    setOrderStatus(data.status);
                } catch (error) {
                    console.error('Failed to track order:', error);
                }
            };
            
            // Initial poll
            pollStatus();
            
            // Poll every 5 seconds
            const interval = setInterval(pollStatus, 5000);
            return () => clearInterval(interval);
        }
    }, [state?.orderId]);

    const steps = [
        { status: 'Pending', label: 'Order Received', icon: FaReceipt },
        { status: 'Preparing', label: 'Preparing', icon: FaUtensils },
        { status: 'Ready', label: 'Ready', icon: FaBoxOpen },
        { status: 'Delivered', label: 'Completed', icon: FaCheckCircle },
    ];

    const getCurrentStepIndex = () => {
        if (orderStatus === 'Cancelled') return -1;
        const idx = steps.findIndex(s => s.status === orderStatus);
        return idx === -1 ? 0 : idx; // Default to 0 if unknown
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 flex flex-col relative overflow-hidden">
            {/* Background ... (same) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* ... confetti ... */}
            </div>

            {/* Main Content - Centered */}
            <div className="flex-1 flex items-center justify-center p-6 py-12">
                <div className={`relative z-10 text-center max-w-sm w-full transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    
                    {/* Status Header */}
                    <div className="mb-8">
                        {orderStatus === 'Cancelled' ? (
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
                                <span className="text-3xl">❌</span>
                            </div>
                        ) : (
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl animate-pulse-slow">
                                <span className="text-3xl">🎉</span>
                            </div>
                        )}
                        <h1 className="text-2xl font-black text-gray-800 mb-1">
                            {orderStatus === 'Cancelled' ? 'Order Cancelled' : 'Order Placed!'}
                        </h1>
                        <p className="text-gray-500 font-medium">
                            {orderStatus === 'Cancelled' ? 'This order was cancelled.' : `Thank You, ${state?.customerName || 'Friend'}!`}
                        </p>
                    </div>

                    {/* Status Tracker */}
                    {orderStatus !== 'Cancelled' && (
                        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-green-100/50 border border-white mb-6">
                            <div className="flex justify-between relative">
                                {/* Connector Line */}
                                <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-100 -z-0 rounded-full mx-4">
                                    <div 
                                        className="h-full bg-green-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                                    ></div>
                                </div>

                                {steps.map((step, idx) => {
                                    const isCompleted = idx <= currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;
                                    const Icon = step.icon;
                                    
                                    return (
                                        <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                                isCompleted 
                                                    ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200' 
                                                    : 'bg-white border-gray-200 text-gray-300'
                                            }`}>
                                                <Icon size={14} />
                                            </div>
                                            <span className={`text-[10px] font-bold transition-all duration-300 ${
                                                isCurrent ? 'text-green-600 scale-110' : 'text-gray-400'
                                            }`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            
                                {/* Status Message */}
                            <div className="mt-6 bg-green-50 rounded-xl p-3 text-green-800 text-sm font-bold flex items-center justify-center gap-2">
                                {orderStatus === 'Pending' && <FaSpinner className="animate-spin" />}
                                {orderStatus === 'Preparing' && <FaUtensils className="animate-bounce" />} 
                                <span>
                                    {orderStatus === 'Pending' && 'Waiting for confirmation...'}
                                    {orderStatus === 'Preparing' && 'Chef is preparing your food!'}
                                    {orderStatus === 'Ready' && 'Your order is ready!'}
                                    {orderStatus === 'Delivered' && 'Order Completed!'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Order Details */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 mb-6 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Order ID</span>
                            <span className="font-bold text-gray-700 font-mono tracking-wider">{state?.orderId?.slice(-6).toUpperCase() || '---'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Date</span>
                            <span className="font-bold text-gray-700">
                                {state?.orderDate ? new Date(state.orderDate).toLocaleString('en-IN', {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                }) : '---'}
                            </span>
                        </div>
                    </div>

                    {/* Admin Contact Button */}
                    <a href={`tel:${adminPhone}`} className="block w-full bg-white border-2 border-orange-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-orange-50 hover:border-orange-200 transition-colors flex items-center justify-center gap-2 mb-4">
                        <FaPhoneAlt className="text-orange-500" />
                        <span>Call Store: {adminPhone}</span>
                    </a>

                    {/* Home Button */}
                    <button 
                        onClick={() => navigate('/menu')}
                        className="text-gray-400 font-semibold text-sm hover:text-gray-600 transition-colors"
                    >
                        Return to Home
                    </button>
                    
                </div>
            </div>

            <Footer />

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
