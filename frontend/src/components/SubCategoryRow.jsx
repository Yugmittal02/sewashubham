import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubCategoryRow = ({ onSubCategorySelect }) => {
    const navigate = useNavigate();

    const subCategories = [
        // Row 1
        {
            id: 'birthday-cake',
            name: 'Birthday',
            icon: '🎂',
            image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=200&h=200&fit=crop&q=80',
            color: '#C97B4B'
        },
        {
            id: 'wedding-cake',
            name: 'Wedding',
            icon: '💒',
            image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=200&h=200&fit=crop&q=80',
            color: '#C97B4B'
        },
        {
            id: 'anniversary-cake',
            name: 'Anniversary',
            icon: '💍',
            image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=200&h=200&fit=crop&q=80',
            color: '#C97B4B'
        },
        {
            id: 'photo-cake',
            name: 'Photo Cake',
            icon: '📸',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop&q=80',
            color: '#E8956A'
        },
        // Row 2
        {
            id: 'eggless-cake',
            name: 'Eggless',
            icon: '🌿',
            image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=200&h=200&fit=crop&q=80',
            color: '#C97B4B'
        },
        {
            id: 'theme-cake',
            name: 'Theme Cake',
            icon: '🎪',
            image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=200&h=200&fit=crop&q=80',
            color: '#E8956A'
        },
        {
            id: 'cupcakes',
            name: 'Cupcakes',
            icon: '🧁',
            image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=200&h=200&fit=crop&q=80',
            color: '#C97B4B'
        },
        {
            id: 'pastries',
            name: 'Pastries',
            icon: '🥐',
            image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&h=200&fit=crop&q=80',
            color: '#E8956A'
        }
    ];

    // Map subcategory IDs to their parent category route and subcategory tab name
    const categoryRouteMap = {
        'birthday-cake': { route: 'cake', sub: 'Birthday' },
        'wedding-cake': { route: 'cake', sub: 'Wedding' },
        'anniversary-cake': { route: 'cake', sub: 'Anniversary' },
        'photo-cake': { route: 'cake', sub: 'Photo Cake' },
        'eggless-cake': { route: 'cake', sub: 'Eggless' },
        'theme-cake': { route: 'cake', sub: 'Theme Cake' },
        'cupcakes': { route: 'cake', sub: 'Cupcakes' },
        'pastries': { route: 'cake', sub: 'Pastries' },
    };

    const handleClick = (id) => {
        if (onSubCategorySelect) {
            onSubCategorySelect(id);
        }
        const mapping = categoryRouteMap[id];
        if (mapping) {
            navigate(`/category/${mapping.route}${mapping.sub !== 'All' ? `?sub=${encodeURIComponent(mapping.sub)}` : ''}`);
        } else {
            navigate(`/category/${id}`);
        }
    };

    return (
        <div className="mx-4 mt-2 mb-4 bg-white/60 backdrop-blur-md rounded-2xl border border-[#E8DEC8]/60 shadow-sm overflow-hidden">
            {/* Section Title */}
            <h3 className="text-center text-[#C97B4B] font-bold text-sm py-3 border-b border-[#E8DEC8]/40">
                ✨ Quick Picks
            </h3>

            {/* 4x2 Grid Layout */}
            <div className="grid grid-cols-4 gap-3 p-3">
                {subCategories.map((sub, index) => (
                    <button
                        key={sub.id}
                        onClick={() => handleClick(sub.id)}
                        className="animate-fade-in flex flex-col items-center gap-2 group"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border border-[#E8DEC8] relative shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                            <img
                                src={sub.image}
                                alt={sub.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                                <span className="text-xl drop-shadow-md filter">{sub.icon}</span>
                            </div>
                        </div>
                        <p className="text-[10px] md:text-xs font-semibold text-[#5C3A21] text-center leading-tight">
                            {sub.name}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SubCategoryRow;
