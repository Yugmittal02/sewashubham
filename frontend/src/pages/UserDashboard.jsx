import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyOrders } from '../services/api';
import {
    FaArrowLeft, FaReceipt, FaClock, FaCheckCircle, FaSpinner, FaUtensils,
    FaBoxOpen, FaUser, FaMapMarkerAlt, FaEdit, FaHeart, FaCrown, FaStar,
    FaGift, FaPercent, FaBell
} from 'react-icons/fa';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { customer, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!customer) {
            navigate('/login');
            return;
        }
        loadOrders();
    }, [customer, navigate]);

    const loadOrders = useCallback(async () => {
        try {
            const { data } = await fetchMyOrders();
            setOrders(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <FaCheckCircle className="text-green-500" />;
            case 'preparing': return <FaUtensils className="text-orange-500" />;
            case 'out_for_delivery': return <FaBoxOpen className="text-blue-500" />;
            default: return <FaClock className="text-yellow-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return { bg: '#DCFCE7', text: '#166534' };
            case 'preparing': return { bg: '#FEF3C7', text: '#92400E' };
            case 'out_for_delivery': return { bg: '#DBEAFE', text: '#1E40AF' };
            case 'cancelled': return { bg: '#FEE2E2', text: '#991B1B' };
            default: return { bg: '#FEF3E2', text: '#6B4423' };
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!customer) return null;

    return (
        <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #F5F0E8 0%, #FAF7F2 100%)' }}>
            {/* Header - Compact mobile */}
            <header className="sticky top-0 z-10 px-3 py-3 flex items-center justify-between"
                style={{ background: 'linear-gradient(180deg, #2D1F16 0%, #3D2B1F 100%)', borderBottom: '3px solid #C9A962' }}>
                <button onClick={() => navigate('/menu')} className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <FaArrowLeft size={16} color="#FFFFFF" />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-xl">👤</span>
                    <h1 className="text-lg font-script" style={{ color: '#D4B896' }}>My Account</h1>
                </div>
                <button onClick={() => navigate('/notifications')} className="w-9 h-9 rounded-full flex items-center justify-center relative"
                    style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <FaBell size={14} color="#D4B896" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
                </button>
            </header>

            {/* Profile Card - Mobile optimized */}
            <div className="mx-3 mt-3 p-4 rounded-2xl relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #3D2B1F 0%, #4A3728 100%)', boxShadow: '0 6px 24px rgba(74, 55, 40, 0.25)' }}>
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full" style={{ background: 'rgba(201, 169, 98, 0.1)' }}></div>
                <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full" style={{ background: 'rgba(201, 169, 98, 0.1)' }}></div>

                <div className="relative flex items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #C9A962 0%, #D4B87A 100%)', boxShadow: '0 4px 12px rgba(201, 169, 98, 0.4)' }}>
                        <span className="text-2xl">😊</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-white truncate">{customer.name}</h2>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{customer.phone}</p>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(201, 169, 98, 0.2)' }}>
                                <FaCrown size={8} color="#C9A962" />
                                <span className="text-[9px] font-bold" style={{ color: '#C9A962' }}>MEMBER</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                <FaStar size={8} color="#F5A623" />
                                <span className="text-[9px] font-bold text-white">{orders.length} Orders</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions - Mobile grid */}
            <div className="mx-3 mt-3 grid grid-cols-3 gap-2">
                <button onClick={() => navigate('/address/add')}
                    className="p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all active:scale-95"
                    style={{ background: 'white', border: '1.5px solid #E8E3DB', boxShadow: '0 2px 8px rgba(74, 55, 40, 0.06)' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#FEF3E2' }}>
                        <FaMapMarkerAlt size={14} color="#6B4423" />
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: '#4A3728' }}>Address</span>
                </button>
                <button onClick={() => navigate('/favorites')}
                    className="p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all active:scale-95"
                    style={{ background: 'white', border: '1.5px solid #E8E3DB', boxShadow: '0 2px 8px rgba(74, 55, 40, 0.06)' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#FEE2E2' }}>
                        <FaHeart size={14} color="#E57373" />
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: '#4A3728' }}>Favorites</span>
                </button>
                <button onClick={() => navigate('/offers')}
                    className="p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all active:scale-95"
                    style={{ background: 'white', border: '1.5px solid #E8E3DB', boxShadow: '0 2px 8px rgba(74, 55, 40, 0.06)' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#DCFCE7' }}>
                        <FaPercent size={12} color="#22C55E" />
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: '#4A3728' }}>Offers</span>
                </button>
            </div>

            {/* Loyalty Card - Compact */}
            <div className="mx-3 mt-3 p-3 rounded-2xl flex items-center gap-3"
                style={{ background: 'linear-gradient(135deg, #FEF3E2 0%, #FDE8CC 100%)', border: '1.5px solid #C9A962' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #C9A962 0%, #D4B87A 100%)' }}>
                    <FaGift size={20} color="#3D2B1F" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: '#6B4423' }}>🎉 Loyalty Points</p>
                    <p className="text-xs" style={{ color: '#8B7355' }}>Earn points on every order!</p>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold" style={{ color: '#6B4423' }}>{orders.length * 50}</p>
                    <p className="text-[9px]" style={{ color: '#8B7355' }}>points</p>
                </div>
            </div>

            {/* Orders Section */}
            <div className="mx-3 mt-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <FaReceipt size={16} color="#6B4423" />
                        <h3 className="font-bold text-sm" style={{ color: '#4A3728' }}>My Orders</h3>
                    </div>
                    <span className="text-xs" style={{ color: '#8B7355' }}>{orders.length} total</span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <FaSpinner className="animate-spin" size={22} color="#6B4423" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-10 rounded-2xl" style={{ background: 'white', border: '1.5px solid #E8E3DB' }}>
                        <p className="text-4xl mb-3">🛒</p>
                        <p className="font-semibold text-sm" style={{ color: '#4A3728' }}>No orders yet</p>
                        <p className="text-xs mt-1 mb-3" style={{ color: '#8B7355' }}>Start ordering delicious treats!</p>
                        <button onClick={() => navigate('/menu')}
                            className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
                            style={{ background: 'linear-gradient(135deg, #6B4423 0%, #5C4033 100%)' }}>
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {orders.slice(0, 5).map((order, index) => {
                            const statusStyle = getStatusColor(order.status);
                            return (
                                <div key={order._id}
                                    className="p-3 rounded-xl animate-fade-in"
                                    style={{ background: 'white', border: '1.5px solid #E8E3DB', animationDelay: `${index * 0.1}s` }}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-xs" style={{ color: '#4A3728' }}>
                                                #{order._id?.slice(-6).toUpperCase()}
                                            </p>
                                            <p className="text-[10px] mt-0.5" style={{ color: '#8B7355' }}>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold"
                                            style={{ background: statusStyle.bg, color: statusStyle.text }}>
                                            {getStatusIcon(order.status)}
                                            <span className="capitalize">{order.status?.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs" style={{ color: '#8B7355' }}>
                                            {order.items?.length} items
                                        </p>
                                        <p className="font-bold text-sm" style={{ color: '#6B4423' }}>₹{order.total}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Logout Button */}
            <div className="mx-3 mt-5 mb-4">
                <button onClick={handleLogout}
                    className="w-full py-3.5 rounded-xl font-semibold text-sm border-2 transition-all active:scale-95 hover:bg-red-50"
                    style={{ borderColor: '#E57373', color: '#E57373' }}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;
