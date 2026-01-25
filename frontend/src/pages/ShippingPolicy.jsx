import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaTruck, FaMapMarkerAlt, FaClock, FaRupeeSign } from 'react-icons/fa';
import Footer from '../components/Footer';

const ShippingPolicy = () => {
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
                    <h1 className="text-lg font-bold text-gray-800">Shipping & Delivery Policy</h1>
                </div>
            </header>

            {/* Content */}
            <div className="p-6 max-w-2xl mx-auto">
                <div className="prose prose-sm text-gray-600">
                    <p className="text-sm text-gray-400 mb-6">Last updated: January 2026</p>

                    {/* Delivery Summary Card */}
                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
                        <h3 className="text-base font-bold text-orange-800 mb-3">🚴 Delivery Overview</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm text-orange-700">
                            <div className="flex items-center gap-2">
                                <FaClock className="text-orange-600" />
                                <span>30-45 mins delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-orange-600" />
                                <span>Bharatpur area</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaRupeeSign className="text-orange-600" />
                                <span>Free delivery on ₹500+</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaTruck className="text-orange-600" />
                                <span>Pick-up available</span>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">1. Delivery Options</h2>
                    <p>We offer two ways to receive your order:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Home Delivery:</strong> We deliver to your doorstep within our serviceable area</li>
                        <li><strong>Self Pick-up:</strong> Collect your order from our store location</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">2. Serviceable Area</h2>
                    <p>We currently deliver to the following areas in and around Bharatpur, Rajasthan:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Bharatpur city and surrounding colonies</li>
                        <li>Areas within 10 km radius of our store</li>
                        <li>Delivery availability is shown at checkout based on your location</li>
                    </ul>
                    <p className="mt-2 text-gray-500 italic">If your area is not serviceable, you will be notified during checkout.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">3. Delivery Time</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Standard Orders:</strong> 30-45 minutes from order confirmation</li>
                        <li><strong>Peak Hours:</strong> May take 45-60 minutes during busy periods</li>
                        <li><strong>Large Orders:</strong> Custom orders may require additional preparation time</li>
                    </ul>
                    <p className="mt-2">Delivery times are estimates and may vary due to:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-500">
                        <li>Weather conditions</li>
                        <li>Traffic situations</li>
                        <li>High order volume</li>
                        <li>Distance from store</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">4. Delivery Charges</h2>
                    <div className="bg-gray-50 rounded-xl p-4 mt-2">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-2">Order Value</th>
                                    <th className="text-right py-2">Delivery Fee</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2">Below ₹500</td>
                                    <td className="text-right py-2">Based on distance</td>
                                </tr>
                                <tr className="text-green-600 font-semibold">
                                    <td className="py-2">₹500 and above</td>
                                    <td className="text-right py-2">FREE ✓</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Exact delivery fee is calculated at checkout based on your location.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">5. Order Tracking</h2>
                    <p>After placing your order:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>You will receive order confirmation via the app</li>
                        <li>Our team may contact you via WhatsApp/call for delivery coordination</li>
                        <li>For pick-up orders, you will be notified when your order is ready</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">6. Delivery Guidelines</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Please ensure someone is available at the delivery address</li>
                        <li>Provide accurate address with landmark for faster delivery</li>
                        <li>Keep your phone on ring mode for delivery calls</li>
                        <li>Check your order upon delivery and report issues immediately</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">7. Failed Delivery</h2>
                    <p>If delivery cannot be completed due to:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Customer not available at location</li>
                        <li>Incorrect address or phone number</li>
                        <li>Customer not responding to calls</li>
                    </ul>
                    <p className="mt-2">The order may be returned to our store. Refunds for such cases are subject to our <Link to="/refund" className="text-orange-600 font-bold underline">Refund Policy</Link>.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">8. Store Pick-up</h2>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-2">
                        <p className="text-sm text-blue-700">
                            <strong>📍 Store Location:</strong><br/>
                            Shubham Pattis, Bharatpur, Rajasthan<br/>
                            <strong>Timings:</strong> 10:00 AM - 10:00 PM (All days)<br/>
                            <strong>Contact:</strong> <a href="tel:+919694034523" className="underline">+91 96940 34523</a>
                        </p>
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">9. Contact for Delivery Issues</h2>
                    <p>For any delivery-related queries or issues, please contact us:</p>
                    <p className="mt-2">
                        📞 Phone: <a href="tel:+919694034523" className="font-bold text-orange-600">+91 96940 34523</a><br/>
                        💬 WhatsApp: <a href="https://wa.me/919694034523" className="font-bold text-orange-600">Chat Now</a>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ShippingPolicy;
