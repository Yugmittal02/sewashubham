import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaReceipt, FaClock, FaCheckCircle, FaSpinner, FaUtensils, FaBoxOpen, FaUser } from 'react-icons/fa';
import { fetchMyOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { customer, logoutCustomer } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!customer) {
            navigate('/');
            return;
        }

        const loadOrders = async () => {
            try {
                const { data } = await fetchMyOrders();
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [customer, navigate]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-yellow-600 bg-yellow-100';
            case 'Preparing': return 'text-blue-600 bg-blue-100';
            case 'Ready': return 'text-purple-600 bg-purple-100';
            case 'Delivered': return 'text-green-600 bg-green-100';
            case 'Cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };
    
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <FaClock />;
            case 'Preparing': return <FaUtensils />;
            case 'Ready': return <FaBoxOpen />;
            case 'Delivered': return <FaCheckCircle />;
            default: return <FaReceipt />;
        }
    };

    if (!customer) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 shadow-sm px-4 py-4 flex items-center justify-between">
                <button 
                    onClick={() => navigate('/')}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200"
                >
                    <FaArrowLeft />
                </button>
                <h1 className="text-xl font-bold text-gray-800">My Dashboard</h1>
                <div className="w-10"></div>
            </div>

            {/* Profile Section */}
            <div className="p-6 bg-white mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        <FaUser />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{customer.name}</h2>
                        <p className="text-gray-500">{customer.phone}</p>
                    </div>
                </div>
                <button 
                    onClick={() => { logoutCustomer(); navigate('/'); }}
                    className="mt-4 w-full py-2 border-2 border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-colors"
                >
                    Logout
                </button>
            </div>

            {/* Recent Orders */}
            <div className="px-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaReceipt className="text-orange-500" />
                    Recent Bills
                </h3>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <FaSpinner className="animate-spin text-orange-500 text-3xl" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
                        <FaReceipt className="mx-auto text-4xl text-gray-300 mb-3" />
                        <p className="text-gray-500">No orders found</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="mt-4 text-orange-600 font-bold"
                        >
                            Start Ordering
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-bold text-gray-800">Order #{order.orderId?.slice(-6) || order._id.slice(-6)}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                </div>

                                <div className="border-t border-b border-gray-50 py-3 my-3 space-y-1">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{item.quantity} x {item.name}</span>
                                            <span className="font-medium">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Total Amount</span>
                                    <span className="text-lg font-bold text-gray-800">₹{order.totalAmount}</span>
                                </div>
                                
                                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                    <button 
                                        onClick={() => navigate('/order-success', { state: { orderId: order._id, orderDate: order.createdAt } })}
                                        className="mt-3 w-full py-2 bg-orange-50 text-orange-600 font-bold rounded-xl text-sm"
                                    >
                                        Track Order
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
};

export default UserDashboard;
