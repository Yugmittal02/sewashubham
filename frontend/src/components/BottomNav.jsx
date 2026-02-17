import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaThLarge, FaUser, FaPhoneAlt } from 'react-icons/fa';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Hide on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Don't show on specific pages
    const hiddenPaths = ['/', '/login', '/signup', '/admin'];
    if (hiddenPaths.some(path => location.pathname === path || location.pathname.startsWith('/admin'))) {
        return null;
    }

    const navItems = [
        { path: '/menu', icon: FaHome, label: 'Home' },
        { path: '/categories', icon: FaThLarge, label: 'Categories' },
        { path: '/dashboard', icon: FaUser, label: 'Profile' },
        { path: '/contact', icon: FaPhoneAlt, label: 'Contact' },
    ];

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 bg-white z-50 md:hidden transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
            style={{
                boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                paddingBottom: 'safe-area-inset-bottom'
            }}
        >
            <div className="flex justify-around items-center p-3 pb-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className="flex flex-col items-center gap-1 w-16 relative"
                        >
                            <div
                                className={`p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-orange-50 -translate-y-2 shadow-sm' : ''}`}
                            >
                                <Icon
                                    size={20}
                                    className={`transition-colors duration-300 ${isActive ? 'text-orange-500' : 'text-gray-400'}`}
                                />
                                {item.badge > 0 && (
                                    <span className="absolute top-0 right-3 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span
                                className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-orange-600' : 'text-gray-400'}`}
                            >
                                {item.label}
                            </span>

                            {isActive && (
                                <span className="absolute -bottom-2 w-1 h-1 rounded-full bg-orange-500"></span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
