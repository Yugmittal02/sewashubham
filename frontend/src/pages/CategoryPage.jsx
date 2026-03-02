import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaShoppingCart, FaFire } from 'react-icons/fa';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCardNew from '../components/ProductCardNew';
import Footer from '../components/Footer';

// Category configurations with unique color themes and authentic images
const CATEGORY_CONFIG = {
    'chocolate-cake': {
        name: 'Chocolate Cakes',
        icon: '🍫',
        banner: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=400&fit=crop&q=80',
        subcategories: ['All', 'Truffle', 'Fudge', 'Dark Chocolate', 'Brownie', 'Lava'],
        keywords: ['chocolate', 'truffle', 'fudge', 'brownie', 'lava', 'dark chocolate', 'cocoa'],
        theme: { primary: '#5C3A21', light: '#8B5E3C', glow: 'rgba(92, 58, 33, 0.25)', bg: '#FDF8F4' }
    },
    'fruit-cake': {
        name: 'Fruit Cakes',
        icon: '🍓',
        banner: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=400&fit=crop&q=80',
        subcategories: ['All', 'Strawberry', 'Mango', 'Pineapple', 'Blueberry', 'Mixed Fruit'],
        keywords: ['fruit', 'strawberry', 'mango', 'pineapple', 'blueberry', 'berry', 'fresh fruit'],
        theme: { primary: '#BE185D', light: '#EC4899', glow: 'rgba(190, 24, 93, 0.25)', bg: '#FFF1F7' }
    },
    'designer-cake': {
        name: 'Designer Cakes',
        icon: '🎨',
        banner: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&h=400&fit=crop&q=80',
        subcategories: ['All', 'Rainbow', 'Theme', 'Fondant', 'Tier Cake', 'Custom'],
        keywords: ['designer', 'rainbow', 'theme', 'fondant', 'tier', 'custom', 'sprinkle', 'funfetti'],
        theme: { primary: '#7C3AED', light: '#A78BFA', glow: 'rgba(124, 58, 237, 0.25)', bg: '#F5F3FF' }
    },
    'premium-cake': {
        name: 'Premium Cakes',
        icon: '👑',
        banner: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=400&fit=crop&q=80',
        subcategories: ['All', 'Red Velvet', 'Tiramisu', 'Opera', 'Mousse', 'Black Forest'],
        keywords: ['premium', 'red velvet', 'tiramisu', 'opera', 'mousse', 'black forest', 'white forest', 'velvet'],
        theme: { primary: '#B45309', light: '#D97706', glow: 'rgba(180, 83, 9, 0.25)', bg: '#FFFBEB' }
    },
    cheesecake: {
        name: 'Cheesecakes',
        icon: '🧀',
        banner: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&h=400&fit=crop&q=80',
        subcategories: ['All', 'Baked', 'Unbaked', 'Blueberry', 'Mango', 'Oreo'],
        keywords: ['cheesecake', 'cheese cake', 'baked cheesecake', 'cream cheese'],
        theme: { primary: '#EA580C', light: '#F97316', glow: 'rgba(234, 88, 12, 0.25)', bg: '#FFF7ED' }
    },
    'kids-cake': {
        name: 'Kids Special',
        icon: '🎈',
        banner: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&h=400&fit=crop&q=80',
        subcategories: ['All', 'Cartoon', 'Unicorn', 'Superhero', 'Princess', 'Animal'],
        keywords: ['kids', 'cartoon', 'unicorn', 'superhero', 'princess', 'animal', 'fun', 'children'],
        theme: { primary: '#DC2626', light: '#EF4444', glow: 'rgba(220, 38, 38, 0.25)', bg: '#FEF2F2' }
    },
    // Legacy - keep 'cake' as default catch-all
    cake: {
        name: 'Cakes',
        icon: '🎂',
        banner: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&h=400&fit=crop&q=80',
        subcategories: ['All', 'Birthday', 'Wedding', 'Anniversary', 'Photo Cake', 'Eggless', 'Theme Cake', 'Cupcakes', 'Pastries'],
        keywords: ['cake', 'cakes', 'pastry', 'pastries', 'cupcake', 'birthday', 'anniversary', 'chocolate', 'vanilla', 'photo cake', 'wedding'],
        theme: { primary: '#BE185D', light: '#EC4899', glow: 'rgba(190, 24, 93, 0.25)', bg: '#FFF1F7' }
    }
};

const CategoryPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { cart = [] } = useCart();

    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSubcategory, setActiveSubcategory] = useState(() => {
        const subParam = searchParams.get('sub');
        return subParam || 'All';
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const category = CATEGORY_CONFIG[categoryId] || CATEGORY_CONFIG.fastfood;
    const theme = category.theme || { primary: '#C97B4B', light: '#E8956A', glow: 'rgba(201, 123, 75, 0.25)', bg: '#FDF8F4' };
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
        <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
            {/* Header - Rounded, Glass Effect */}
            <header className="sticky top-0 z-20 px-4 py-3"
                style={{
                    background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.light} 100%)`,
                    borderBottomLeftRadius: '24px',
                    borderBottomRightRadius: '24px',
                    boxShadow: `0 8px 32px ${theme.glow}`
                }}>
                <div className="flex items-center justify-between">
                    {/* Left: Back + Category Name */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform"
                            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
                        >
                            <FaArrowLeft size={16} color="#FFFFFF" />
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/menu')}>
                            <span className="text-2xl">{category.icon}</span>
                            <h1 className="text-lg font-bold text-white">{category.name}</h1>
                        </div>
                    </div>

                    {/* Right: Search + Cart */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
                        >
                            <FaSearch size={14} color="#FFFFFF" />
                        </button>
                        <button
                            onClick={() => navigate('/cart')}
                            className="w-10 h-10 rounded-full flex items-center justify-center relative"
                            style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}
                        >
                            <FaShoppingCart size={14} color="#FFFFFF" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center font-bold bg-red-500 shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Bar (expandable) - Pill Shape */}
                {showSearch && (
                    <div className="mt-3 animate-fade-in">
                        <input
                            type="text"
                            placeholder={`Search in ${category.name}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-5 py-3 rounded-full text-sm focus:outline-none"
                            style={{
                                background: 'rgba(255,255,255,0.95)',
                                border: 'none',
                                color: '#1C1C1C',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                            }}
                            autoFocus
                        />
                    </div>
                )}
            </header>

            {/* Hero Banner - Rounded */}
            <div className="mx-4 mt-4">
                <div className="relative rounded-3xl overflow-hidden" style={{ boxShadow: `0 8px 24px ${theme.glow}` }}>
                    <img
                        src={category.banner}
                        alt={`${category.name} Banner`}
                        className="w-full h-40 md:h-48 object-cover"
                    />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${theme.primary}dd 0%, ${theme.light}66 60%, transparent 100%)` }}>
                        <div className="p-5 h-full flex flex-col justify-end">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-semibold">Explore</p>
                            <h2 className="text-2xl font-bold text-white mt-1">{category.name}</h2>
                            <p className="text-sm text-white/80 mt-1">Freshly made with love ❤️</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subcategory Tabs - Pill Chips */}
            <div className="mt-5 px-4">
                <div className="flex overflow-x-auto pb-3 gap-2 hide-scrollbar snap-x" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {category.subcategories.map((sub) => (
                        <button
                            key={sub}
                            onClick={() => setActiveSubcategory(sub)}
                            className="flex-shrink-0 px-5 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap snap-start active:scale-95"
                            style={{
                                background: activeSubcategory === sub
                                    ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.light} 100%)`
                                    : '#FFFFFF',
                                color: activeSubcategory === sub ? 'white' : '#666',
                                border: activeSubcategory === sub ? 'none' : '1.5px solid #E8E3DB',
                                boxShadow: activeSubcategory === sub
                                    ? `0 6px 16px ${theme.glow}`
                                    : '0 2px 8px rgba(0,0,0,0.04)'
                            }}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="px-4 mt-2">
                {loading ? (
                    <div className="grid grid-cols-2 gap-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-3xl h-64 animate-pulse" style={{ background: '#E8E3DB' }} />
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <>
                        {/* Results count */}
                        <div className="flex items-center gap-2 mb-3 px-1">
                            <FaFire size={12} color="#C97B4B" />
                            <span className="text-xs font-medium text-gray-500">
                                {filteredProducts.length} items found
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                            {filteredProducts.map((product, idx) => (
                                <div key={product._id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                                    <ProductCardNew product={product} />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 flex items-center justify-center mb-4">
                            <span className="text-4xl">🔍</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">No items found</h3>
                        <p className="text-sm mt-2 text-gray-500">
                            No products available in this category yet
                        </p>
                        <button
                            onClick={() => navigate('/menu')}
                            className="mt-5 px-8 py-3 rounded-full text-white font-semibold active:scale-95 transition-transform"
                            style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.light} 100%)`, boxShadow: `0 8px 24px ${theme.glow}` }}
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
