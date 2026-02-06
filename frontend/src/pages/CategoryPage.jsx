import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaShoppingCart, FaFire } from 'react-icons/fa';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCardNew from '../components/ProductCardNew';
import Footer from '../components/Footer';

// Category configurations with keywords to match products
const CATEGORY_CONFIG = {
    fastfood: {
        name: 'Fast Food',
        icon: '🍔',
        banner: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=300&fit=crop',
        subcategories: ['All', 'Patties', 'Burger', 'Pizza', 'Sandwich', 'Maggi', 'Momos'],
        keywords: ['fastfood', 'fast food', 'burger', 'pizza', 'patties', 'sandwich', 'momos', 'maggi', 'snacks', 'pattis']
    },
    cake: {
        name: 'Cakes',
        icon: '🎂',
        banner: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=300&fit=crop',
        subcategories: ['All', 'Birthday', 'Anniversary', 'Custom', 'Cupcakes', 'Pastries'],
        keywords: ['cake', 'cakes', 'pastry', 'pastries', 'cupcake', 'birthday', 'anniversary', 'chocolate cake', 'vanilla']
    },
    beverages: {
        name: 'Beverages',
        icon: '☕',
        banner: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=300&fit=crop',
        subcategories: ['All', 'Cold Coffee', 'Tea', 'Shakes', 'Mocktails', 'Juice'],
        keywords: ['beverages', 'beverage', 'coffee', 'tea', 'shake', 'juice', 'mocktail', 'drink', 'cold coffee', 'milkshake']
    },
    flower: {
        name: 'Flowers',
        icon: '🌸',
        banner: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&h=300&fit=crop',
        subcategories: ['All', 'Bouquets', 'Roses', 'Mixed', 'Premium'],
        keywords: ['flower', 'flowers', 'bouquet', 'rose', 'roses', 'gift', 'floral']
    },
    anniversary: {
        name: 'Anniversary',
        icon: '💐',
        banner: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=300&fit=crop',
        subcategories: ['All', 'Gifts', 'Combos', 'Special'],
        keywords: ['anniversary', 'gift', 'combo', 'special', 'celebration']
    }
};

const CategoryPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { cart = [] } = useCart();

    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSubcategory, setActiveSubcategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const category = CATEGORY_CONFIG[categoryId] || CATEGORY_CONFIG.fastfood;
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                // Fetch ALL products and filter client-side
                const { data } = await fetchProducts();
                setAllProducts(data || []);
            } catch (error) {
                console.error('Failed to load products:', error);
                setAllProducts([]);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
        setActiveSubcategory('All');
    }, [categoryId]);

    const filteredProducts = useMemo(() => {
        // First filter by category keywords
        let filtered = allProducts.filter(product => {
            const productCategory = (product.category || '').toLowerCase();
            const productName = (product.name || '').toLowerCase();
            const productDesc = (product.description || '').toLowerCase();

            // Check if product matches any keyword for this category
            return category.keywords.some(keyword =>
                productCategory.includes(keyword) ||
                productName.includes(keyword) ||
                productDesc.includes(keyword)
            );
        });

        // Filter by subcategory
        if (activeSubcategory !== 'All') {
            const subLower = activeSubcategory.toLowerCase();
            filtered = filtered.filter(p =>
                (p.subcategory || '').toLowerCase().includes(subLower) ||
                (p.name || '').toLowerCase().includes(subLower) ||
                (p.category || '').toLowerCase().includes(subLower)
            );
        }

        // Filter by search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                (p.name || '').toLowerCase().includes(query) ||
                (p.description || '').toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [allProducts, category.keywords, activeSubcategory, searchQuery]);

    return (
        <div className="min-h-screen pb-20" style={{ background: '#F5F0E8' }}>
            {/* Header */}
            <header className="sticky top-0 z-20 px-4 py-3"
                style={{ background: 'linear-gradient(180deg, #2D1F16 0%, #3D2B1F 100%)', borderBottom: '3px solid #C9A962' }}>
                <div className="flex items-center justify-between">
                    {/* Left: Back + Logo */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                            style={{ background: 'rgba(255,255,255,0.1)' }}
                        >
                            <FaArrowLeft size={16} color="#D4B896" />
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/menu')}>
                            <span className="text-xl">{category.icon}</span>
                            <h1 className="text-lg font-script" style={{ color: '#D4B896' }}>{category.name}</h1>
                        </div>
                    </div>

                    {/* Right: Search + Cart */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(255,255,255,0.1)' }}
                        >
                            <FaSearch size={16} color="#D4B896" />
                        </button>
                        <button
                            onClick={() => navigate('/cart')}
                            className="w-10 h-10 rounded-xl flex items-center justify-center relative"
                            style={{ background: 'rgba(255,255,255,0.1)' }}
                        >
                            <FaShoppingCart size={16} color="#D4B896" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                                    style={{ background: '#C9A962' }}>
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Bar (expandable) */}
                {showSearch && (
                    <div className="mt-3 animate-fade-in">
                        <input
                            type="text"
                            placeholder={`Search in ${category.name}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-sm"
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(212, 184, 150, 0.3)',
                                color: '#D4B896'
                            }}
                            autoFocus
                        />
                    </div>
                )}
            </header>

            {/* Promo Banner */}
            <div className="mx-4 mt-4">
                <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 16px rgba(74, 55, 40, 0.1)' }}>
                    <img
                        src={category.banner}
                        alt={`${category.name} Banner`}
                        className="w-full h-36 object-cover"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(45, 31, 22, 0.8) 0%, transparent 70%)' }}>
                        <div className="p-4 h-full flex flex-col justify-center">
                            <p className="text-xs uppercase tracking-wider" style={{ color: '#C9A962' }}>Special Offer</p>
                            <h2 className="text-xl font-bold text-white mt-1">{category.name}</h2>
                            <p className="text-sm text-white/80 mt-1">Freshly made daily</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subcategory Tabs */}
            <div className="mt-4 px-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                    {category.subcategories.map((sub) => (
                        <button
                            key={sub}
                            onClick={() => setActiveSubcategory(sub)}
                            className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
                            style={{
                                background: activeSubcategory === sub
                                    ? 'linear-gradient(135deg, #6B4423 0%, #5C4033 100%)'
                                    : 'white',
                                color: activeSubcategory === sub ? 'white' : '#6B4423',
                                border: activeSubcategory === sub ? 'none' : '2px solid #E8E3DB',
                                boxShadow: activeSubcategory === sub ? '0 4px 12px rgba(107, 68, 35, 0.3)' : 'none'
                            }}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="px-4 mt-4">
                {loading ? (
                    <div className="grid grid-cols-2 gap-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-2xl h-64 skeleton-shine" style={{ background: '#E8E3DB' }} />
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <>
                        {/* Results count */}
                        <div className="flex items-center gap-2 mb-3">
                            <FaFire size={14} color="#C9A962" />
                            <span className="text-sm font-medium" style={{ color: '#8B7355' }}>
                                {filteredProducts.length} items found
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {filteredProducts.map((product, idx) => (
                                <div key={product._id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                                    <ProductCardNew product={product} />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <span className="text-5xl mb-4 block">🔍</span>
                        <h3 className="text-lg font-bold" style={{ color: '#4A3728' }}>No items found</h3>
                        <p className="text-sm mt-2" style={{ color: '#8B7355' }}>
                            No products available in this category yet
                        </p>
                        <button
                            onClick={() => navigate('/menu')}
                            className="mt-4 px-6 py-2 rounded-xl text-white font-medium"
                            style={{ background: 'linear-gradient(135deg, #6B4423 0%, #5C4033 100%)' }}
                        >
                            Browse All Items
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default CategoryPage;
