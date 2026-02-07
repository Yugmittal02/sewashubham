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
            <div className="category-grid">
                {categories.map((category, index) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`category-card animate-fade-in-up ${activeCategory === category.id ? 'ring-2 ring-[#C9A962] ring-offset-2' : ''}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="relative overflow-hidden">
                            <img
                                src={category.image}
                                alt={category.name}
                                loading="lazy"
                            />
                            {/* Hover overlay */}
                            <div
                                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                                style={{
                                    background: 'linear-gradient(180deg, transparent 50%, rgba(252, 128, 25, 0.3) 100%)'
                                }}
                            />
                        </div>
                        <div className="category-card-label">
                            <p>{category.name}</p>
                            <span>{category.icon}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Subcategory Quick Links */}
            <SubCategoryRow onSubCategorySelect={onCategorySelect} />
        </section>
    );
};

export default MainCategoryCards;
