import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Footer from '../components/Footer';

const TermsConditions = () => {
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
                    <h1 className="text-lg font-bold text-gray-800">Terms & Conditions</h1>
                </div>
            </header>

            {/* Content */}
            <div className="p-6 max-w-2xl mx-auto">
                <div className="prose prose-sm text-gray-600">
                    <p className="text-sm text-gray-400 mb-6">Last updated: January 2026</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">1. Acceptance of Terms</h2>
                    <p>By accessing and using ShubhamPattis ordering service, you accept and agree to be bound by these Terms and Conditions.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">2. Orders & Payments</h2>
                    <p>All orders are subject to availability. Prices are subject to change without notice. Payment must be made at the time of order or delivery as specified.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">3. Delivery</h2>
                    <p>Delivery times are estimates only. We are not responsible for delays beyond our control. Delivery charges may apply based on distance.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">4. Cancellations & Refunds</h2>
                    <p>Orders can be cancelled within 2 minutes of placing. After preparation begins, cancellations may not be possible. Refunds are processed within 5-7 business days.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">5. Food Quality</h2>
                    <p>We ensure fresh and hygienic preparation. Please inform us of any allergies before ordering. Quality concerns must be reported within 30 minutes of delivery.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">6. Contact</h2>
                    <p>For any queries or concerns, please contact us through the Contact Us page or call our store directly.</p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TermsConditions;
