import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubCategoryRow = ({ onSubCategorySelect }) => {
    const navigate = useNavigate();

    const subCategories = [
        {
            id: 'anniversary-cake',
            name: 'Anniversary Cake',
            icon: '💍',
            image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=150&h=150&fit=crop',
            color: '#FF6B6B'
        },
        {
            id: 'birthday-cake',
            name: 'Birthday Cake',
            icon: '🎂',
            image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=150&h=150&fit=crop',
            color: '#4ECDC4'
        },
        {
            id: 'wedding-cake',
            name: 'Wedding Cake',
            icon: '💒',
            image: 'https://images.unsplash.com/photo-1522767131822-6df8ddb15a8d?w=150&h=150&fit=crop',
            color: '#FFE66D'
        },
        {
            id: 'photo-cake',
            name: 'Photo Cake',
            icon: '📸',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&h=150&fit=crop',
            color: '#A78BFA'
        },
        {
            id: 'custom-cake',
            name: 'Custom Cake',
            icon: '✨',
            image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=150&h=150&fit=crop',
            color: '#F472B6'
        },
        {
            id: 'cupcakes',
            name: 'Cupcakes',
            icon: '🧁',
            image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=150&h=150&fit=crop',
            color: '#FB923C'
        }
    ];

    const handleClick = (id) => {
        if (onSubCategorySelect) {
            onSubCategorySelect(id);
        }
        navigate(`/category/cake?sub=${id}`);
    };

    return (
        <div className="subcategory-row">
            <div className="subcategory-scroll hide-scrollbar">
                {subCategories.map((sub, index) => (
                    <button
                        key={sub.id}
                        onClick={() => handleClick(sub.id)}
                        className="subcategory-item animate-fade-in"
                        style={{ animationDelay: `${index * 0.08}s` }}
                    >
                        <div
                            className="subcategory-icon"
                            style={{
                                background: `linear-gradient(135deg, ${sub.color}20 0%, ${sub.color}40 100%)`,
                                borderColor: sub.color
                            }}
                        >
                            <img src={sub.image} alt={sub.name} />
                            <div className="subcategory-overlay">
                                <span className="text-2xl">{sub.icon}</span>
                            </div>
                        </div>
                        <p className="subcategory-label">{sub.name}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SubCategoryRow;
