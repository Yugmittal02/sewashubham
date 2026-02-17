import React from 'react';
import { useNavigate } from 'react-router-dom';
import SubCategoryRow from './SubCategoryRow';

const MainCategoryCards = ({ onCategorySelect, activeCategory }) => {
    const navigate = useNavigate();

    const categories = [
        {
            id: 'cake',
            name: 'Cake',
            icon: '🎂',
            image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400&h=400&fit=crop&q=80',
            gradient: 'from-pink-100 to-rose-50'
        },
        {
            id: 'fastfood',
            name: 'Fastfood',
            icon: '🍔',
            image: 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?w=400&h=400&fit=crop&q=80',
            gradient: 'from-amber-100 to-orange-50'
        },
        {
            id: 'bakery',
            name: 'Bakery',
            icon: '🥐',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80',
            gradient: 'from-amber-100 to-yellow-50'
        },
        {
            id: 'beverages',
            name: 'Beverages',
            icon: '☕',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&q=80',
            gradient: 'from-amber-100 to-yellow-50'
        },
        {
            id: 'flowers',
            name: 'Flowers',
            icon: '💐',
            image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=400&fit=crop&q=80',
            gradient: 'from-pink-100 to-rose-50'
        },
        {
            id: 'anniversary',
            name: 'Anniversary',
            icon: '💑',
            image: 'https://images.unsplash.com/photo-1626803775151-61d756612f97?w=400&h=400&fit=crop&q=80', // Better anniversary image
            gradient: 'from-pink-100 to-rose-50'
        }
    ];

    const handleCategoryClick = (categoryId) => {
        // Navigate to the category page
        navigate(`/category/${categoryId}`);
    };

    return (
        <section className="category-section-wrapper">
            <div className="category-section-title">
                <h2>Our Categories</h2>
                <p>Explore our delicious collection</p>
            </div>
            {/* Horizontal Scroll Layout (Mobile First) - Single line */}
            <div className="flex overflow-x-auto gap-3 px-4 pb-4 no-scrollbar md:justify-center md:gap-6">
                {categories.map((category, index) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`flex-shrink-0 flex flex-col items-center gap-2 transition-transform active:scale-95 ${activeCategory === category.id ? 'scale-105' : ''}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full p-0.5 ${activeCategory === category.id ? 'bg-gradient-to-br from-[#C97B4B] to-[#E8956A]' : 'bg-transparent'}`}>
                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-md">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <span className={`text-xs font-semibold ${activeCategory === category.id ? 'text-[#C97B4B]' : 'text-gray-600'}`}>
                            {category.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Subcategory Quick Links */}
            <SubCategoryRow onSubCategorySelect={onCategorySelect} />
        </section>
    );
};

export default MainCategoryCards;
