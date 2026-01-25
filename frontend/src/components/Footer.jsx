import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = memo(() => {
    const currentYear = useMemo(() => new Date().getFullYear(), []);
    
    return (
        <footer className="w-full bg-white border-t border-gray-100 mt-auto">
            {/* Main Footer Content */}
            <div className="px-4 py-6">
                {/* Brand */}
                <div className="text-center mb-4">
                    <h3 className="text-lg font-black text-gray-800">
                        Shubham<span className="text-orange-600">Pattis</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                        Delicious food, delivered fresh
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex justify-center gap-6 mb-4">
                    <Link 
                        to="/terms" 
                        className="text-xs text-gray-500 hover:text-orange-600 transition-colors font-medium"
                    >
                        Terms & Conditions
                    </Link>
                    <Link 
                        to="/privacy" 
                        className="text-xs text-gray-500 hover:text-orange-600 transition-colors font-medium"
                    >
                        Privacy Policy
                    </Link>
                    <Link 
                        to="/contact" 
                        className="text-xs text-gray-500 hover:text-orange-600 transition-colors font-medium"
                    >
                        Contact Us
                    </Link>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-3 mb-4">
                    <a 
                        href="https://wa.me/919694034523" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-100 transition-colors"
                    >
                        <FaWhatsapp size={18} />
                    </a>
                    <a 
                        href="https://www.instagram.com/shubham_patties_bharatpur/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center hover:bg-pink-100 transition-colors"
                    >
                        <FaInstagram size={18} />
                    </a>
                    <a 
                        href="tel:+919694034523"
                        className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors"
                    >
                        <FaPhoneAlt size={16} />
                    </a>
                    <a 
                        href="mailto:Shubhamashwani25@gmail.com"
                        className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center hover:bg-orange-100 transition-colors"
                    >
                        <FaEnvelope size={16} />
                    </a>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-gray-50 px-4 py-4 text-center border-t border-gray-100">
                <p className="text-gray-400 text-xs font-medium tracking-wide">
                    Powered by <span className="text-gray-500 font-bold">ElectronWays</span>
                </p>
                <p className="text-[10px] text-gray-300 mt-1">
                    © {currentYear} ShubhamPattis. All rights reserved.
                </p>
            </div>
        </footer>
    );
});

Footer.displayName = 'Footer';

export default Footer;

