import React, { useState, useRef, useEffect } from 'react';
import { FaMapMarkerAlt, FaMicrophone, FaStop, FaBuilding, FaRoad, FaCity, FaMailBulk } from 'react-icons/fa';

const LocationPicker = ({ onLocationSelect, defaultLocation = { lat: 28.6139, lng: 77.2090 } }) => {
    const [detailedAddress, setDetailedAddress] = useState('');
    const [landmark, setLandmark] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [voiceField, setVoiceField] = useState(null);
    const recognitionRef = useRef(null);

    // Initialize Web Speech API
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-IN';
            
            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (voiceField === 'address') {
                    setDetailedAddress(prev => prev ? `${prev} ${transcript}` : transcript);
                } else if (voiceField === 'landmark') {
                    setLandmark(prev => prev ? `${prev} ${transcript}` : transcript);
                }
                setIsListening(false);
                setVoiceField(null);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                setVoiceField(null);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [voiceField]);

    const startVoiceInput = (field) => {
        if (recognitionRef.current) {
            setVoiceField(field);
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const stopVoiceInput = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            setVoiceField(null);
        }
    };

    const handleConfirm = () => {
        if (!detailedAddress.trim()) {
            alert('Please enter your full address');
            return;
        }
        
        onLocationSelect({
            coordinates: defaultLocation,
            address: `${detailedAddress}, ${landmark ? landmark + ', ' : ''}${city}, ${pincode}`.trim(),
            manualAddress: detailedAddress,
            landmark: landmark,
            city: city,
            pincode: pincode,
            details: { city, postcode: pincode }
        });
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-orange-500 to-orange-600">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <FaMapMarkerAlt />
                    Delivery Address
                </h3>
                <p className="text-orange-100 text-sm mt-1">
                    Please enter your full address for accurate delivery
                </p>
            </div>

            {/* Address Form */}
            <div className="p-5 space-y-4 flex-1 overflow-auto">
                {/* Info Box */}
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-800 flex items-center gap-2">
                        📍 <span className="font-medium">Please enter your complete delivery address</span>
                    </p>
                </div>

                {/* Detailed Address Input with Voice */}
                <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1 flex items-center gap-2">
                        <FaBuilding className="text-gray-400" />
                        Full Address *
                    </label>
                    <div className="relative">
                        <textarea 
                            value={detailedAddress}
                            onChange={(e) => setDetailedAddress(e.target.value)}
                            placeholder="House No, Floor, Building Name, Street, Area..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-12 text-base h-24 resize-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                        ></textarea>
                        <button
                            onClick={() => isListening && voiceField === 'address' ? stopVoiceInput() : startVoiceInput('address')}
                            className={`absolute right-3 top-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                isListening && voiceField === 'address'
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                            }`}
                            title="Speak your address"
                        >
                            {isListening && voiceField === 'address' ? <FaStop size={16} /> : <FaMicrophone size={16} />}
                        </button>
                    </div>
                    {isListening && voiceField === 'address' && (
                        <p className="text-xs text-orange-600 mt-1 animate-pulse">🎤 Listening... Speak now</p>
                    )}
                </div>

                {/* Landmark Input with Voice */}
                <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1 flex items-center gap-2">
                        <FaRoad className="text-gray-400" />
                        Landmark
                    </label>
                    <div className="relative">
                        <input 
                            type="text"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            placeholder="Near City Park, Opposite Mall..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-12 text-base focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                        />
                        <button
                            onClick={() => isListening && voiceField === 'landmark' ? stopVoiceInput() : startVoiceInput('landmark')}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                isListening && voiceField === 'landmark'
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                            }`}
                            title="Speak landmark"
                        >
                            {isListening && voiceField === 'landmark' ? <FaStop size={16} /> : <FaMicrophone size={16} />}
                        </button>
                    </div>
                    {isListening && voiceField === 'landmark' && (
                        <p className="text-xs text-orange-600 mt-1 animate-pulse">🎤 Listening... Speak now</p>
                    )}
                </div>

                {/* City and Pincode */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1 flex items-center gap-2">
                            <FaCity className="text-gray-400" />
                            City
                        </label>
                        <input 
                            type="text" 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Enter city"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-base focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1 flex items-center gap-2">
                            <FaMailBulk className="text-gray-400" />
                            Pincode
                        </label>
                        <input 
                            type="text"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            placeholder="Enter pincode"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-base focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                        />
                    </div>
                </div>

                <button
                    onClick={handleConfirm}
                    disabled={!detailedAddress.trim()}
                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-transform"
                >
                    Confirm & Save Address
                </button>
            </div>
        </div>
    );
};

export default LocationPicker;
