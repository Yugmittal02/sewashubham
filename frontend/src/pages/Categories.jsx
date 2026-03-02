import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { FaArrowLeft } from 'react-icons/fa';

const Categories = () => {
    const navigate = useNavigate();

    const categories = [
        {
            id: 'chocolate-cake',
            name: 'Chocolate Cakes',
            icon: '🍫',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&q=80',
            description: 'Rich chocolate cakes & truffle delights',
            color: 'bg-amber-50'
        },
        {
            id: 'fruit-cake',
            name: 'Fruit Cakes',
            icon: '🍓',
            image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop&q=80',
            description: 'Fresh fruit topped cream cakes',
            color: 'bg-pink-50'
        },
        {
            id: 'designer-cake',
            name: 'Designer Cakes',
            icon: '🎨',
            image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&h=400&fit=crop&q=80',
            description: 'Custom designed celebration cakes',
            color: 'bg-purple-50'
        },
        {
            id: 'premium-cake',
            name: 'Premium Cakes',
            icon: '👑',
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop&q=80',
            description: 'Tiramisu, Red Velvet & luxury cakes',
            color: 'bg-yellow-50'
        },
        {
            id: 'cheesecake',
            name: 'Cheesecakes',
            icon: '🧀',
            image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop&q=80',
            description: 'Creamy baked & unbaked cheesecakes',
            color: 'bg-orange-50'
        },
        {
            id: 'kids-cake',
            name: 'Kids Special',
            icon: '🎈',
            image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=400&fit=crop&q=80',
            description: 'Fun cartoon & theme cakes for kids',
            color: 'bg-rose-50'
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDF8F4]">
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all text-gray-600"
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold text-[#2D1810]">All Categories</h1>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => navigate(`/category/${category.id}`)}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group border border-[#F0E8E0]"
                        >
                            <div className="h-32 md:h-40 overflow-hidden relative">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                                <span className="absolute bottom-3 left-3 text-2xl">{category.icon}</span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-[#2D1810] mb-1 group-hover:text-[#C97B4B] transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-xs text-gray-500">{category.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categories;
