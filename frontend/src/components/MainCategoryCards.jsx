import React from 'react';
import { useNavigate } from 'react-router-dom';
import SubCategoryRow from './SubCategoryRow';

const MainCategoryCards = ({ onCategorySelect, activeCategory }) => {
    const navigate = useNavigate();

    const categories = [
        {
            id: 'chocolate-cake',
            name: 'Chocolate',
            icon: '🍫',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&q=80',
        },
        {
            id: 'fruit-cake',
            name: 'Fruit Cakes',
            icon: '🍓',
            image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop&q=80',
        },
        {
            id: 'designer-cake',
            name: 'Designer',
            icon: '🎨',
            image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&h=400&fit=crop&q=80',
        },
        {
            id: 'premium-cake',
            name: 'Premium',
            icon: '👑',
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop&q=80',
        },
        {
            id: 'cheesecake',
            name: 'Cheesecake',
            icon: '🧀',
            image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop&q=80',
        },
        {
            id: 'kids-cake',
            name: 'Kids Special',
            icon: '🎈',
            image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=400&fit=crop&q=80',
        },
    ];

    const handleCategoryClick = (categoryId) => {
        navigate(`/category/${categoryId}`);
    };

    return (
        <>
            <section className="category-section-wrapper">
                <div className="category-section-title">
                    <h2>Our Categories</h2>
                    <p>Explore our delicious collection</p>
                </div>
                {/* Circular Category Items - Horizontal Scroll */}
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    padding: '0 16px 8px',
                    overflowX: 'auto',
                    justifyContent: 'flex-start'
                }} className="hide-scrollbar">
                    {categories.map((category, index) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                flexShrink: 0,
                                transition: 'transform 0.2s ease'
                            }}
                            className="active:scale-95"
                        >
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: activeCategory === category.id ? '3px solid #C97B4B' : '3px solid #FFFFFF',
                                boxShadow: '0 4px 16px rgba(45,24,16,0.10)',
                            }}>
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <span style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: activeCategory === category.id ? '#C97B4B' : '#5C3A2A'
                            }}>
                                {category.name}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Subcategory Quick Links */}
            <SubCategoryRow onSubCategorySelect={onCategorySelect} />
        </>
    );
};

export default MainCategoryCards;
