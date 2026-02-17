import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { fetchOffers } from '../services/api';

const AdsBanner = () => {
    const navigate = useNavigate();
    const [currentAd, setCurrentAd] = useState(0);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    const gradients = [
        'linear-gradient(135deg, #FC8019 0%, #FF9A3C 100%)',
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',
    ];

    const icons = ['🎂', '🥟', '💍', '🎁', '🍕', '🍪'];

    // Default fallback ads - always show these if API fails or returns empty
    const defaultAds = [
        {
            id: 'default-1',
            title: 'Fresh Cakes Daily',
            subtitle: 'Made with love & premium ingredients',
            description: 'Order Now & Get 10% OFF',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop',
            bgGradient: gradients[0],
            link: '/category/cake',
            badge: '🔥 HOT',
            icon: '🎂'
        },
        {
            id: 'default-2',
            title: 'Birthday Specials',
            subtitle: 'Make celebrations memorable',
            description: 'Custom Cakes Available',
            image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&h=400&fit=crop',
            bgGradient: gradients[1],
            link: '/category/cake',
            badge: '🎉 SPECIAL',
            icon: '🎁'
        },
        {
            id: 'default-3',
            title: 'Crispy Patties',
            subtitle: 'Hot & Fresh from the oven',
            description: 'Starting at just ₹20',
            image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=400&fit=crop',
            bgGradient: gradients[4],
            link: '/category/fastfood',
            badge: '⚡ QUICK',
            icon: '🥟'
        },
        {
            id: 'default-4',
            title: 'Beautiful Flowers',
            subtitle: 'Perfect for every occasion',
            description: 'Fresh Bouquets Daily',
            image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&h=400&fit=crop',
            bgGradient: gradients[2],
            link: '/category/flowers',
            badge: '💐 NEW',
            icon: '💐'
        }
    ];

    useEffect(() => {
        const loadOffers = async () => {
            try {
                const { data } = await fetchOffers();
                // Transform offers to ads format
                if (data && data.length > 0) {
                    const formattedAds = data.map((offer, index) => ({
                        id: offer._id,
                        title: offer.title,
                        subtitle: offer.description || 'Special Deal For You',
                        description: `Use Code: ${offer.code}`,
                        image: offer.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop',
                        bgGradient: gradients[index % gradients.length],
                        link: '/category/all',
                        badge: offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`,
                        icon: icons[index % icons.length]
                    }));
                    setAds(formattedAds);
                } else {
                    // Use default ads if no offers from API
                    setAds(defaultAds);
                }
            } catch (error) {
                console.error("Failed to fetch ads:", error);
                // Use default ads on error
                setAds(defaultAds);
            } finally {
                setLoading(false);
            }
        };

        loadOffers();
    }, []);

    // Auto-rotate ads every 5 seconds
    useEffect(() => {
        if (ads.length === 0) return;
        const timer = setInterval(() => {
            setCurrentAd((prev) => (prev + 1) % ads.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [ads.length]);

    const handleAdClick = (link) => {
        navigate(link);
    };

    const goToSlide = (index) => {
        setCurrentAd(index);
    };

    const nextSlide = () => {
        if (ads.length === 0) return;
        setCurrentAd((prev) => (prev + 1) % ads.length);
    };

    const prevSlide = () => {
        if (ads.length === 0) return;
        setCurrentAd((prev) => (prev - 1 + ads.length) % ads.length);
    };

    if (loading) return null; // Or a skeleton

    return (
        <section className="ads-banner-section max-w-5xl mx-auto my-4 px-3">
            {/* Section Header - Compact */}
            <div className="ads-banner-header text-center mb-3">
                <div className="ads-banner-title flex items-center justify-center gap-2 mb-1">
                    <span className="fire-icon text-lg">🔥</span>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 m-0">Special Offers</h2>
                    <span className="fire-icon text-lg">🔥</span>
                </div>
                <p className="ads-banner-subtitle text-xs md:text-sm text-gray-500 m-0">Don't miss out on these amazing deals!</p>
            </div>

            {/* Main Carousel - Compact */}
            <div className="ads-carousel-wrapper relative rounded-xl overflow-hidden shadow-md bg-white aspect-[21/9] md:aspect-[24/8]">
                {/* Navigation Arrows */}
                {ads.length > 1 && (
                    <>
                        <button className="carousel-arrow prev absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm text-gray-700 transition-all" onClick={prevSlide}>
                            ‹
                        </button>
                        <button className="carousel-arrow next absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm text-gray-700 transition-all" onClick={nextSlide}>
                            ›
                        </button>
                    </>
                )}

                {/* Carousel Container */}
                <div className="ads-carousel h-full w-full">
                    <div
                        className="ads-carousel-track h-full flex transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${currentAd * 100}%)` }}
                    >
                        {ads.map((ad) => (
                            <div
                                key={ad.id}
                                className="ad-slide min-w-full h-full relative flex cursor-pointer"
                                onClick={() => handleAdClick(ad.link)}
                            >
                                <div
                                    className="ad-slide-content w-full h-full flex"
                                    style={{ background: ad.bgGradient }}
                                >
                                    {/* Left Content */}
                                    <div className="ad-slide-text flex-1 p-4 md:p-8 flex flex-col justify-center items-start z-10">
                                        <div className="ad-slide-badge bg-white/90 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full mb-2 shadow-sm text-orange-600 uppercase tracking-wider">{ad.badge}</div>
                                        <h3 className="ad-slide-title text-shadow text-white font-bold text-lg md:text-2xl mb-1 leading-tight">{ad.title}</h3>
                                        <p className="ad-slide-subtitle text-white/90 text-xs md:text-sm mb-1">{ad.subtitle}</p>
                                        <p className="ad-slide-description bg-white/20 inline-block px-2 py-0.5 rounded text-[10px] md:text-xs text-white backdrop-blur-sm mt-1">{ad.description}</p>
                                        <button className="ad-slide-cta mt-3 bg-white text-orange-600 px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold shadow-lg flex items-center gap-1 hover:scale-105 transition-transform">
                                            Shop Now <FaArrowRight size={10} />
                                        </button>
                                    </div>

                                    {/* Right Image */}
                                    <div className="ad-slide-image flex-1 relative overflow-hidden">
                                        <img src={ad.image} alt={ad.title} className="object-cover w-full h-full absolute inset-0 mask-image-gradient" />
                                        <div className="ad-slide-image-overlay absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots Navigation */}
                {ads.length > 1 && (
                    <div className="carousel-dots absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                        {ads.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                                className={`carousel-dot w-1.5 h-1.5 rounded-full transition-all ${currentAd === index ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Action Buttons - Compact */}
            <div className="ads-action-buttons grid grid-cols-4 gap-2 mt-4 max-w-4xl mx-auto">
                <button
                    className="action-btn flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all"
                    onClick={() => navigate('/category/cake')}
                >
                    <span className="action-icon text-lg md:text-xl">🎂</span>
                    <span className="text-[10px] md:text-xs font-medium text-gray-700">Cakes</span>
                </button>
                <button
                    className="action-btn flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all"
                    onClick={() => navigate('/category/fastfood')}
                >
                    <span className="action-icon text-lg md:text-xl">🍔</span>
                    <span className="text-[10px] md:text-xs font-medium text-gray-700">Fast Food</span>
                </button>
                <button
                    className="action-btn highlight flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-orange-50 border border-orange-100 shadow-sm hover:shadow-md hover:border-orange-300 transition-all relative overflow-hidden"
                    onClick={() => navigate('/category/cake?sub=birthday-cake')}
                >
                    <span className="action-icon text-lg md:text-xl relative z-10">🎁</span>
                    <span className="text-[10px] md:text-xs font-bold text-orange-700 relative z-10">Birthday</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-transparent z-0"></div>
                </button>
                <button
                    className="action-btn flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all"
                    onClick={() => navigate('/category/beverages')}
                >
                    <span className="action-icon text-lg md:text-xl">☕</span>
                    <span className="text-[10px] md:text-xs font-medium text-gray-700">Drinks</span>
                </button>
            </div>
        </section>
    );
};

export default AdsBanner;
