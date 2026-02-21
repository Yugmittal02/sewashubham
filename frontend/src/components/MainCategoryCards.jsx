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
            image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=400&fit=crop&q=80',
            gradient: 'from-pink-100 to-rose-50'
        },
        {
            id: 'fastfood',
            name: 'Fastfood',
            icon: '🍔',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&q=80',
            gradient: 'from-amber-100 to-orange-50'
        },
        {
            id: 'bakery',
            name: 'Bakery',
            icon: '🥐',
            image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&h=400&fit=crop&q=80',
            gradient: 'from-amber-100 to-yellow-50'
        },
        {
            id: 'beverages',
            name: 'Beverages',
            icon: '☕',
            image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop&q=80',
            gradient: 'from-amber-100 to-yellow-50'
        },
        {
            id: 'flowers',
            name: 'Flowers',
            icon: '💐',
            image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400&h=400&fit=crop&q=80',
            gradient: 'from-pink-100 to-rose-50'
        },
        {
            id: 'anniversary',
            name: 'Anniversary',
            icon: '💑',
            image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&h=400&fit=crop&q=80',
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
            <div className="grid grid-cols-3 gap-y-3 gap-x-1 px-4 pb-4 md:flex md:justify-center md:gap-2">
                {categories.map((category, index) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`flex flex-col items-center gap-1.5 transition-transform active:scale-95 ${activeCategory === category.id ? 'scale-105' : ''}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className={`w-[85px] h-[85px] md:w-[120px] md:h-[120px] rounded-full p-0.5 ${activeCategory === category.id ? 'bg-gradient-to-br from-[#C97B4B] to-[#E8956A]' : 'bg-transparent'}`}>
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
