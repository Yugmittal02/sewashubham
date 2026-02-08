import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubCategoryRow = ({ onSubCategorySelect }) => {
    const navigate = useNavigate();

    const subCategories = [
        // Row 1
        {
            id: 'first-birthday-cake',
            name: 'First Birthday',
            icon: '🎉',
            image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=200&h=200&fit=crop&q=80',
            color: '#FC8019'
        },
        {
            id: 'anniversary-cake',
            name: 'Anniversary',
            icon: '💍',
            image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=200&h=200&fit=crop&q=80',
            color: '#FC8019'
        },
        {
            id: 'birthday-cake',
            name: 'Birthday',
            icon: '🎂',
            image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=200&h=200&fit=crop&q=80',
            color: '#FC8019'
        },
        {
            id: 'photo-cake',
            name: 'Photo Cake',
            icon: '📸',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop&q=80',
            color: '#FF9A3C'
        },
        // Row 2
        {
            id: 'patties',
            name: 'Patties',
            icon: '🥟',
            image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&h=200&fit=crop&q=80',
            color: '#FC8019'
        },
        {
            id: 'beverages',
            name: 'Beverages',
            icon: '☕',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop&q=80',
            color: '#FF9A3C'
        },
        {
            id: 'flowers',
            name: 'Flowers',
            icon: '💐',
            image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=200&h=200&fit=crop&q=80',
            color: '#FC8019'
        },
        {
            id: 'pizza',
            name: 'Pizza',
            icon: '🍕',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop&q=80',
            color: '#FF9A3C'
        }
    ];

    const handleClick = (id) => {
        if (onSubCategorySelect) {
            onSubCategorySelect(id);
        }
        navigate(`/category/${id}`);
    };

    return (
        <div className="subcategory-section" style={{
            padding: '24px 16px',
            background: 'linear-gradient(135deg, rgba(248, 243, 238, 0.8) 0%, rgba(240, 230, 218, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            margin: '20px 16px',
            border: '1px solid rgba(232, 222, 200, 0.6)',
            boxShadow: '0 4px 20px rgba(74, 44, 26, 0.03)'
        }}>
            {/* Section Title */}
            <h3 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#FC8019',
                marginBottom: '16px',
                textAlign: 'center'
            }}>✨ Quick Picks</h3>

            {/* 2x4 Grid Layout */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '12px',
                maxWidth: '100%'
            }}>
                {subCategories.map((sub, index) => (
                    <button
                        key={sub.id}
                        onClick={() => handleClick(sub.id)}
                        className="animate-fade-in"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 8px',
                            width: '80px', // Fixed width for consistent look
                            background: 'rgba(255, 255, 255, 0.6)',
                            borderRadius: '16px',
                            border: '1px solid rgba(232, 222, 200, 0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            animationDelay: `${index * 0.05}s`
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(74, 44, 26, 0.1)';
                            e.currentTarget.style.borderColor = '#C9A962';
                            e.currentTarget.style.background = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = 'rgba(232, 222, 200, 0.5)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                        }}
                    >
                        <div
                            style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '2px solid #E8DEC8',
                                position: 'relative'
                            }}
                        >
                            <img
                                src={sub.image}
                                alt={sub.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(74, 44, 26, 0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span style={{ fontSize: '20px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{sub.icon}</span>
                            </div>
                        </div>
                        <p style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#5C3A21',
                            textAlign: 'center',
                            lineHeight: '1.2',
                            margin: 0
                        }}>{sub.name}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SubCategoryRow;
