import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPhoneAlt, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { getStoreSettings } from '../services/api';
import Footer from '../components/Footer';

const ContactUs = () => {
    const navigate = useNavigate();
    const [adminPhone, setAdminPhone] = useState('9876543210');

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const { data } = await getStoreSettings();
                if (data.adminPhone) {
                    setAdminPhone(data.adminPhone);
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            }
        };
        loadSettings();
    }, []);

    const contactMethods = [
        {
            icon: FaPhoneAlt,
            label: 'Call Us',
            value: adminPhone,
            href: `tel:+91${adminPhone}`,
            color: 'blue',
        },
        {
            icon: FaWhatsapp,
            label: 'WhatsApp',
            value: 'Chat with us',
            href: `https://wa.me/91${adminPhone}`,
            color: 'green',
        },
        {
            icon: FaEnvelope,
            label: 'Email',
            value: 'contact@shubhampattis.com',
            href: 'mailto:contact@shubhampattis.com',
            color: 'orange',
        },
    ];

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
                    <h1 className="text-lg font-bold text-gray-800">Contact Us</h1>
                </div>
            </header>

            {/* Content */}
            <div className="p-6 max-w-2xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">📞</span>
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 mb-2">Get in Touch</h2>
                    <p className="text-gray-500">We'd love to hear from you!</p>
                </div>

                {/* Contact Methods */}
                <div className="space-y-4 mb-8">
                    {contactMethods.map((method, idx) => (
                        <a
                            key={idx}
                            href={method.href}
                            target={method.icon === FaWhatsapp ? '_blank' : undefined}
                            rel={method.icon === FaWhatsapp ? 'noopener noreferrer' : undefined}
                            className={`block w-full p-5 rounded-2xl border-2 border-gray-100 bg-white hover:border-${method.color}-200 hover:bg-${method.color}-50/50 transition-all active:scale-[0.98]`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 bg-${method.color}-100 rounded-2xl flex items-center justify-center`}>
                                    <method.icon className={`text-${method.color}-600`} size={22} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800 text-base">{method.label}</p>
                                    <p className="text-sm text-gray-500">{method.value}</p>
                                </div>
                                <span className="text-gray-400">→</span>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Address & Hours */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FaMapMarkerAlt className="text-purple-600" size={18} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">Our Location</p>
                            <p className="text-sm text-gray-500 mt-1">
                                ShubhamPattis, Main Market Road,<br />
                                Near City Center, Delhi - 110001
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FaClock className="text-amber-600" size={18} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">Working Hours</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Monday - Sunday<br />
                                10:00 AM - 10:00 PM
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ContactUs;
