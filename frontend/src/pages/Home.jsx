import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { fetchProducts, fetchOffers } from '../services/api';
import ProductCard from '../components/ProductCard';
import SideCart from '../components/SideCart';
import Footer from '../components/Footer';
import { FaSearch, FaShoppingBag, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

// Skeleton loader component for performance
const ProductSkeleton = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
        <div className="p-4 flex gap-4">
            <div className="w-28 h-28 bg-gray-200 rounded-2xl flex-shrink-0"></div>
            <div className="flex-1 py-1">
                <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3 mb-3"></div>
                <div className="flex gap-1">
                    <div className="h-6 bg-orange-100 rounded-lg w-12"></div>
                    <div className="h-6 bg-orange-100 rounded-lg w-14"></div>
                </div>
                <div className="h-8 bg-gray-100 rounded-lg w-20 mt-3"></div>
            </div>
        </div>
        <div className="h-14 bg-orange-50 border-t border-orange-100"></div>
    </div>
);

const Home = () => {
    const [products, setProducts] = useState([]);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [showSideCart, setShowSideCart] = useState(false);
    const { customer } = useAuth();
    const { cart, total, getItemCount } = useCart();
    const navigate = useNavigate();
    const searchDebounceRef = useRef(null);

    // Debounce search query for better performance
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

    // Cache products in sessionStorage for faster reload
    useEffect(() => {
        const cachedProducts = sessionStorage.getItem('cachedProducts');
        const cacheTime = sessionStorage.getItem('productsCacheTime');
        const now = Date.now();
        
        // Use cache if less than 2 minutes old
        if (cachedProducts && cacheTime && (now - parseInt(cacheTime)) < 120000) {
            setProducts(JSON.parse(cachedProducts));
            setLoading(false);
        }
        
        loadOffers();
        loadProducts();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [category]);

    const loadOffers = async () => {
        try {
            const offersRes = await fetchOffers();
            setOffers(offersRes.data);
        } catch (error) {
            console.error("Error loading offers:", error);
        }
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            const { data } = await fetchProducts(category === 'All' ? '' : category);
            setProducts(data);
            // Cache products
            sessionStorage.setItem('cachedProducts', JSON.stringify(data));
            sessionStorage.setItem('productsCacheTime', Date.now().toString());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Memoized filtered products for performance
    const filteredProducts = useMemo(() => {
        return products.filter(p => 
            p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            p.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [products, debouncedSearch]);

    // Callback for when item is added to cart
    const handleItemAdded = useCallback(() => {
        setShowSideCart(true);
    }, []);

    const categories = [
        { name: 'All', icon: '🍽️' },
        { name: 'Pizza', icon: '🍕' },
        { name: 'Burger', icon: '🍔' },
        { name: 'Sandwich', icon: '🥪' },
        { name: 'Pasta', icon: '🍝' },
        { name: 'Drinks', icon: '🥤' },
        { name: 'Dessert', icon: '🧁' },
        { name: 'Bakery', icon: '🥐' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 pb-36">
            
            {/* Compact Mobile Header */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-orange-100/50 shadow-sm safe-area-top">
                <div className="px-4 py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex-1">
                            <h1 className="text-xl font-black text-gray-800 tracking-tight">
                                Shubham<span className="text-orange-600">Pattis</span>
                            </h1>
                            <p className="text-[11px] font-medium text-gray-500 -mt-0.5">
                                Hi, <span className="text-orange-600 font-semibold">{customer?.name || 'Guest'}</span> 👋
                            </p>
                        </div>
                        <button 
                            onClick={() => setShowSearch(!showSearch)}
                            className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center text-orange-600 active:scale-95 transition-transform shadow-sm"
                        >
                            {showSearch ? <FaTimes size={18} /> : <FaSearch size={18} />}
                        </button>
                        {customer && (
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="w-12 h-12 ml-2 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center text-orange-600 active:scale-95 transition-transform shadow-sm"
                            >
                                <span className="text-xl">👤</span>
                            </button>
                        )}
                    </div>
                    
                    {/* Expandable Search */}
                    {showSearch && (
                        <div className="mt-3 animate-fade-in">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for food..." 
                                    autoFocus
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-base font-medium placeholder:text-gray-400 focus:outline-none focus:border-orange-300 transition-all" 
                                />
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Offers Carousel - Blinkit Style with Celebrations */}
            {offers.length > 0 && (
                <div className="px-4 mt-4">
                    <h3 className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
                        <span className="text-xl">🎉</span> Special Offers
                    </h3>
                    <div className="flex overflow-x-auto gap-3 hide-scrollbar pb-2 snap-x snap-mandatory -mx-2 px-2">
                        {offers.map((offer, idx) => (
                            <div 
                                key={offer._id} 
                                className={`relative flex-shrink-0 w-[85vw] max-w-[320px] rounded-3xl p-5 text-white shadow-xl snap-center active:scale-[0.98] transition-transform overflow-hidden ${
                                    idx % 3 === 0 
                                        ? 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500' 
                                        : idx % 3 === 1
                                        ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500'
                                        : 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500'
                                }`}
                            >
                                {/* Celebration Decorations */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    <div className="absolute top-3 right-8 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                                    <div className="absolute top-6 right-4 w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
                                    <div className="absolute top-4 right-16 w-1 h-1 bg-pink-200 rounded-full"></div>
                                    <div className="absolute bottom-8 left-6 w-2 h-2 bg-yellow-200 rounded-full opacity-70"></div>
                                    <div className="absolute bottom-12 right-12 w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
                                    <span className="absolute top-2 right-3 text-lg opacity-80">✨</span>
                                    <span className="absolute bottom-4 left-3 text-sm opacity-60">⭐</span>
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full"></div>
                                </div>
                                
                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">🎊</span>
                                        <p className="text-xs font-bold uppercase tracking-wider opacity-90">{offer.title}</p>
                                    </div>
                                    
                                    <p className="text-5xl font-black drop-shadow-lg">
                                        {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                                        <span className="text-2xl ml-1">OFF</span>
                                    </p>
                                    
                                    <p className="text-sm mt-2 opacity-90 line-clamp-2">{offer.description}</p>
                                    
                                    <div className="mt-4 bg-white rounded-2xl px-4 py-3 inline-flex items-center gap-3 shadow-lg">
                                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase">
                                            Code
                                        </div>
                                        <span className="font-mono font-black text-gray-800 text-lg tracking-widest">{offer.code}</span>
                                        <span className="text-lg">🎁</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Categories - Large Touch Pills */}
            <div className="px-4 mt-6">
                <h3 className="font-bold text-gray-800 text-base mb-3">Browse Menu</h3>
                <div className="flex overflow-x-auto gap-2 hide-scrollbar pb-2 -mx-2 px-2">
                    {categories.map(cat => (
                        <button 
                            key={cat.name} 
                            onClick={() => setCategory(cat.name)}
                            className={`flex-shrink-0 h-14 px-5 rounded-2xl flex items-center gap-2.5 font-semibold text-base transition-all active:scale-95 ${
                                category === cat.name 
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-300/50' 
                                    : 'bg-white text-gray-700 border-2 border-gray-100 active:bg-gray-50'
                            }`}
                        >
                            <span className="text-2xl">{cat.icon}</span>
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Products */}
            <div className="px-4 mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                        {category === 'All' ? 'All Items' : category}
                        <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full font-bold">
                            {filteredProducts.length}
                        </span>
                    </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {loading ? (
                        // Skeleton loading for better perceived performance
                        <>
                            <ProductSkeleton />
                            <ProductSkeleton />
                            <ProductSkeleton />
                        </>
                    ) : filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center py-20">
                            <p className="text-6xl mb-4">🍽️</p>
                            <p className="text-gray-400 font-medium text-lg">No items found</p>
                            <p className="text-gray-300 text-sm mt-1">Try a different category</p>
                        </div>
                    ) : (
                        filteredProducts.map(p => (
                            <ProductCard 
                                key={p._id} 
                                product={p} 
                                onAddSuccess={handleItemAdded}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Floating Cart Button - Opens Side Cart */}
            {cart.length > 0 && (
                <div 
                    onClick={() => setShowSideCart(true)} 
                    className="fixed bottom-6 left-4 right-4 z-50 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white p-4 rounded-3xl shadow-2xl shadow-orange-500/40 flex justify-between items-center active:scale-[0.98] transition-transform animate-bounce-in cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center border border-white/30">
                                <FaShoppingBag size={24} />
                            </div>
                            <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-sm font-black w-7 h-7 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                {getItemCount()}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-orange-100 uppercase tracking-wide">Your Order</p>
                            <p className="text-2xl font-black">₹{total.toFixed(0)}</p>
                        </div>
                    </div>
                    <div className="bg-white text-orange-600 h-14 px-6 rounded-2xl flex items-center justify-center gap-2 font-bold text-base shadow-lg">
                        View Cart →
                    </div>
                </div>
            )}

            {/* Side Cart Panel */}
            <SideCart 
                isOpen={showSideCart} 
                onClose={() => setShowSideCart(false)} 
            />

            {/* Custom CSS */}
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .safe-area-top { padding-top: env(safe-area-inset-top); }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes bounce-in {
                    0% { transform: translateY(100px); opacity: 0; }
                    60% { transform: translateY(-10px); }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .animate-bounce-in { animation: bounce-in 0.4s ease-out; }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
            `}</style>
            
            <Footer />
        </div>
    );
};

export default Home;
