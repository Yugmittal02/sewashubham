import React, { useState, useCallback, memo } from 'react';
import { useCart } from '../context/CartContext';
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart, FaCheck, FaFire, FaCrown, FaBolt } from 'react-icons/fa';

const ProductCardNew = memo(({ product, onAddSuccess, index = 0, featured = false }) => {
    const { addToCart } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [added, setAdded] = useState(false);

    // Defensive checks - ensure all numeric values are valid
    // API returns 'basePrice', not 'price' - handle both for compatibility
    const basePrice = Number(product?.basePrice) || Number(product?.price) || 0;
    const baseOriginalPrice = Number(product?.originalPrice) || 0;

    const safeProduct = {
        _id: product?._id || Math.random().toString(),
        name: product?.name || 'Unnamed Product',
        description: product?.description || '',
        price: basePrice,
        originalPrice: baseOriginalPrice > basePrice ? baseOriginalPrice : Math.round(basePrice * 1.2) || basePrice,
        image: product?.image || '',
        rating: Number(product?.rating) || 4.5,
        discount: Number(product?.discount) || 0,
        isAvailable: product?.isAvailable !== false,
        isVeg: product?.isVeg !== false,
        isBestseller: product?.isBestseller || index < 2,
        isNew: product?.isNew || index === 0,
        soldCount: Number(product?.soldCount) || Math.floor(Math.random() * 100) + 50
    };

    // Calculate discount safely
    const discountPercent = safeProduct.discount > 0
        ? safeProduct.discount
        : (safeProduct.originalPrice > safeProduct.price && safeProduct.originalPrice > 0)
            ? Math.round((1 - safeProduct.price / safeProduct.originalPrice) * 100)
            : 0;

    const handleAdd = useCallback(() => {
        if (!safeProduct.isAvailable) return;

        addToCart({
            ...safeProduct,
            quantity: 1
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        onAddSuccess?.();
    }, [addToCart, safeProduct, onAddSuccess]);

    const toggleWishlist = useCallback((e) => {
        e.stopPropagation();
        setIsWishlisted(prev => !prev);
    }, []);

    // Render stars
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(safeProduct.rating);

        for (let i = 0; i < 5; i++) {
            stars.push(
                <FaStar
                    key={i}
                    className={`star ${i < fullStars ? '' : 'empty'}`}
                    style={{ '--star-index': i }}
                />
            );
        }
        return stars;
    };

    return (
        <div
            className={`product-card animate-fade-in-up ${!safeProduct.isAvailable ? 'opacity-60' : ''} ${featured ? 'featured-card' : ''}`}
            style={{
                animationDelay: `${index * 0.08}s`,
                ...(featured ? { border: '2px solid #C9A962', boxShadow: '0 8px 32px rgba(201, 169, 98, 0.25)' } : {})
            }}
        >
            {/* Multiple Badges Container */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {/* Bestseller Badge */}
                {safeProduct.isBestseller && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)', boxShadow: '0 2px 8px rgba(255, 107, 53, 0.4)' }}>
                        <FaFire size={10} />
                        <span>BESTSELLER</span>
                    </div>
                )}

                {/* New Badge */}
                {safeProduct.isNew && !safeProduct.isBestseller && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                        <FaBolt size={9} />
                        <span>NEW</span>
                    </div>
                )}

                {/* Discount Badge */}
                {discountPercent > 0 && (
                    <div className="discount-badge" style={{ position: 'relative', top: 0, left: 0 }}>
                        {discountPercent}% OFF
                    </div>
                )}
            </div>

            {/* Featured Crown */}
            {featured && (
                <div className="absolute top-3 right-12 z-10">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #C9A962 0%, #D4B87A 100%)', boxShadow: '0 4px 12px rgba(201, 169, 98, 0.4)' }}>
                        <FaCrown size={14} color="#3D2B1F" />
                    </div>
                </div>
            )}

            {/* Wishlist Button */}
            <button
                onClick={toggleWishlist}
                className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                {isWishlisted ? (
                    <FaHeart size={15} style={{ color: '#E57373' }} />
                ) : (
                    <FaRegHeart size={15} style={{ color: '#8B7355' }} />
                )}
            </button>

            {/* Product Image */}
            <div className="product-image">
                {safeProduct.image ? (
                    <img
                        src={safeProduct.image}
                        alt={safeProduct.name}
                        loading="lazy"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;background:linear-gradient(to bottom right, #FEF3C7, #FFEDD5);">🍰</div>';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-amber-50 to-orange-100">
                        🍽️
                    </div>
                )}

                {/* Sold Count Badge */}
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg text-[10px] font-semibold"
                    style={{ background: 'rgba(0,0,0,0.7)', color: 'white', backdropFilter: 'blur(4px)' }}>
                    🔥 {safeProduct.soldCount}+ sold
                </div>
            </div>

            {/* Product Details */}
            <div className="product-details">
                {/* Title with Veg Icon */}
                <div className="product-title">
                    {safeProduct.isVeg && (
                        <div className="veg-icon"></div>
                    )}
                    <h4>{safeProduct.name}</h4>
                </div>

                {/* Description */}
                {safeProduct.description && (
                    <p className="product-description">
                        {safeProduct.description}
                    </p>
                )}

                {/* Star Rating with Review Count */}
                <div className="flex items-center gap-2">
                    <div className="star-rating">
                        {renderStars()}
                    </div>
                    <span className="text-[11px] font-medium" style={{ color: '#8B7355' }}>
                        ({Math.floor(safeProduct.rating * 20)})
                    </span>
                </div>

                {/* Price Row */}
                <div className="price-row">
                    <span className="price-current">₹{safeProduct.price}</span>
                    {safeProduct.originalPrice > safeProduct.price && (
                        <span className="price-original">₹{safeProduct.originalPrice}</span>
                    )}
                    {discountPercent > 0 && (
                        <span className="text-[11px] font-bold" style={{ color: '#22C55E' }}>
                            Save ₹{safeProduct.originalPrice - safeProduct.price}
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAdd}
                    disabled={!safeProduct.isAvailable || added}
                    className={`add-cart-btn ${added ? 'added' : ''}`}
                >
                    {added ? (
                        <>
                            <FaCheck size={14} />
                            <span>Added to Cart!</span>
                        </>
                    ) : (
                        <>
                            <FaShoppingCart size={13} />
                            <span>{!safeProduct.isAvailable ? 'Out of Stock' : 'Add to Cart'}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
});

ProductCardNew.displayName = 'ProductCardNew';

export default ProductCardNew;
