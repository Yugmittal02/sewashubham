import React, { useMemo } from 'react';
import { FaClipboardList, FaRupeeSign, FaClock, FaChartLine, FaShoppingCart, FaFire, FaTruck, FaCheckCircle } from 'react-icons/fa';

const AdminStats = ({ todayOrders, todayRevenue, pendingOrders, allOrders = [], products = [] }) => {
    // Richer analytics
    const totalOrders = allOrders.length;
    const totalRevenue = useMemo(() => allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0), [allOrders]);
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0;

    const deliveredOrders = allOrders.filter(o => o.status === 'Delivered').length;
    const cancelledOrders = allOrders.filter(o => o.status === 'Cancelled').length;

    // Weekly orders (last 7 days)
    const weeklyOrders = useMemo(() => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return allOrders.filter(o => new Date(o.createdAt) >= weekAgo);
    }, [allOrders]);
    const weeklyRevenue = weeklyOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Category breakdown from orders
    const categoryBreakdown = useMemo(() => {
        const cats = {};
        allOrders.forEach(o => {
            (o.items || []).forEach(item => {
                // Try to find category from product list
                const product = products.find(p => p._id === (item.product?._id || item.product));
                const cat = product?.category || 'Other';
                cats[cat] = (cats[cat] || 0) + (item.quantity || 1);
            });
        });
        return Object.entries(cats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }, [allOrders, products]);

    // Payment method breakdown
    const paymentBreakdown = useMemo(() => {
        const methods = {};
        allOrders.forEach(o => {
            const method = o.paymentMethod || 'Cash';
            methods[method] = (methods[method] || 0) + 1;
        });
        return Object.entries(methods).sort((a, b) => b[1] - a[1]);
    }, [allOrders]);

    return (
        <div className="px-4 pb-20 pt-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-800">Overview</h2>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold">
                    Live Updates
                </div>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Today's Orders */}
                <div className="p-5 rounded-3xl shadow-sm relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF8F2 100%)', border: '1px solid #F0D6C0' }}>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FEE4CC 0%, #FDD5B0 100%)' }}>
                                <FaClipboardList className="text-orange-600" />
                            </div>
                            <span className="font-bold text-xs" style={{ color: '#8B7355' }}>Today</span>
                        </div>
                        <p className="text-3xl font-black" style={{ color: '#D4612C' }}>{todayOrders.length}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: '#A0714F' }}>orders</p>
                    </div>
                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-orange-50 to-transparent rounded-full -mr-6 -mt-6 opacity-50 pointer-events-none"></div>
                </div>

                {/* Today's Revenue */}
                <div className="p-5 rounded-3xl shadow-sm relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FFF4 100%)', border: '1px solid #C6F0D4' }}>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)' }}>
                                <FaRupeeSign className="text-green-600" />
                            </div>
                            <span className="font-bold text-xs" style={{ color: '#8B7355' }}>Revenue</span>
                        </div>
                        <p className="text-3xl font-black" style={{ color: '#16A34A' }}>₹{todayRevenue.toFixed(0)}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: '#22C55E' }}>today</p>
                    </div>
                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-green-50 to-transparent rounded-full -mr-6 -mt-6 opacity-50 pointer-events-none"></div>
                </div>

                {/* Pending Orders */}
                <div className="p-5 rounded-3xl shadow-sm relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFBEB 100%)', border: '1px solid #FDE68A' }}>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}>
                                <FaClock className="text-yellow-600" />
                            </div>
                            <span className="font-bold text-xs" style={{ color: '#8B7355' }}>Pending</span>
                        </div>
                        <p className="text-3xl font-black" style={{ color: '#CA8A04' }}>{pendingOrders}</p>
                        {pendingOrders > 0 && (
                            <div className="animate-pulse mt-1">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: '#A16207', background: '#FEF9C3' }}>⚡ Action Needed</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Avg Order Value */}
                <div className="p-5 rounded-3xl shadow-sm relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF5FF 100%)', border: '1px solid #E9D5FF' }}>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)' }}>
                                <FaShoppingCart size={14} className="text-purple-600" />
                            </div>
                            <span className="font-bold text-xs" style={{ color: '#8B7355' }}>Avg Value</span>
                        </div>
                        <p className="text-3xl font-black" style={{ color: '#7C3AED' }}>₹{avgOrderValue}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: '#8B5CF6' }}>per order</p>
                    </div>
                </div>
            </div>

            {/* Weekly Summary */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <FaChartLine className="text-blue-500" />
                    <h3 className="font-bold text-gray-800">This Week</h3>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-blue-50 rounded-2xl p-3">
                        <p className="text-2xl font-black text-blue-700">{weeklyOrders.length}</p>
                        <p className="text-[10px] text-blue-500 font-semibold mt-0.5">Orders</p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-3">
                        <p className="text-2xl font-black text-green-700">₹{(weeklyRevenue / 1000).toFixed(1)}k</p>
                        <p className="text-[10px] text-green-500 font-semibold mt-0.5">Revenue</p>
                    </div>
                    <div className="bg-amber-50 rounded-2xl p-3">
                        <p className="text-2xl font-black text-amber-700">{totalOrders}</p>
                        <p className="text-[10px] text-amber-500 font-semibold mt-0.5">All Time</p>
                    </div>
                </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-4">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaTruck className="text-gray-400" /> Order Status
                </h3>
                <div className="space-y-3">
                    {[
                        { label: 'Delivered', count: deliveredOrders, color: 'bg-green-500', bgColor: 'bg-green-50', icon: <FaCheckCircle className="text-green-500" size={12} /> },
                        { label: 'Pending', count: pendingOrders, color: 'bg-yellow-500', bgColor: 'bg-yellow-50', icon: <FaClock className="text-yellow-500" size={12} /> },
                        { label: 'Cancelled', count: cancelledOrders, color: 'bg-red-500', bgColor: 'bg-red-50', icon: <FaClock className="text-red-500" size={12} /> },
                    ].map(item => {
                        const pct = totalOrders > 0 ? (item.count / totalOrders) * 100 : 0;
                        return (
                            <div key={item.label} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center`}>{item.icon}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                                        <span className="text-xs font-bold text-gray-500">{item.count} ({pct.toFixed(0)}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Top Categories */}
            {categoryBreakdown.length > 0 && (
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-4">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaFire className="text-orange-400" /> Top Categories
                    </h3>
                    <div className="space-y-3">
                        {categoryBreakdown.map(([cat, count], i) => (
                            <div key={cat} className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black">
                                    {i + 1}
                                </span>
                                <span className="flex-1 text-sm font-semibold text-gray-700 capitalize">{cat}</span>
                                <span className="text-sm font-bold text-gray-500">{count} items</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Payment Methods */}
            {paymentBreakdown.length > 0 && (
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">💳 Payment Methods</h3>
                    <div className="flex flex-wrap gap-2">
                        {paymentBreakdown.map(([method, count]) => (
                            <div key={method} className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 text-center">
                                <p className="text-lg font-black text-gray-800">{count}</p>
                                <p className="text-[10px] text-gray-500 font-semibold">{method}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStats;
