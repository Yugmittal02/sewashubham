import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createOrder, validateCoupon, registerCustomer } from '../services/api';
import { FaTrash, FaArrowLeft, FaMinus, FaPlus, FaTag, FaMoneyBillWave, FaMobileAlt, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';
import UPIPaymentModal from '../components/UPIPaymentModal';
import CustomerEntry from '../components/CustomerEntry';
import LocationPicker from '../components/LocationPicker';
import Footer from '../components/Footer';

const Cart = () => {
    const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
    const { customer, logoutCustomer } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponApplied, setCouponApplied] = useState(null);
    const [orderType, setOrderType] = useState('Dine-in');
    
    // Debugging
    // console.log('Cart Render - Customer:', customer);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [showUPIModal, setShowUPIModal] = useState(false);
    const [showCustomerEntry, setShowCustomerEntry] = useState(false);
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState(null);

    const TAX_RATE = 0.05;
    const PLATFORM_FEE = 0.98;

    const subtotal = total;
    const tax = subtotal * TAX_RATE;
    const grandTotal = subtotal + tax + PLATFORM_FEE - discount;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        try {
            const { data } = await validateCoupon(couponCode, subtotal);
            setDiscount(data.discount);
            setCouponApplied(data.offer);
        } catch (err) {
            alert(err.response?.data?.message || 'Invalid coupon');
            setDiscount(0);
            setCouponApplied(null);
        }
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        
        if (!customer || !customer.name || !customer.phone) {
            setShowCustomerEntry(true);
            return;
        }

        // Check for delivery address if order type is Delivery
        if (orderType === 'Delivery' && !deliveryAddress) {
            setShowLocationPicker(true);
            return;
        }

        // If UPI is selected, show the UPI modal instead of direct checkout
        if (paymentMethod === 'UPI') {
            setShowUPIModal(true);
            return;
        }
        
        await processOrder();
    };

    // Process the order (called after payment method selection)
    const processOrder = async () => {
        // Validate customer data before processing
        if (!customer || !customer.name || !customer.phone) {
            // Show customer entry modal instead of redirecting
            setShowCustomerEntry(true);
            return;
        }
        
        setLoading(true);
        
        try {
            const customerRes = await registerCustomer({ name: customer.name, phone: customer.phone });
            const userId = customerRes.data.user._id;
            
            const orderData = {
                user: userId,
                items: cart.map(item => ({
                    product: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    size: item.size,
                    addons: item.selectedAddons,
                    price: item.price * item.quantity
                })),
                totalAmount: grandTotal,
                paymentMethod,
                orderType,
                deliveryAddress: orderType === 'Delivery' ? deliveryAddress : undefined
            };
            
            
            const response = await createOrder(orderData);
            clearCart();
            navigate('/order-success', { 
                state: { 
                    customerName: customer.name,
                    orderDate: new Date().toISOString(),
                    orderId: response.data._id
                } 
            });
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message;
            const validationErrors = error.response?.data?.errors;
            
            let displayMsg = 'Failed to place order. Please try again.';
            if (msg) {
                displayMsg = msg;
                if (validationErrors && Array.isArray(validationErrors)) {
                    displayMsg += `:\n• ${validationErrors.join('\n• ')}`;
                }
            } else if (error.message) {
                displayMsg = error.message;
            }
            
            // If validation failed (400), clear stored customer data so they can re-enter correct details
            if (error.response?.status === 400) {
                logoutCustomer();
            }
            
            alert(displayMsg);
        } finally {
            setLoading(false);
        }
    };

    // Handle UPI payment initiation
    const handleUPIPaymentInitiated = (paymentInfo) => {
        console.log('UPI Payment initiated:', paymentInfo);
        // After user initiates UPI payment, process the order
        // The actual payment confirmation would come from the UPI app
        processOrder();
    };

    const paymentMethods = [
        { id: 'Cash', label: 'Cash on Delivery', icon: FaMoneyBillWave, desc: 'Pay when order arrives' },
        { id: 'UPI', label: 'UPI Payment', icon: FaMobileAlt, desc: 'GPay • PhonePe • Paytm' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/30 pb-48">
            {/* Header */}
            <header className="bg-white/95 backdrop-blur-xl px-4 py-4 shadow-sm border-b border-gray-100 flex justify-between items-center sticky top-0 z-10 safe-area-top">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 active:scale-95 active:bg-gray-200 transition-all"
                    >
                        <FaArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-gray-800">Your Cart</h1>
                        <p className="text-sm text-gray-500">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
                {customer && (
                    <div className="flex flex-col items-end">
                        <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Ordering as</div>
                        <div className="flex items-center gap-2 bg-orange-50 pl-3 pr-1 py-1 rounded-lg border border-orange-100">
                            <span className="text-xs font-bold text-orange-800 max-w-[80px] truncate">{customer.name}</span>
                            <button 
                                onClick={logoutCustomer}
                                className="w-5 h-5 flex items-center justify-center bg-white rounded-md text-orange-500 shadow-sm"
                            >
                                <span className="text-[10px] font-bold">✕</span>
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Order Type Toggle - Large Touch */}
            <div className="mx-4 mt-4">
                <div className="bg-white p-1.5 rounded-2xl flex shadow-sm border border-gray-100">
                    {['Dine-in', 'Takeaway', 'Delivery'].map(type => (
                        <button
                            key={type}
                            onClick={() => setOrderType(type)}
                            className={`flex-1 h-12 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                                orderType === type 
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200/50' 
                                    : 'text-gray-500 active:bg-gray-50'
                            }`}
                        >{type}</button>
                    ))}
                </div>
            </div>

            {/* Cart Items - Large Touch Targets */}
            <div className="p-4 space-y-4">
                {cart.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-7xl mb-4">🛒</p>
                        <p className="text-gray-500 font-medium text-lg">Your cart is empty</p>
                        <button 
                            onClick={() => navigate('/menu')}
                            className="mt-6 bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl active:scale-95 transition-transform"
                        >
                            Browse Menu →
                        </button>
                    </div>
                ) : (
                    cart.map(item => (
                        <div key={item.cartId} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex gap-4">
                                {/* Item Info */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {item.size && (
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">{item.size}</span>
                                        )}
                                        {item.selectedAddons?.map((addon, idx) => (
                                            <span key={idx} className="text-xs bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg font-medium">+{addon}</span>
                                        ))}
                                    </div>
                                    <p className="text-orange-600 font-black text-xl mt-2">₹{item.price}</p>
                                </div>
                                
                                {/* Delete Button */}
                                <button 
                                    onClick={() => removeFromCart(item.cartId)}
                                    className="w-12 h-12 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl flex items-center justify-center active:scale-90 transition-all"
                                >
                                    <FaTrash size={18} />
                                </button>
                            </div>
                            
                            {/* Quantity Controls - Large */}
                            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                                <button 
                                    onClick={() => updateQuantity(item.cartId, -1)}
                                    className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center active:scale-90 active:bg-gray-200 transition-all"
                                >
                                    <FaMinus size={14} />
                                </button>
                                <span className="font-black text-2xl w-10 text-center">{item.quantity}</span>
                                <button 
                                    onClick={() => updateQuantity(item.cartId, 1)}
                                    className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 rounded-2xl flex items-center justify-center active:scale-90 active:from-orange-500 active:to-orange-600 active:text-white transition-all"
                                >
                                    <FaPlus size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {cart.length > 0 && (
                <>
                    {/* Coupon - Large Input */}
                    <div className="mx-4 mb-4">
                        <div className="bg-white rounded-3xl p-2 flex gap-2 shadow-sm border border-gray-100">
                            <div className="flex-1 flex items-center gap-3 px-4 bg-gray-50 rounded-2xl min-h-[56px]">
                                <FaTag className="text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="Coupon code"
                                    className="flex-1 bg-transparent outline-none text-base font-bold uppercase placeholder:normal-case placeholder:font-medium placeholder:text-gray-400"
                                />
                            </div>
                            <button 
                                onClick={handleApplyCoupon}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-6 rounded-2xl active:scale-95 transition-transform min-h-[56px]"
                            >
                                Apply
                            </button>
                        </div>
                        {couponApplied && (
                            <div className="flex items-center gap-2 mt-3 text-green-600 font-bold text-sm bg-green-50 px-4 py-3 rounded-2xl">
                                <FaCheckCircle />
                                <span>{couponApplied.title} — You save ₹{discount.toFixed(0)}!</span>
                            </div>
                        )}
                    </div>

                    {/* Payment Methods - Large Touch Cards */}
                    <div className="mx-4 mb-4">
                        <h3 className="font-bold text-gray-800 text-base mb-3">Payment Method</h3>
                        <div className="space-y-3">
                            {paymentMethods.map(method => (
                                <button
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`w-full p-5 rounded-3xl border-2 flex items-center gap-4 transition-all active:scale-[0.98] ${
                                        paymentMethod === method.id 
                                            ? 'border-orange-500 bg-orange-50' 
                                            : 'border-gray-200 bg-white'
                                    }`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                                        paymentMethod === method.id 
                                            ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' 
                                            : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        <method.icon size={24} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-bold text-gray-800 text-base">{method.label}</p>
                                        <p className="text-sm text-gray-500">{method.desc}</p>
                                    </div>
                                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                                        paymentMethod === method.id 
                                            ? 'border-orange-500 bg-orange-500' 
                                            : 'border-gray-300'
                                    }`}>
                                        {paymentMethod === method.id && (
                                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bill Summary */}
                    <div className="mx-4 bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 text-base mb-4">🧾 Bill Details</h3>
                        <div className="space-y-3 text-base">
                            <div className="flex justify-between text-gray-600">
                                <span>Item Total</span>
                                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>GST (5%)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Platform Fee</span>
                                <span>₹{PLATFORM_FEE.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600 font-semibold">
                                    <span>Discount</span>
                                    <span>- ₹{discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="border-t-2 border-dashed border-gray-200 pt-4 mt-4">
                                <div className="flex justify-between text-xl font-black text-gray-900">
                                    <span>To Pay</span>
                                    <span className="text-orange-600">₹{grandTotal.toFixed(0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Checkout Button - Fixed, Large & Prominent */}
            {cart.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-gray-100 safe-area-bottom">
                    <button 
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full h-16 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-orange-300/50 active:scale-[0.98] transition-all flex justify-between items-center px-6 disabled:opacity-50"
                    >
                        <div className="flex items-center gap-3">
                            {paymentMethod === 'UPI' ? <FaMobileAlt size={22} /> : <FaMoneyBillWave size={22} />}
                            <span>{loading ? 'Placing Order...' : `Pay via ${paymentMethod}`}</span>
                        </div>
                        <span className="bg-white/25 px-5 py-2 rounded-xl font-black text-xl">₹{grandTotal.toFixed(0)}</span>
                    </button>
                </div>
            )}

            {/* UPI Payment Modal */}
            <UPIPaymentModal
                isOpen={showUPIModal}
                onClose={() => setShowUPIModal(false)}
                amount={grandTotal}
                orderDetails={{ orderId: `ORD-${Date.now()}` }}
                onPaymentInitiated={handleUPIPaymentInitiated}
            />

            {/* Customer Entry Modal */}
            {showCustomerEntry && (
                <div className="relative z-[100]">
                    <CustomerEntry onClose={() => setShowCustomerEntry(false)} />
                </div>
            )}

            {/* Location Picker Modal */}
            {showLocationPicker && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end justify-center sm:items-center p-0 sm:p-4">
                    <div className="bg-white w-full h-[90vh] sm:h-auto sm:max-w-md sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-orange-500" />
                                Delivery Location
                            </h3>
                            <button onClick={() => setShowLocationPicker(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 font-bold">
                                &times;
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <LocationPicker 
                                onLocationSelect={(addressData) => {
                                    setDeliveryAddress(addressData);
                                    setShowLocationPicker(false);
                                    // Continue checkout after small delay
                                    setTimeout(() => handleCheckout(), 100);
                                }} 
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Custom CSS */}
            <style>{`
                .safe-area-top { padding-top: env(safe-area-inset-top); }
                .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
                @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
            `}</style>
            
            <Footer />
        </div>
    );
};

export default Cart;
