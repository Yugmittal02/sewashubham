import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="px-4 py-4 flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 active:scale-95 transition-transform"
                    >
                        <FaArrowLeft size={16} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">Privacy Policy</h1>
                </div>
            </header>

            {/* Content */}
            <div className="p-6 max-w-2xl mx-auto">
                <div className="prose prose-sm text-gray-600">
                    <p className="text-sm text-gray-400 mb-6">Last updated: January 2026</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">1. Information We Collect</h2>
                    <p>We collect your name, phone number, and delivery address to process your orders. Location data is used only for delivery purposes.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">2. How We Use Your Information</h2>
                    <p>Your information is used to process orders, communicate about your order status, and improve our services. We do not share your data with third parties for marketing.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">3. Data Security</h2>
                    <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">4. Cookies & Local Storage</h2>
                    <p>We use local storage to remember your cart items and preferences. This data stays on your device and is not transmitted to our servers.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">5. Your Rights</h2>
                    <p>You have the right to access, correct, or delete your personal data. Contact us to exercise these rights.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">6. Contact Us</h2>
                    <p>If you have questions about this Privacy Policy, please contact us through our Contact page.</p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
