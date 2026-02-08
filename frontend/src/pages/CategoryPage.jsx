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
        subcategories: ['All', 'Birthday', 'Anniversary', 'First Birthday', 'Photo Cake', 'Custom', 'Cupcakes'],
        keywords: ['cake', 'cakes', 'pastry', 'pastries', 'cupcake', 'birthday', 'anniversary', 'chocolate cake', 'vanilla', 'photo cake']
    },
    beverages: {
        name: 'Beverages',
        icon: '☕',
        banner: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=300&fit=crop',
        subcategories: ['All', 'Cold Coffee', 'Tea', 'Shakes', 'Mocktails', 'Juice'],
        keywords: ['beverages', 'beverage', 'coffee', 'tea', 'shake', 'juice', 'mocktail', 'drink', 'cold coffee', 'milkshake']
    },
    bakery: {
        name: 'Bakery',
        icon: '🥐',
        banner: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=300&fit=crop',
        subcategories: ['All', 'Bread', 'Cookies', 'Croissants', 'Pastries', 'Biscuits'],
        keywords: ['bakery', 'bread', 'cookies', 'croissant', 'biscuit', 'pastry', 'baked']
    },
    flowers: {
        name: 'Flowers',
        icon: '💐',
        banner: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&h=300&fit=crop',
        subcategories: ['All', 'Bouquets', 'Roses', 'Mixed', 'Premium', 'Gift Combos'],
        keywords: ['flower', 'flowers', 'bouquet', 'rose', 'roses', 'gift', 'floral', 'arrangement']
    },
    patties: {
        name: 'Patties',
        icon: '🥟',
        banner: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=300&fit=crop',
        subcategories: ['All', 'Veg Patties', 'Paneer Patties', 'Aloo Patties', 'Special'],
        keywords: ['patties', 'pattis', 'patty', 'patti', 'samosa', 'snack']
    },
    pizza: {
        name: 'Pizza',
        icon: '🍕',
        banner: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=300&fit=crop',
        subcategories: ['All', 'Veg Pizza', 'Cheese Pizza', 'Special', 'Mini Pizza'],
        keywords: ['pizza', 'pizzas', 'cheese pizza', 'veg pizza']
    },
    anniversary: {
        name: 'Anniversary',
        icon: '💑',
        banner: 'https://images.unsplash.com/photo-1530103862676-de3c9da59af7?w=800&h=300&fit=crop',
        subcategories: ['All', 'Cakes', 'Flowers', 'Gift Combos', 'Chocolates', 'Decoration'],
        keywords: ['anniversary', 'wedding', 'couple', 'love', 'romantic', 'heart', 'rose', 'gift']
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
        <div className="min-h-screen pb-20" style={{ background: '#F8F3EE' }}>
            {/* Header */}
            <header className="sticky top-0 z-20 px-4 py-3"
                style={{ background: 'linear-gradient(180deg, #FC8019 0%, #FF9A3C 100%)', borderBottom: '3px solid #FC8019' }}>
                <div className="flex items-center justify-between">
                    {/* Left: Back + Logo */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                            style={{ background: 'rgba(255,255,255,0.2)' }}
                        >
                            <FaArrowLeft size={16} color="#FFFFFF" />
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/menu')}>
                            <span className="text-xl">{category.icon}</span>
                            <h1 className="text-lg font-bold text-white">{category.name}</h1>
                        </div>
                    </div>

                    {/* Right: Search + Cart */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(255,255,255,0.2)' }}
                        >
                            <FaSearch size={16} color="#FFFFFF" />
                        </button>
                        <button
                            onClick={() => navigate('/cart')}
                            className="w-10 h-10 rounded-xl flex items-center justify-center relative"
                            style={{ background: 'rgba(255,255,255,0.2)' }}
                        >
                            <FaShoppingCart size={16} color="#FFFFFF" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                                    style={{ background: '#E57312' }}>
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
                                background: 'rgba(255,255,255,0.9)',
                                border: '2px solid rgba(255, 255, 255, 0.5)',
                                color: '#1C1C1C'
                            }}
                            autoFocus
                        />
                    </div>
                )}
            </header>

            {/* Promo Banner */}
            <div className="mx-4 mt-4">
                <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 16px rgba(252, 128, 25, 0.2)' }}>
                    <img
                        src={category.banner}
                        alt={`${category.name} Banner`}
                        className="w-full h-36 object-cover"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(252, 128, 25, 0.9) 0%, transparent 70%)' }}>
                        <div className="p-4 h-full flex flex-col justify-center">
                            <p className="text-xs uppercase tracking-wider text-white/80">Special Offer</p>
                            <h2 className="text-xl font-bold text-white mt-1">{category.name}</h2>
                            <p className="text-sm text-white/80 mt-1">Freshly made daily</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subcategory Tabs */}
            <div className="mt-4 px-4 overflow-x-hidden">
                <div className="flex overflow-x-auto pb-4 gap-3 hide-scrollbar snap-x px-1" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {category.subcategories.map((sub) => (
                        <button
                            key={sub}
                            onClick={() => setActiveSubcategory(sub)}
                            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap snap-start border-none outline-none"
                            style={{
                                background: activeSubcategory === sub
                                    ? 'linear-gradient(135deg, #FC8019 0%, #FF9A3C 100%)'
                                    : '#FFFFFF',
                                color: activeSubcategory === sub ? 'white' : '#5C3A21',
                                border: activeSubcategory === sub ? 'none' : '1px solid #E8DEC8',
                                boxShadow: activeSubcategory === sub
                                    ? '0 4px 12px rgba(252, 128, 25, 0.3)'
                                    : '0 2px 6px rgba(0,0,0,0.03)'
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
                            <FaFire size={14} color="#FC8019" />
                            <span className="text-sm font-medium" style={{ color: '#7E7E7E' }}>
                                {filteredProducts.length} items found
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
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
                        <h3 className="text-lg font-bold" style={{ color: '#1C1C1C' }}>No items found</h3>
                        <p className="text-sm mt-2" style={{ color: '#7E7E7E' }}>
                            No products available in this category yet
                        </p>
                        <button
                            onClick={() => navigate('/menu')}
                            className="mt-4 px-6 py-2 rounded-xl text-white font-medium"
                            style={{ background: 'linear-gradient(135deg, #FC8019 0%, #FF9A3C 100%)' }}
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
