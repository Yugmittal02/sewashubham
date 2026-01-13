import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
    fetchAllOrders, updateOrderStatus, 
    fetchProducts, createProduct, updateProduct, deleteProduct, toggleProductAvailability,
    fetchAllOffersAdmin, createOffer, deleteOffer,
    fetchAllRatings
} from '../services/api';
import { 
    FaPlus, FaSignOutAlt, FaClipboardList, FaUtensils, FaGift, FaStar, 
    FaTrash, FaToggleOn, FaToggleOff, FaEdit, FaRupeeSign,
    FaClock, FaCheckCircle, FaSpinner, FaTruck, FaHome
} from 'react-icons/fa';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [offers, setOffers] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [showProductForm, setShowProductForm] = useState(false);
    const [showOfferForm, setShowOfferForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    
    const { admin, logoutAdmin, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/admin/login');
        }
    }, [isAdmin, navigate]);

    useEffect(() => {
        loadData();
        const interval = setInterval(() => {
            if (activeTab === 'orders') loadOrders();
        }, 10000);
        return () => clearInterval(interval);
    }, [activeTab]);

    const loadData = async () => {
        loadOrders();
        loadProducts();
        loadOffers();
        loadRatings();
    };

    const loadOrders = async () => {
        try {
            const { data } = await fetchAllOrders();
            setOrders(data);
        } catch (err) { console.error(err); }
    };

    const loadProducts = async () => {
        try {
            const { data } = await fetchProducts();
            setProducts(data);
        } catch (err) { console.error(err); }
    };

    const loadOffers = async () => {
        try {
            const { data } = await fetchAllOffersAdmin();
            setOffers(data);
        } catch (err) { console.error(err); }
    };

    const loadRatings = async () => {
        try {
            const { data } = await fetchAllRatings();
            setRatings(data);
        } catch (err) { console.error(err); }
    };

    const handleStatusChange = async (id, status) => {
        await updateOrderStatus(id, status);
        loadOrders();
    };

    const handleToggleAvailability = async (id) => {
        await toggleProductAvailability(id);
        loadProducts();
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Delete this product?')) {
            await deleteProduct(id);
            loadProducts();
        }
    };

    const handleDeleteOffer = async (id) => {
        if (window.confirm('Delete this offer?')) {
            await deleteOffer(id);
            loadOffers();
        }
    };

    const handleLogout = () => {
        logoutAdmin();
        navigate('/');
    };

    // Stats
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;

    const tabs = [
        { id: 'orders', icon: FaClipboardList, label: 'Orders', count: pendingOrders },
        { id: 'menu', icon: FaUtensils, label: 'Menu' },
        { id: 'offers', icon: FaGift, label: 'Offers' },
        { id: 'ratings', icon: FaStar, label: 'Reviews' }
    ];

    const statusConfig = {
        'Pending': { icon: FaClock, bg: 'bg-yellow-100', text: 'text-yellow-700' },
        'Preparing': { icon: FaSpinner, bg: 'bg-blue-100', text: 'text-blue-700' },
        'Ready': { icon: FaCheckCircle, bg: 'bg-green-100', text: 'text-green-700' },
        'Delivered': { icon: FaTruck, bg: 'bg-gray-100', text: 'text-gray-700' }
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-24">
            {/* Mobile Header */}
            <header className="bg-gray-900 text-white px-4 py-4 sticky top-0 z-40">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                            <FaUtensils className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight">Admin Panel</h1>
                            <p className="text-xs text-gray-400">{admin?.name}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-10 h-10 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center"
                    >
                        <FaSignOutAlt />
                    </button>
                </div>
            </header>

            {/* Stats Cards - Horizontal Scroll on Mobile */}
            <div className="p-4 overflow-x-auto">
                <div className="flex gap-3 min-w-max">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 min-w-[160px]">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                            <FaClipboardList className="text-xl text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Today</p>
                            <p className="text-xl font-black text-gray-800">{todayOrders.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 min-w-[160px]">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                            <FaRupeeSign className="text-xl text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Revenue</p>
                            <p className="text-xl font-black text-gray-800">₹{todayRevenue.toFixed(0)}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 min-w-[160px]">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl flex items-center justify-center">
                            <FaClock className="text-xl text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Pending</p>
                            <p className="text-xl font-black text-gray-800">{pendingOrders}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                        {orders.map(order => {
                            const config = statusConfig[order.status] || statusConfig['Pending'];
                            return (
                                <div key={order._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-gray-800">#{order._id.slice(-6).toUpperCase()}</p>
                                            <p className="text-xs text-gray-500">{order.user?.name} • {order.user?.phone}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{order.orderType} • {order.paymentMethod}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${config.bg} ${config.text}`}>
                                            <config.icon size={10} />
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3 mb-3 space-y-1">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-gray-700">{item.quantity}× {item.name}</span>
                                                <span className="text-gray-400 text-xs">{item.size || ''}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="font-bold text-orange-600 text-lg mb-3">₹{order.totalAmount?.toFixed(0)}</p>
                                    
                                    {/* Status Buttons - Scrollable on mobile */}
                                    <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                                        {['Pending', 'Preparing', 'Ready', 'Delivered'].map(status => (
                                            <button 
                                                key={status}
                                                onClick={() => handleStatusChange(order._id, status)}
                                                className={`flex-shrink-0 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                                                    order.status === status 
                                                        ? 'bg-gray-900 text-white' 
                                                        : 'bg-gray-100 text-gray-500 active:bg-gray-200'
                                                }`}
                                            >{status}</button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        {orders.length === 0 && (
                            <div className="text-center py-16 text-gray-400">
                                <FaClipboardList className="text-4xl mx-auto mb-2 opacity-50" />
                                <p>No orders yet</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Menu Tab */}
                {activeTab === 'menu' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Menu Items</h2>
                            <button 
                                onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow-lg shadow-orange-200"
                            >
                                <FaPlus size={12} /> Add
                            </button>
                        </div>
                        <div className="space-y-3">
                            {products.map(p => (
                                <div key={p._id} className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 ${!p.isAvailable ? 'opacity-60' : ''}`}>
                                    <div className="flex gap-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-xl bg-cover bg-center flex-shrink-0" style={{ backgroundImage: p.image ? `url(${p.image})` : 'none' }}>
                                            {!p.image && <span className="text-2xl flex items-center justify-center h-full">🍽️</span>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-800 truncate">{p.name}</p>
                                            <p className="text-xs text-gray-500">{p.category}</p>
                                            <p className="font-bold text-orange-600">₹{p.basePrice}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                        <button 
                                            onClick={() => handleToggleAvailability(p._id)} 
                                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${
                                                p.isAvailable 
                                                    ? 'bg-green-50 text-green-700' 
                                                    : 'bg-red-50 text-red-700'
                                            }`}
                                        >
                                            {p.isAvailable ? <><FaToggleOn /> In Stock</> : <><FaToggleOff /> Out</>}
                                        </button>
                                        <button 
                                            onClick={() => { setEditingProduct(p); setShowProductForm(true); }} 
                                            className="w-12 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteProduct(p._id)} 
                                            className="w-12 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Offers Tab */}
                {activeTab === 'offers' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Offers</h2>
                            <button 
                                onClick={() => setShowOfferForm(true)}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow-lg shadow-orange-200"
                            >
                                <FaPlus size={12} /> Add
                            </button>
                        </div>
                        <div className="space-y-3">
                            {offers.map(o => (
                                <div key={o._id} className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-5 rounded-2xl shadow-lg">
                                    <p className="text-xs font-bold uppercase opacity-80">{o.title}</p>
                                    <p className="text-2xl font-black mt-1">{o.discountType === 'percentage' ? `${o.discountValue}%` : `₹${o.discountValue}`} OFF</p>
                                    <p className="text-sm opacity-90 mt-1 line-clamp-1">{o.description}</p>
                                    <div className="mt-3 flex justify-between items-center">
                                        <span className="bg-white/20 px-3 py-1.5 rounded-lg text-sm font-mono font-bold">{o.code}</span>
                                        <button 
                                            onClick={() => handleDeleteOffer(o._id)} 
                                            className="bg-white/20 p-2.5 rounded-lg active:bg-white/30"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Ratings Tab */}
                {activeTab === 'ratings' && (
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Reviews</h2>
                        <div className="space-y-3">
                            {ratings.map(r => (
                                <div key={r._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800">{r.customer?.name}</p>
                                            <p className="text-xs text-gray-500">{r.product?.name}</p>
                                            <p className="text-sm text-gray-600 mt-2">{r.comment}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full ml-3">
                                            <FaStar className="text-amber-500" size={12} />
                                            <span className="font-bold text-sm">{r.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {ratings.length === 0 && (
                                <div className="text-center py-16 text-gray-400">
                                    <FaStar className="text-4xl mx-auto mb-2 opacity-50" />
                                    <p>No reviews yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <div className="flex justify-around">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl min-w-[70px] transition-all ${
                                activeTab === tab.id 
                                    ? 'bg-orange-50 text-orange-600' 
                                    : 'text-gray-400'
                            }`}
                        >
                            <div className="relative">
                                <tab.icon size={20} />
                                {tab.count > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {tab.count}
                                    </span>
                                )}
                            </div>
                            <span className={`text-xs mt-1 font-medium ${activeTab === tab.id ? 'font-bold' : ''}`}>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Product Form Modal */}
            {showProductForm && (
                <ProductFormModal 
                    product={editingProduct}
                    onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
                    onSave={() => { loadProducts(); setShowProductForm(false); setEditingProduct(null); }}
                />
            )}

            {/* Offer Form Modal */}
            {showOfferForm && (
                <OfferFormModal 
                    onClose={() => setShowOfferForm(false)}
                    onSave={() => { loadOffers(); setShowOfferForm(false); }}
                />
            )}
        </div>
    );
};

// Product Form Modal Component - Mobile Optimized with Image Upload
const ProductFormModal = ({ product, onClose, onSave }) => {
    const [form, setForm] = useState({
        name: product?.name || '',
        description: product?.description || '',
        category: product?.category || '',
        basePrice: product?.basePrice || '',
        image: product?.image || '',
        sizes: product?.sizes || [],
        addons: product?.addons || []
    });
    const [newSize, setNewSize] = useState({ name: '', price: '' });
    const [newAddon, setNewAddon] = useState({ name: '', price: '' });
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            
            const { uploadImage } = await import('../services/api');
            const { data } = await uploadImage(formData);
            
            setForm({ ...form, image: data.url });
        } catch (err) {
            console.error('Upload error:', err);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (product) {
                await updateProduct(product._id, form);
            } else {
                await createProduct(form);
            }
            onSave();
        } catch (err) {
            alert('Error saving product');
        }
    };

    const addSize = () => {
        if (newSize.name && newSize.price) {
            setForm({ ...form, sizes: [...form.sizes, { name: newSize.name, price: Number(newSize.price) }] });
            setNewSize({ name: '', price: '' });
        }
    };

    const addAddon = () => {
        if (newAddon.name && newAddon.price) {
            setForm({ ...form, addons: [...form.addons, { name: newAddon.name, price: Number(newAddon.price) }] });
            setNewAddon({ name: '', price: '' });
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center">
            <div className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                    <h3 className="text-xl font-bold text-gray-800">{product ? 'Edit' : 'Add'} Product</h3>
                    <button onClick={onClose} className="text-gray-400 text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 overflow-y-auto max-h-[70vh] space-y-4">
                    <input type="text" placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-base" required />
                    <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-base" />
                    <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-base" required />
                    <input type="number" placeholder="Base Price" value={form.basePrice} onChange={e => setForm({...form, basePrice: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-base" required />
                    
                    {/* Image Upload */}
                    <div>
                        <p className="text-sm font-bold text-gray-700 mb-2">Product Image</p>
                        <div className="flex gap-3 items-center">
                            {form.image ? (
                                <div className="w-20 h-20 rounded-xl bg-cover bg-center border-2 border-gray-200" style={{ backgroundImage: `url(${form.image})` }}></div>
                            ) : (
                                <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-3xl border-2 border-dashed border-gray-300">📷</div>
                            )}
                            <label className="flex-1">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageUpload}
                                    className="hidden" 
                                />
                                <div className={`w-full py-3.5 rounded-xl font-bold text-center cursor-pointer transition-all active:scale-95 ${
                                    uploading 
                                        ? 'bg-gray-200 text-gray-500' 
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200'
                                }`}>
                                    {uploading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                                            Uploading...
                                        </span>
                                    ) : (
                                        form.image ? '📷 Change Image' : '📷 Upload Image'
                                    )}
                                </div>
                            </label>
                        </div>
                        {form.image && (
                            <button 
                                type="button" 
                                onClick={() => setForm({...form, image: ''})}
                                className="text-red-500 text-sm font-medium mt-2"
                            >
                                Remove Image
                            </button>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-700 mb-2">Sizes</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {form.sizes.map((s, i) => (
                                <span key={i} className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-sm">{s.name}: ₹{s.price}</span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input placeholder="Size" value={newSize.name} onChange={e => setNewSize({...newSize, name: e.target.value})} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" />
                            <input type="number" placeholder="₹" value={newSize.price} onChange={e => setNewSize({...newSize, price: e.target.value})} className="w-20 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" />
                            <button type="button" onClick={addSize} className="bg-gray-200 px-4 rounded-xl font-bold active:bg-gray-300">+</button>
                        </div>
                    </div>

                    {/* Addons */}
                    <div>
                        <p className="text-sm font-bold text-gray-700 mb-2">Add-ons</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {form.addons.map((a, i) => (
                                <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm">{a.name}: ₹{a.price}</span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input placeholder="Name" value={newAddon.name} onChange={e => setNewAddon({...newAddon, name: e.target.value})} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" />
                            <input type="number" placeholder="₹" value={newAddon.price} onChange={e => setNewAddon({...newAddon, price: e.target.value})} className="w-20 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" />
                            <button type="button" onClick={addAddon} className="bg-gray-200 px-4 rounded-xl font-bold active:bg-gray-300">+</button>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
                        <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 active:bg-gray-50">Cancel</button>
                        <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200">Save</button>
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
            `}</style>
        </div>
    );
};

// Offer Form Modal Component - Mobile Optimized
const OfferFormModal = ({ onClose, onSave }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        code: '',
        validTo: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createOffer(form);
            onSave();
        } catch (err) {
            alert('Error creating offer');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center">
            <div className="bg-white w-full rounded-t-3xl shadow-2xl animate-slide-up">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">Create Offer</h3>
                    <button onClick={onClose} className="text-gray-400 text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <input type="text" placeholder="Offer Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-base" required />
                    <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-base" />
                    <select value={form.discountType} onChange={e => setForm({...form, discountType: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-base">
                        <option value="percentage">Percentage (%)</option>
                        <option value="flat">Flat Amount (₹)</option>
                    </select>
                    <input type="number" placeholder="Discount Value" value={form.discountValue} onChange={e => setForm({...form, discountValue: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-base" required />
                    <input type="text" placeholder="Coupon Code" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 uppercase text-base" required />
                    <input type="date" value={form.validTo} onChange={e => setForm({...form, validTo: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-base" />
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600">Cancel</button>
                        <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200">Create</button>
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
