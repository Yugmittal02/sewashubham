import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaClock, FaPhoneAlt } from 'react-icons/fa';
import Footer from '../components/Footer';

const RefundPolicy = () => {
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
                    <h1 className="text-lg font-bold text-gray-800">Refund & Cancellation Policy</h1>
                </div>
            </header>

            {/* Content */}
            <div className="p-6 max-w-2xl mx-auto">
                <div className="prose prose-sm text-gray-600">
                    <p className="text-sm text-gray-400 mb-6">Last updated: January 2026</p>

                    {/* Quick Summary Card */}
                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
                        <h3 className="text-base font-bold text-orange-800 mb-3">📋 Quick Summary</h3>
                        <ul className="space-y-2 text-sm text-orange-700">
                            <li className="flex items-start gap-2">
                                <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Cancel within 2 minutes for full refund</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <FaClock className="text-orange-600 mt-0.5 flex-shrink-0" />
                                <span>Refunds processed in 5-7 business days</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <FaTimesCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                                <span>No refund after food preparation starts</span>
                            </li>
                        </ul>
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">1. Order Cancellation</h2>
                    <p>You may cancel your order under the following conditions:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Within 2 minutes:</strong> Full refund if cancelled before we start preparing your order.</li>
                        <li><strong>After preparation starts:</strong> No cancellation possible as food is perishable.</li>
                        <li><strong>Delivery orders:</strong> Cannot be cancelled once the delivery partner has picked up the food.</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">2. Refund Eligibility</h2>
                    <p>You are eligible for a refund in the following cases:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Order cancelled within the allowed time window</li>
                        <li>Wrong items delivered (verified with photos)</li>
                        <li>Missing items from your order</li>
                        <li>Food quality issues reported within 30 minutes of delivery</li>
                        <li>Order not delivered despite payment confirmation</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">3. Refund Process</h2>
                    <p>Once a refund is approved:</p>
                    <div className="bg-gray-50 rounded-xl p-4 mt-3">
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                <span>Refund initiated within 24 hours</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                <span>Amount credited to original payment method</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                <span>UPI/Card refunds: 5-7 business days</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                                <span>Cash payments: Wallet credit for next order</span>
                            </li>
                        </ul>
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">4. Non-Refundable Cases</h2>
                    <p>Refunds will NOT be provided for:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Change of mind after food is prepared</li>
                        <li>Incorrect delivery address provided by customer</li>
                        <li>Customer not available at delivery location</li>
                        <li>Complaints raised after 30 minutes of delivery</li>
                        <li>Taste preferences (unless quality issue)</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">5. How to Request a Refund</h2>
                    <p>To request a refund, please:</p>
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                        <li>Contact us immediately via WhatsApp or Phone</li>
                        <li>Provide your Order ID and phone number</li>
                        <li>Describe the issue with photos if applicable</li>
                        <li>Our team will respond within 2 hours during business hours</li>
                    </ol>

                    {/* Contact Card */}
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mt-6">
                        <h3 className="text-base font-bold text-green-800 mb-2 flex items-center gap-2">
                            <FaPhoneAlt /> Contact for Refunds
                        </h3>
                        <p className="text-sm text-green-700">
                            📞 Phone: <a href="tel:+919694034523" className="font-bold underline">+91 96940 34523</a><br/>
                            💬 WhatsApp: <a href="https://wa.me/919694034523" className="font-bold underline">Chat Now</a><br/>
                            📧 Email: <a href="mailto:Shubhamashwani25@gmail.com" className="font-bold underline">Shubhamashwani25@gmail.com</a>
                        </p>
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">6. Payment Gateway (Razorpay)</h2>
                    <p>All online payments are processed securely through Razorpay. In case of payment failures:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Amount debited but order not placed: Auto-refund in 5-7 days</li>
                        <li>Double payment: Duplicate amount refunded automatically</li>
                        <li>For any payment-related queries, contact Razorpay support or us</li>
                    </ul>

                    <div className="mt-8 pt-4 border-t border-gray-200 text-center">
                        <Link 
                            to="/contact" 
                            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                        >
                            Contact Us for Help
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default RefundPolicy;
