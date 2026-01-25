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

                    {/* Summary Card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                        <h3 className="text-base font-bold text-blue-800 mb-2">🔒 Your Privacy Matters</h3>
                        <p className="text-sm text-blue-700">
                            We collect minimal data required to process your order. We never sell your information to third parties.
                        </p>
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">1. Information We Collect</h2>
                    <p>We collect the following information when you place an order:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Personal Information:</strong> Name, phone number</li>
                        <li><strong>Delivery Address:</strong> Location coordinates and manual address (for delivery orders)</li>
                        <li><strong>Order Details:</strong> Items ordered, preferences, order history</li>
                        <li><strong>Payment Information:</strong> Payment method selected (we do NOT store card/UPI details)</li>
                        <li><strong>Device Information:</strong> Browser type, device type for service optimization</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">2. How We Use Your Information</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Processing and delivering your orders</li>
                        <li>Communicating order status via WhatsApp/SMS</li>
                        <li>Improving our services and menu offerings</li>
                        <li>Sending promotional offers (only with your consent)</li>
                        <li>Customer support and issue resolution</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">3. Payment Data Security</h2>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-2">
                        <p className="text-sm text-green-700">
                            <strong>🔐 Important:</strong> All online payments are processed through <strong>Razorpay</strong>, a PCI-DSS compliant payment gateway. 
                            We do NOT store, process, or have access to your card numbers, CVV, or UPI PIN. 
                            Payment data is encrypted and handled directly by Razorpay.
                        </p>
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">4. Data Sharing</h2>
                    <p>We may share your information with:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Delivery Partners:</strong> Name, phone, and address for delivery</li>
                        <li><strong>Payment Gateway (Razorpay):</strong> Order amount and transaction details</li>
                        <li><strong>Legal Authorities:</strong> If required by law or court order</li>
                    </ul>
                    <p className="mt-2 font-semibold text-gray-700">We NEVER sell your data to advertisers or marketing companies.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">5. Cookies & Local Storage</h2>
                    <p>We use browser storage to:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Remember your cart items between sessions</li>
                        <li>Store your preferences (name, phone for faster checkout)</li>
                        <li>Track cookie consent preferences</li>
                    </ul>
                    <p className="mt-2">This data stays on your device and is not transmitted to our servers unless you place an order.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">6. Data Retention</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Order data is retained for 2 years for business records</li>
                        <li>Contact information is kept until you request deletion</li>
                        <li>Payment records are maintained as per legal requirements</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">7. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Access:</strong> Request a copy of your personal data</li>
                        <li><strong>Correction:</strong> Update inaccurate information</li>
                        <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
                        <li><strong>Opt-out:</strong> Unsubscribe from promotional communications</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">8. Data Security</h2>
                    <p>We implement security measures including:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>HTTPS encryption for all data transmission</li>
                        <li>Secure database with access controls</li>
                        <li>Regular security updates and monitoring</li>
                    </ul>
                    <p className="mt-2">However, no internet transmission is 100% secure. We cannot guarantee absolute security.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">9. Third-Party Services</h2>
                    <p>We use the following third-party services:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Razorpay:</strong> Payment processing (<a href="https://razorpay.com/privacy/" className="text-orange-600 underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)</li>
                        <li><strong>Google Maps:</strong> Location services for delivery</li>
                        <li><strong>Cloudinary:</strong> Image hosting for menu items</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">10. Contact Us</h2>
                    <p>For privacy-related queries or to exercise your rights, contact us:</p>
                    <p className="mt-2">
                        📞 Phone: <a href="tel:+919694034523" className="font-bold text-orange-600">+91 96940 34523</a><br/>
                        📧 Email: <a href="mailto:Shubhamashwani25@gmail.com" className="font-bold text-orange-600">Shubhamashwani25@gmail.com</a>
                    </p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">11. Policy Updates</h2>
                    <p>We may update this policy from time to time. The latest version will always be available on this page with the updated date.</p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
