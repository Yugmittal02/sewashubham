import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FaPlus, FaStar, FaCheck } from 'react-icons/fa';
import CustomizeModal from './CustomizeModal';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [showCustomize, setShowCustomize] = useState(false);
    const [added, setAdded] = useState(false);
    
    const hasOptions = (product.sizes?.length > 0) || (product.addons?.length > 0);
    
    const handleAdd = () => {
        if (hasOptions) {
            setShowCustomize(true);
        } else {
            addToCart({
                ...product,
                size: null,
                selectedAddons: [],
                price: product.basePrice
            });
            // Show added feedback
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
        }
    };

    return (
        <>
            <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all active:scale-[0.98] ${!product.isAvailable ? 'opacity-60' : ''}`}>
                {/* Large Touch Area */}
                <div className="p-4 flex gap-4">
                    {/* Image - Larger */}
                    <div 
                        className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex-shrink-0 bg-cover bg-center relative overflow-hidden"
                        style={{ backgroundImage: product.image ? `url(${product.image})` : 'none' }}
                    >
                        {!product.image && (
                            <div className="absolute inset-0 flex items-center justify-center text-5xl">🍽️</div>
                        )}
                        {!product.isAvailable && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                <span className="text-white text-xs font-bold bg-red-500 px-3 py-1.5 rounded-xl uppercase tracking-wide">Sold Out</span>
                            </div>
                        )}
                        {/* Rating Badge on Image */}
                        {product.rating > 0 && (
                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-amber-700 px-2 py-1 rounded-lg shadow-sm">
                                <FaStar className="text-amber-500" size={10} />
                                <span className="font-bold text-xs">{product.rating}</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1 leading-relaxed">{product.description}</p>
                            
                            {/* Sizes hint */}
                            {product.sizes?.length > 0 && (
                                <div className="flex gap-1.5 mt-2 flex-wrap">
                                    {product.sizes.map(s => (
                                        <span key={s.name} className="text-xs text-orange-600 font-semibold bg-orange-50 px-2.5 py-1 rounded-lg">
                                            {s.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex justify-between items-end mt-3">
                            <div>
                                <span className="text-xs text-gray-400 font-medium">Starts at</span>
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-sm text-gray-500">₹</span>
                                    <span className="font-black text-2xl text-gray-900">{product.basePrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Button - Full Width & Large */}
                <button 
                    onClick={handleAdd}
                    disabled={!product.isAvailable}
                    className={`w-full h-14 flex items-center justify-center gap-2 font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        added 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 border-t border-orange-100 active:from-orange-500 active:to-orange-600 active:text-white'
                    }`}
                >
                    {added ? (
                        <>
                            <FaCheck size={16} />
                            <span>Added to Cart!</span>
                        </>
                    ) : (
                        <>
                            <FaPlus size={14} />
                            <span>{hasOptions ? 'Customize & Add' : 'Add to Cart'}</span>
                        </>
                    )}
                </button>
            </div>
            
            {/* Customize Modal */}
            {showCustomize && (
                <CustomizeModal 
                    product={product} 
                    onClose={() => setShowCustomize(false)} 
                />
            )}
        </>
    );
};

export default ProductCard;
