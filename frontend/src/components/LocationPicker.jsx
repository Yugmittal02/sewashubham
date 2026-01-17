import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { FaLocationArrow, FaMapMarkerAlt, FaMicrophone, FaStop, FaBuilding, FaRoad } from 'react-icons/fa';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update map center when coordinates change
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, map.getZoom());
    }, [center, map]);
    return null;
};

// Component to handle map clicks/drags
const DraggableMarker = ({ position, setPosition, onAddressFound }) => {
    const markerRef = useRef(null);
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        }
    });

    useEffect(() => {
        // Reverse geocoding when position changes
        const timer = setTimeout(async () => {
            try {
                const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&addressdetails=1`);
                onAddressFound(data);
            } catch (err) {
                console.error('Geocoding error:', err);
            }
        }, 1000); // 1s debounce
        return () => clearTimeout(timer);
    }, [position, onAddressFound]);

    return (
        <Marker
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    setPosition(position);
                },
            }}
            position={position}
            ref={markerRef}
        />
    );
};

const LocationPicker = ({ onLocationSelect, defaultLocation = { lat: 28.6139, lng: 77.2090 } }) => {
    const [position, setPosition] = useState(defaultLocation);
    const [address, setAddress] = useState({
        display_name: '',
        details: {}
    });
    const [detailedAddress, setDetailedAddress] = useState('');
    const [landmark, setLandmark] = useState('');
    const [loading, setLoading] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceField, setVoiceField] = useState(null); // 'address' or 'landmark'
    const recognitionRef = useRef(null);

    // Initialize Web Speech API
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-IN'; // Hindi-English mix support
            
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
                setVoiceField(null);
            };
        }
    }, [voiceField]);

    // Start voice input
    const startVoiceInput = (field) => {
        if (!recognitionRef.current) {
            alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
            return;
        }
        setVoiceField(field);
        setIsListening(true);
        recognitionRef.current.start();
    };

    // Stop voice input
    const stopVoiceInput = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
        setVoiceField(null);
    };

    // Parse address components from geocoding response
    const parseAddressComponents = (data) => {
        const addr = data.address || {};
        const parts = [];
        
        // Building/house number
        if (addr.house_number) parts.push(addr.house_number);
        if (addr.building) parts.push(addr.building);
        if (addr.amenity) parts.push(addr.amenity);
        
        // Road/street
        if (addr.road) parts.push(addr.road);
        if (addr.street) parts.push(addr.street);
        
        // Neighbourhood/suburb
        if (addr.neighbourhood) parts.push(addr.neighbourhood);
        if (addr.suburb) parts.push(addr.suburb);
        
        return parts.join(', ');
    };

    // Parse landmark from geocoding response
    const parseLandmark = (data) => {
        const addr = data.address || {};
        const landmarks = [];
        
        if (addr.amenity) landmarks.push(`Near ${addr.amenity}`);
        if (addr.shop) landmarks.push(`Near ${addr.shop}`);
        if (addr.tourism) landmarks.push(`Near ${addr.tourism}`);
        if (addr.leisure) landmarks.push(`Near ${addr.leisure}`);
        if (addr.locality && !landmarks.length) landmarks.push(addr.locality);
        if (addr.neighbourhood && !landmarks.length) landmarks.push(addr.neighbourhood);
        
        return landmarks[0] || '';
    };

    // Get current location
    const handleGetCurrentLocation = () => {
        setGpsLoading(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition({ lat: latitude, lng: longitude });
                    setGpsLoading(false);
                },
                (err) => {
                    console.error('Geolocation error:', err);
                    alert('Could not get your location. Please check permissions.');
                    setGpsLoading(false);
                },
                { enableHighAccuracy: true }
            );
        } else {
            alert('Geolocation is not supported by your browser');
            setGpsLoading(false);
        }
    };

    // Handle address confirmation
    const handleConfirm = () => {
        onLocationSelect({
            coordinates: position,
            address: address.display_name,
            manualAddress: detailedAddress,
            landmark: landmark,
            pincode: address.address?.postcode || '',
            details: address.address
        });
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden">
            {/* Map Section */}
            <div className="relative h-[300px] w-full bg-gray-100">
                <MapContainer center={position} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapUpdater center={position} />
                    <DraggableMarker 
                        position={position} 
                        setPosition={setPosition} 
                        onAddressFound={(data) => {
                            setAddress({
                                display_name: data.display_name,
                                address: data.address
                            });
                            // Auto-fill detailed address
                            const parsedAddress = parseAddressComponents(data);
                            if (parsedAddress && !detailedAddress) {
                                setDetailedAddress(parsedAddress);
                            }
                            // Auto-fill landmark
                            const parsedLandmark = parseLandmark(data);
                            if (parsedLandmark && !landmark) {
                                setLandmark(parsedLandmark);
                            }
                        }}
                    />
                </MapContainer>

                {/* GPS Button */}
                <button
                    onClick={handleGetCurrentLocation}
                    className="absolute bottom-4 right-4 z-[400] bg-white p-3 rounded-full shadow-lg text-orange-600 active:scale-90 transition-transform"
                    title="Use my location"
                >
                    {gpsLoading ? (
                        <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <FaLocationArrow size={20} />
                    )}
                </button>
            </div>

            {/* Address Details Form */}
            <div className="p-5 space-y-4">
                <div>
                    <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-orange-500" />
                        Confirm Location
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                        {address.display_name || 'Drag pin to select location'}
                    </p>
                </div>

                {/* Detailed Address Input with Voice */}
                <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1 flex items-center gap-2">
                        <FaBuilding className="text-gray-400" />
                        Detailed Address
                    </label>
                    <div className="relative">
                        <textarea 
                            value={detailedAddress}
                            onChange={(e) => setDetailedAddress(e.target.value)}
                            placeholder="House No, Floor, Building Name, Street..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-12 text-base h-20 resize-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
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

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1">City</label>
                        <input 
                            type="text" 
                            value={address.address?.city || address.address?.town || address.address?.village || ''}
                            readOnly
                            className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2 text-sm text-gray-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1">Pincode</label>
                        <input 
                            type="text" 
                            value={address.address?.postcode || ''}
                            readOnly
                            className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2 text-sm text-gray-500"
                        />
                    </div>
                </div>

                <button
                    onClick={handleConfirm}
                    disabled={!detailedAddress}
                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-transform"
                >
                    Confirm & Save Address
                </button>
            </div>
        </div>
    );
};

export default LocationPicker;

