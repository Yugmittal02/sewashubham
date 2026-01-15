import React, { useState, useEffect } from 'react';
import { FaTimes, FaLock, FaMobileAlt, FaQrcode, FaExternalLinkAlt, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { getUPISettings } from '../services/api';

// UPI App configurations with deep link schemes
const UPI_APPS = [
    {
        id: 'gpay',
        name: 'Google Pay',
        icon: '💳',
        color: 'from-blue-500 to-blue-600',
        scheme: 'tez://upi/pay',
        fallbackScheme: 'gpay://upi/pay',
        packageName: 'com.google.android.apps.nbu.paisa.user',
        bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
        id: 'phonepe',
        name: 'PhonePe',
        icon: '📱',
        color: 'from-purple-500 to-purple-700',
        scheme: 'phonepe://pay',
        packageName: 'com.phonepe.app',
        bgColor: 'bg-gradient-to-br from-purple-500 to-purple-700'
    },
    {
        id: 'paytm',
        name: 'Paytm',
        icon: '💰',
        color: 'from-sky-400 to-sky-600',
        scheme: 'paytmmp://pay',
        packageName: 'net.one97.paytm',
        bgColor: 'bg-gradient-to-br from-sky-400 to-sky-600'
    },
    {
        id: 'bhim',
        name: 'BHIM UPI',
        icon: '🏦',
        color: 'from-orange-500 to-orange-600',
        scheme: 'upi://pay',
        packageName: 'in.org.npci.upiapp',
        bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600'
    }
];

const UPIPaymentModal = ({ isOpen, onClose, amount, orderDetails, onPaymentInitiated }) => {
    const [selectedApp, setSelectedApp] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    
    // UPI settings from API (with env fallback)
    const [upiConfig, setUpiConfig] = useState({
        upiId: import.meta.env.VITE_UPI_ID || '',
        merchantName: import.meta.env.VITE_MERCHANT_NAME || 'Store',
        CURRENCY: 'INR',
        isConfigured: false
    });

    useEffect(() => {
        // Detect if user is on mobile
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
        };
        setIsMobile(checkMobile());
        
        // Fetch UPI settings from API
        const loadUPISettings = async () => {
            try {
                const { data } = await getUPISettings();
                if (data.upiId) {
                    setUpiConfig({
                        upiId: data.upiId,
                        merchantName: data.merchantName || 'Store',
                        CURRENCY: 'INR',
                        isConfigured: !!data.upiId
                    });
                }
            } catch (err) {
                // Fallback to env vars if API fails
                // console.log('Using env UPI settings');
            }
        };
        
        if (isOpen) {
            loadUPISettings();
        }
    }, [isOpen]);

    // Generate UPI deep link URL
    const generateUPILink = (appScheme = 'upi://pay') => {
        // Use simple string format - no encoding for UPI ID
        // UPI URL format: upi://pay?pa=<VPA>&pn=<NAME>&am=<AMOUNT>&cu=INR
        const upiId = upiConfig.upiId.trim();
        const merchantName = upiConfig.merchantName.replace(/\s+/g, '%20');
        const amountStr = amount.toFixed(2);
        const txnNote = `Order%20${orderDetails?.orderId || 'Payment'}`;

        // Build minimal UPI URL string directly
        const upiUrl = `upi://pay?pa=${upiId}&pn=${merchantName}&am=${amountStr}&cu=INR&tn=${txnNote}`;
        
        return upiUrl;
    };

    // Handle UPI app selection and payment initiation
    const handleAppSelect = (app) => {
        if (!upiConfig.isConfigured) {
            alert('⚠️ UPI payment is not configured. Please contact the store owner.');
            return;
        }

        setSelectedApp(app.id);
        setIsProcessing(true);

        // Generate the UPI link
        const upiLink = generateUPILink(app.scheme);

        // Try to open the UPI app
        const link = document.createElement('a');
        link.href = upiLink;
        link.click();

        // Notify parent component
        if (onPaymentInitiated) {
            onPaymentInitiated({
                app: app.name,
                amount: amount,
                upiLink: upiLink
            });
        }

        // Reset after a delay
        setTimeout(() => {
            setIsProcessing(false);
            setSelectedApp(null);
        }, 3000);
    };

    // Open any UPI app (uses device's native app picker)
    const handleOpenAnyUPIApp = () => {
        if (!upiConfig.isConfigured) {
            alert('⚠️ UPI payment is not configured. Please contact the store owner.');
            return;
        }

        const upiLink = generateUPILink('upi://pay');
        window.location.href = upiLink;

        if (onPaymentInitiated) {
            onPaymentInitiated({
                app: 'Any UPI App',
                amount: amount,
                upiLink: upiLink
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
                {/* Header */}
                <div className="sticky top-0 bg-white px-6 py-5 border-b border-gray-100 rounded-t-3xl z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {showQRCode && (
                                <button
                                    onClick={() => setShowQRCode(false)}
                                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                                >
                                    <FaArrowLeft size={16} />
                                </button>
                            )}
                            <div>
                                <h2 className="text-xl font-black text-gray-800">
                                    {showQRCode ? 'Scan QR Code' : 'Pay with UPI'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {showQRCode ? 'Scan with any UPI app' : 'Choose your UPI app'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>
                </div>

                {/* Amount Display - Locked */}
                <div className="px-6 py-5">
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border-2 border-orange-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-orange-600 font-medium mb-1">Amount to Pay</p>
                                <p className="text-4xl font-black text-gray-900">₹{amount.toFixed(0)}</p>
                            </div>
                            <div className="flex items-center gap-2 bg-orange-500/10 text-orange-600 px-3 py-1.5 rounded-full">
                                <FaLock size={12} />
                                <span className="text-xs font-bold">FIXED</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                            <FaMobileAlt size={10} />
                            Amount is pre-filled and cannot be changed
                        </p>
                    </div>
                </div>

                {/* QR Code View */}
                {showQRCode ? (
                    <div className="px-6 pb-6">
                        {/* QR Code Display */}
                        <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 flex flex-col items-center shadow-lg">
                            <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-4 rounded-2xl shadow-xl">
                                <div className="bg-white p-3 rounded-xl">
                                    <QRCodeSVG
                                        value={generateUPILink('upi://pay')}
                                        size={200}
                                        level="H"
                                        includeMargin={false}
                                        bgColor="#ffffff"
                                        fgColor="#1a1a1a"
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-5 text-center">
                                <p className="font-bold text-gray-800 text-lg">Scan to Pay</p>
                                <p className="text-sm text-gray-500 mt-1">Open any UPI app and scan this QR code</p>
                            </div>

                            {/* Configuration Warning */}
                            {!upiConfig.isConfigured && (
                                <div className="mt-4 w-full bg-amber-50 border border-amber-200 rounded-2xl p-3">
                                    <p className="text-xs text-amber-700 text-center font-medium">
                                        ⚠️ UPI ID not configured - Update in Admin Settings
                                    </p>
                                </div>
                            )}

                            {/* Merchant Info */}
                            <div className="mt-4 w-full bg-gray-50 rounded-2xl p-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Pay to</span>
                                    <span className="font-bold text-gray-800">{upiConfig.merchantName}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-2">
                                    <span className="text-gray-500">Amount</span>
                                    <span className="font-bold text-orange-600">₹{amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-2">
                                    <span className="text-gray-500">UPI ID</span>
                                    <span className="font-mono text-xs text-gray-600">{upiConfig.upiId}</span>
                                </div>
                            </div>

                            {/* Supported Apps */}
                            <div className="mt-4 flex items-center gap-2 text-gray-400">
                                <span className="text-2xl">💳</span>
                                <span className="text-2xl">📱</span>
                                <span className="text-2xl">💰</span>
                                <span className="text-2xl">🏦</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Works with all UPI apps</p>
                        </div>

                        {/* Download QR Option */}
                        <button
                            onClick={() => {
                                // Create downloadable QR
                                const svg = document.querySelector('.qr-download-target svg');
                                if (svg) {
                                    const svgData = new XMLSerializer().serializeToString(svg);
                                    const canvas = document.createElement('canvas');
                                    const ctx = canvas.getContext('2d');
                                    const img = new Image();
                                    img.onload = () => {
                                        canvas.width = img.width;
                                        canvas.height = img.height;
                                        ctx.fillStyle = 'white';
                                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                                        ctx.drawImage(img, 0, 0);
                                        const link = document.createElement('a');
                                        link.download = `payment-qr-${amount}.png`;
                                        link.href = canvas.toDataURL();
                                        link.click();
                                    };
                                    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                                }
                            }}
                            className="w-full mt-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                        >
                            📥 Download QR Code
                        </button>

                        {/* Hidden QR for download */}
                        <div className="qr-download-target hidden">
                            <QRCodeSVG
                                value={generateUPILink('upi://pay')}
                                size={400}
                                level="H"
                                includeMargin={true}
                                bgColor="#ffffff"
                                fgColor="#1a1a1a"
                            />
                        </div>
                    </div>
                ) : (
                    <>

                {/* UPI Apps Grid */}
                <div className="px-6 pb-4">
                    <p className="text-sm font-bold text-gray-700 mb-3">Select UPI App</p>
                    <div className="grid grid-cols-2 gap-3">
                        {UPI_APPS.map((app) => (
                            <button
                                key={app.id}
                                onClick={() => handleAppSelect(app)}
                                disabled={isProcessing}
                                className={`relative p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                                    selectedApp === app.id
                                        ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-100'
                                        : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className={`w-14 h-14 ${app.bgColor} rounded-2xl flex items-center justify-center text-2xl mb-3 mx-auto shadow-lg`}>
                                    {app.icon}
                                </div>
                                <p className="text-sm font-bold text-gray-800 text-center">{app.name}</p>
                                {selectedApp === app.id && isProcessing && (
                                    <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Open Any UPI App Button */}
                <div className="px-6 pb-6">
                    <button
                        onClick={handleOpenAnyUPIApp}
                        disabled={isProcessing}
                        className="w-full py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-transform shadow-lg disabled:opacity-50"
                    >
                        <FaExternalLinkAlt size={16} />
                        Open Any UPI App
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-3">
                        This will open your device's UPI app picker
                    </p>
                </div>

                        {/* Show QR Code Button */}
                        <div className="px-6 pb-4">
                            <button
                                onClick={() => setShowQRCode(true)}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-transform shadow-lg"
                            >
                                <FaQrcode size={18} />
                                Show QR Code
                            </button>
                            <p className="text-xs text-gray-400 text-center mt-2">
                                Scan QR code with any UPI app to pay
                            </p>
                        </div>

                        {/* Supported Apps Info */}
                        <div className="px-6 pb-6">
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <p className="text-xs text-gray-500 text-center">
                                    Supports all UPI apps including GPay, PhonePe, Paytm, BHIM, Amazon Pay, WhatsApp Pay & more
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* CSS Animation */}
            <style>{`
                @keyframes slide-up {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default UPIPaymentModal;
