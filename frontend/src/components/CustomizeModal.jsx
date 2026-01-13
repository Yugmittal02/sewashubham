import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FaPlus, FaMinus, FaTimes, FaCheck, FaShoppingBag } from 'react-icons/fa';

const CustomizeModal = ({ product, onClose }) => {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [quantity, setQuantity] = useState(1);

    const toggleAddon = (addon) => {
        setSelectedAddons(prev => 
            prev.find(a => a.name === addon.name) 
                ? prev.filter(a => a.name !== addon.name)
                : [...prev, addon]
        );
    };

    const calculatePrice = () => {
        let price = selectedSize?.price || product.basePrice;
        price += selectedAddons.reduce((sum, a) => sum + a.price, 0);
        return price * quantity;
    };

    const handleAddToCart = () => {
        addToCart({
            ...product,
            size: selectedSize?.name || null,
            selectedAddons: selectedAddons.map(a => a.name),
            price: calculatePrice() / quantity,
            quantity
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center">
            <div className="bg-white w-full rounded-t-[2rem] max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up safe-area-bottom">
                {/* Header with Image */}
                <div className="relative h-52 bg-gray-100">
                    {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-7xl bg-gradient-to-br from-orange-50 to-amber-50">
                            🍽️
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 active:scale-90 transition-transform shadow-lg"
                    >
                        <FaTimes size={20} />
                    </button>
                    <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-2xl font-black text-white drop-shadow-lg">{product.name}</h2>
                        <p className="text-white/80 text-sm mt-1 line-clamp-2">{product.description}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto max-h-[45vh]">
                    {/* Sizes - Large Touch Grid */}
                    {product.sizes?.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-800 text-base mb-3">📏 Choose Size</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {product.sizes.map(size => (
                                    <button
                                        key={size.name}
                                        onClick={() => setSelectedSize(size)}
                                        className={`p-4 rounded-2xl border-2 text-center transition-all active:scale-95 ${
                                            selectedSize?.name === size.name
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 active:border-gray-300'
                                        }`}
                                    >
                                        <p className="font-bold text-gray-800 text-base">{size.name}</p>
                                        <p className={`text-base font-semibold mt-1 ${selectedSize?.name === size.name ? 'text-orange-600' : 'text-gray-500'}`}>
                                            ₹{size.price}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Addons - Large Touch Cards */}
                    {product.addons?.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-800 text-base mb-3">✨ Add Extras</h3>
                            <div className="space-y-3">
                                {product.addons.map(addon => {
                                    const isSelected = selectedAddons.find(a => a.name === addon.name);
                                    return (
                                        <button
                                            key={addon.name}
                                            onClick={() => toggleAddon(addon)}
                                            className={`w-full p-4 rounded-2xl border-2 flex justify-between items-center transition-all active:scale-[0.98] ${
                                                isSelected
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200 active:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                                                    isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                                                }`}>
                                                    {isSelected && <FaCheck className="text-white" size={14} />}
                                                </div>
                                                <span className="font-semibold text-gray-800 text-base">{addon.name}</span>
                                            </div>
                                            <span className={`font-bold text-base ${isSelected ? 'text-orange-600' : 'text-gray-500'}`}>
                                                +₹{addon.price}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Quantity - Large Controls */}
                    <div>
                        <h3 className="font-bold text-gray-800 text-base mb-3">🔢 Quantity</h3>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center active:scale-90 active:bg-gray-200 transition-all"
                            >
                                <FaMinus size={18} />
                            </button>
                            <span className="text-3xl font-black text-gray-800 w-14 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 rounded-2xl flex items-center justify-center active:scale-90 active:from-orange-500 active:to-orange-600 active:text-white transition-all"
                            >
                                <FaPlus size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer - Large Add Button */}
                <div className="p-5 bg-gray-50 border-t border-gray-100">
                    <button
                        onClick={handleAddToCart}
                        className="w-full h-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-orange-300/50 active:scale-[0.98] transition-all flex justify-between items-center px-6"
                    >
                        <div className="flex items-center gap-3">
                            <FaShoppingBag size={20} />
                            <span>Add to Cart</span>
                        </div>
                        <span className="bg-white/25 px-5 py-2 rounded-xl font-black text-xl">₹{calculatePrice()}</span>
                    </button>
                </div>
            </div>

            {/* Custom CSS */}
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
                .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
            `}</style>
        </div>
    );
};

export default CustomizeModal;
