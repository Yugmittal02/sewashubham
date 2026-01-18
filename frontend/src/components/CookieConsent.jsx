import React, { useState, useEffect } from 'react';
import { FaCookieBite, FaShieldAlt } from 'react-icons/fa';

const CookieConsent = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookieConsent');
        if (consent === null) {
            // Show banner after a short delay for better UX
            const timer = setTimeout(() => setShowBanner(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setShowBanner(false);
        
        // Migrate any existing session data to persistent storage
        const customer = sessionStorage.getItem('customer');
        const customerToken = sessionStorage.getItem('customerToken');
        if (customer) {
            localStorage.setItem('customer', customer);
        }
        if (customerToken) {
            localStorage.setItem('customerToken', customerToken);
        }
    };

    const handleReject = () => {
        localStorage.setItem('cookieConsent', 'rejected');
        setShowBanner(false);
        // Clear any persistent customer data since they rejected
        localStorage.removeItem('customer');
        // Keep token for session functionality but don't persist customer data
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-slide-up">
            <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <FaCookieBite className="text-white text-2xl" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">We Use Cookies 🍪</h3>
                        <p className="text-white/80 text-sm">To improve your experience</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <p className="text-gray-600 text-sm mb-4">
                        We use cookies to remember your login details so you don't have to enter them again. 
                        Your data stays on your device and helps us serve you better!
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                        <FaShieldAlt />
                        <span>Your privacy is important to us</span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleReject}
                            className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 active:scale-95 transition-all"
                        >
                            Reject
                        </button>
                        <button
                            onClick={handleAccept}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 active:scale-95 transition-all"
                        >
                            Accept Cookies
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 0.4s ease-out;
                }
            `}</style>
        </div>
    );
};

export default CookieConsent;
