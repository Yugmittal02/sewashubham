import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

                    {/* Business Details Card */}
                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
                        <h3 className="text-base font-bold text-orange-800 mb-2">🏪 Business Information</h3>
                        <p className="text-sm text-orange-700">
                            <strong>Business Name:</strong> Shubham Pattis (SewaShubham Bakery)<br/>
                            <strong>Location:</strong> Bharatpur, Rajasthan, India<br/>
                            <strong>Contact:</strong> +91 96940 34523<br/>
                            <strong>Email:</strong> Shubhamashwani25@gmail.com
                        </p>
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">1. Acceptance of Terms</h2>
                    <p>By accessing and using the ShubhamPattis website (sewashubhambakery.com) and ordering services, you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">2. Services Offered</h2>
                    <p>ShubhamPattis provides online food ordering services including:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Bakery items (pattis, pizzas, snacks)</li>
                        <li>Pick-up orders from our store</li>
                        <li>Home delivery within our serviceable area</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">3. Orders & Pricing</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>All orders are subject to availability and confirmation.</li>
                        <li>Prices displayed are in Indian Rupees (INR) and include applicable taxes.</li>
                        <li>We reserve the right to modify prices without prior notice.</li>
                        <li>Platform fee and delivery charges (if applicable) will be shown before checkout.</li>
                        <li>Special offers and discounts are subject to terms mentioned on the offer.</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">4. Payment Terms</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Cash on Delivery (COD):</strong> Pay in cash when your order arrives.</li>
                        <li><strong>Online Payment (UPI/Razorpay):</strong> Secure payment through Razorpay payment gateway.</li>
                        <li>All online transactions are encrypted and processed securely.</li>
                        <li>We do not store your card/UPI details on our servers.</li>
                        <li>Payment must be completed before order preparation begins (for online orders).</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">5. Delivery Terms</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Delivery is available within our serviceable area only.</li>
                        <li>Delivery times are estimates and may vary due to traffic, weather, or demand.</li>
                        <li>Delivery charges are calculated based on distance from our store.</li>
                        <li>Free delivery is offered on orders above the threshold amount (if applicable).</li>
                        <li>Customer must be available at the delivery location and provide accurate address.</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">6. Cancellation & Refunds</h2>
                    <p>Please refer to our <Link to="/refund" className="text-orange-600 font-bold underline">Refund & Cancellation Policy</Link> for detailed information on cancellations and refunds.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">7. Food Quality & Safety</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>All food items are freshly prepared with hygienic practices.</li>
                        <li>Please inform us of any food allergies before ordering.</li>
                        <li>Quality concerns must be reported within 30 minutes of delivery with photos.</li>
                        <li>Consume food immediately for best quality; we are not liable for items stored improperly.</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">8. User Responsibilities</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Provide accurate contact information (name, phone, address).</li>
                        <li>Ensure someone is available to receive the delivery.</li>
                        <li>Do not misuse our services or place fraudulent orders.</li>
                        <li>Report any issues promptly through our contact channels.</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">9. Limitation of Liability</h2>
                    <p>ShubhamPattis shall not be liable for:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Delays caused by factors beyond our control (weather, traffic, etc.)</li>
                        <li>Issues arising from incorrect information provided by the customer</li>
                        <li>Allergic reactions if allergy information was not disclosed</li>
                        <li>Loss or damage to items after successful delivery</li>
                    </ul>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">10. Intellectual Property</h2>
                    <p>All content on this website including logos, images, and text are the property of ShubhamPattis and may not be copied or used without permission.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">11. Governing Law</h2>
                    <p>These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Bharatpur, Rajasthan.</p>

                    <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">12. Contact Information</h2>
                    <p>For any queries regarding these Terms & Conditions, please contact us:</p>
                    <p className="mt-2">
                        📞 Phone: <a href="tel:+919694034523" className="font-bold text-orange-600">+91 96940 34523</a><br/>
                        📧 Email: <a href="mailto:Shubhamashwani25@gmail.com" className="font-bold text-orange-600">Shubhamashwani25@gmail.com</a>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TermsConditions;
