import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { fetchProducts } from '../services/api';
import Header from '../components/Header';
import MainCategoryCards from '../components/MainCategoryCards';
import AdsBanner from '../components/AdsBanner';
import ProductCardNew from '../components/ProductCardNew';
import SideCart from '../components/SideCart';
import Footer from '../components/Footer';
import { FaShoppingBag, FaStar, FaCrown, FaArrowRight, FaSearch } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

// Premium Skeleton loader
const ProductSkeleton = ({ index = 0 }) => (
    <div
        className="skeleton-card animate-fade-in"
        style={{ animationDelay: `${index * 0.1}s` }}
    >
        <div className="skeleton-image skeleton"></div>
        <div className="p-4">
            <div className="skeleton skeleton-text" style={{ width: '75%' }}></div>
            <div className="skeleton skeleton-text short" style={{ width: '100%', height: '12px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '40%', marginTop: '12px' }}></div>
            <div className="skeleton skeleton-button"></div>
        </div>
    </div>
);

// Featured Product Banner
const FeaturedBanner = ({ product, onAddSuccess }) => {
    if (!product) return null;

    return (
        <div className="mx-5 mb-6 p-5 rounded-2xl animate-fade-in-up"
            style={{
                background: 'linear-gradient(135deg, #FFF5EE 0%, #FFE8D6 100%)',
                border: '2px solid #C97B4B',
                boxShadow: '0 8px 32px rgba(252, 128, 25, 0.15)'
            }}>
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #C97B4B 0%, #E8956A 100%)' }}>
                    <FaCrown size={14} color="#FFFFFF" />
                </div>
                <span className="font-bold text-sm" style={{ color: '#C97B4B' }}>TODAY'S SPECIAL</span>
            </div>
            <div className="flex gap-4">
                <img
                    src={product.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop'}
                    alt={product.name}
                    className="w-24 h-24 rounded-xl object-cover"
                    style={{ border: '2px solid #C97B4B' }}
                />
                <div className="flex-1">
                    <h4 className="font-bold" style={{ color: '#1C1C1C' }}>{product.name}</h4>
                    <div className="flex items-center gap-1 my-1">
                        {[1, 2, 3, 4, 5].map(i => <FaStar key={i} size={10} color="#C97B4B" />)}
                        <span className="text-xs ml-1" style={{ color: '#7E7E7E' }}>(98 reviews)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-lg" style={{ color: '#C97B4B' }}>₹{product.price}</span>
                        <span className="text-sm line-through" style={{ color: '#A0A0A0' }}>₹{Math.round(product.price * 1.3)}</span>
                        <span className="px-2 py-0.5 rounded text-xs font-bold text-white"
                            style={{ background: '#22C55E' }}>30% OFF</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Winni/FNP Style Delivery Info Strip
const DeliveryStrip = () => (
    <div className="mx-4 mt-3 mb-2">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-100 shadow-sm">
                <span className="text-base">⚡</span>
                <div>
                    <p className="text-[11px] font-bold text-gray-800 leading-none">Express Delivery</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">Within 2 hours</p>
                </div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-100 shadow-sm">
                <span className="text-base">🎁</span>
                <div>
                    <p className="text-[11px] font-bold text-gray-800 leading-none">Free Delivery</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">Above ₹299</p>
                </div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-100 shadow-sm">
                <span className="text-base">💯</span>
                <div>
                    <p className="text-[11px] font-bold text-gray-800 leading-none">100% Fresh</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">Baked Daily</p>
                </div>
            </div>
        </div>
    </div>
);

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showSideCart, setShowSideCart] = useState(false);
    const { cart, total, getItemCount } = useCart();
    const searchDebounceRef = useRef(null);

    // Debounce search
    useEffect(() => {
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }
        searchDebounceRef.current = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 150);
        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
        };
    }, [searchQuery]);

    // Load products
    useEffect(() => {
        const cachedProducts = sessionStorage.getItem('cachedProducts');
        const cacheTime = sessionStorage.getItem('productsCacheTime');
        const now = Date.now();

        if (cachedProducts && cacheTime && (now - parseInt(cacheTime)) < 120000) {
            setProducts(JSON.parse(cachedProducts));
            setLoading(false);
        }

        loadProducts();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [activeCategory]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const { data } = await fetchProducts(activeCategory || '');
            setProducts(data);
            sessionStorage.setItem('cachedProducts', JSON.stringify(data));
            sessionStorage.setItem('productsCacheTime', Date.now().toString());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            p.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [products, debouncedSearch]);

    // Get featured product (first one)
    const featuredProduct = useMemo(() => {
        return products.length > 0 ? products[0] : null;
    }, [products]);

    const handleItemAdded = useCallback(() => {
        setShowSideCart(true);
    }, []);

    const handleCategoryChange = useCallback((categoryId) => {
        setActiveCategory(categoryId === activeCategory ? '' : categoryId);
    }, [activeCategory]);

    return (
        <div style={{ background: '#FDF8F4', minHeight: '100vh' }}>
            {/* Header */}
            <Header
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {/* Sticky Pill Search Bar */}
            <div className="sticky top-[60px] z-40 px-4 py-3 bg-[#FDF8F4]/95 backdrop-blur-sm transition-all duration-300">
                <div className="relative max-w-lg mx-auto">
                    <input
                        type="text"
                        placeholder="Search for cakes, pastries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-full bg-white border-none shadow-sm focus:ring-2 focus:ring-[#C97B4B] transition-shadow text-sm"
                        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    />
                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Delivery Info Strip - Winni Style */}
            <DeliveryStrip />

            {/* Main Category Cards */}
            <MainCategoryCards
                onCategorySelect={handleCategoryChange}
                activeCategory={activeCategory}
            />

            {/* Promotional Ads Banner */}
            <AdsBanner />

            {/* Bestsellers Section - Premium Design */}
            {!loading && filteredProducts.length > 0 && (
                <section className="bestsellers-section">
                    <div className="bestsellers-header">
                        <div className="bestsellers-title">
                            <span className="bestsellers-icon">🔥</span>
                            <h3>Bestsellers</h3>
                            <span className="bestsellers-icon">🔥</span>
                        </div>
                        <p className="bestsellers-subtitle">Our most loved treats</p>
                    </div>
                    <div className="bestsellers-grid">
                        {filteredProducts.slice(0, 6).map((product, index) => (
                            <div key={product._id} className="bestseller-card-wrapper animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <ProductCardNew
                                    product={{ ...product, isBestseller: true }}
                                    onAddSuccess={handleItemAdded}
                                    index={index}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="bestsellers-cta">
                        <button className="view-all-btn" onClick={() => { }}>
                            View All Bestsellers
                            <FaArrowRight size={12} />
                        </button>
                    </div>
                </section>
            )}

            {/* Products Section - Mobile First */}
            <section className="all-items-section">
                {/* Section Header */}
                <div className="all-items-header">
                    <div className="all-items-title-row">
                        <div className="all-items-title">
                            <span className="all-items-icon">🍽️</span>
                            <div>
                                <h3>{activeCategory ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Items` : 'All Items'}</h3>
                                <p className="all-items-count">
                                    {loading ? 'Loading...' : `${filteredProducts.length} items available`}
                                </p>
                            </div>
                        </div>
                        {!loading && (
                            <div className="all-items-badge">
                                <FaStar size={10} />
                                <span>Top Rated</span>
                            </div>
                        )}
                    </div>

                    {/* Filter Chips - Mobile Scrollable */}
                    <div className="filter-chips">
                        <button
                            className={`filter-chip ${activeCategory === 'cake' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('cake')}
                        >
                            🎂 Cakes
                        </button>
                        <button
                            className={`filter-chip ${activeCategory === 'fastfood' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('fastfood')}
                        >
                            🍔 Fast Food
                        </button>
                        <button
                            className={`filter-chip ${activeCategory === 'beverages' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('beverages')}
                        >
                            ☕ Drinks
                        </button>
                        <button
                            className={`filter-chip ${activeCategory === 'flower' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('flower')}
                        >
                            🌸 Flowers
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 px-2 md:px-0">
                    {loading ? (
                        <>
                            <ProductSkeleton index={0} />
                            <ProductSkeleton index={1} />
                            <ProductSkeleton index={2} />
                            <ProductSkeleton index={3} />
                            <ProductSkeleton index={4} />
                            <ProductSkeleton index={5} />
                        </>
                    ) : filteredProducts.length === 0 ? (
                        <div className="col-span-2 md:col-span-full flex flex-col items-center justify-center py-10 text-center">
                            <p className="text-4xl mb-4">🍰</p>
                            <p className="text-lg font-bold text-gray-800">No products found</p>
                            <p className="text-gray-500 mb-4">Try a different category or search term</p>
                            <button
                                onClick={() => setActiveCategory('')}
                                className="px-6 py-2 bg-orange-500 text-white rounded-full font-bold shadow-md active:scale-95 transition-transform"
                            >
                                View All Items
                            </button>
                        </div>
                    ) : (
                        filteredProducts.map((product, index) => (
                            <ProductCardNew
                                key={product._id}
                                product={product}
                                onAddSuccess={handleItemAdded}
                                index={index}
                                featured={index === 0}
                            />
                        ))
                    )}
                </div>
            </section>

            {/* Floating Cart Button */}
            {cart.length > 0 && (
                <div
                    onClick={() => setShowSideCart(true)}
                    className="floating-cart cursor-pointer"
                >
                    <div className="cart-info">
                        <div className="cart-icon-wrap">
                            <FaShoppingBag size={24} />
                            <span className="cart-badge">{getItemCount()}</span>
                        </div>
                        <div className="cart-text">
                            <p>Your Cart</p>
                            <h4>₹{(Number(total) || 0).toFixed(0)}</h4>
                        </div>
                    </div>
                    <button className="view-cart-btn">
                        View Cart →
                    </button>
                </div>
            )}

            {/* Side Cart */}
            <SideCart
                isOpen={showSideCart}
                onClose={() => setShowSideCart(false)}
            />

            {/* Footer */}
            <Footer />

            {/* Bottom Nav Spacer */}
            <div className="h-20 md:h-0"></div>
        </div>
    );
};

export default Home;
