import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { FaLocationArrow, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
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
                const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`);
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
    const [manualAddress, setManualAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);

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
            manualAddress: manualAddress,
            details: address.address // Pincode, city, etc.
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
                            // Auto-fill manual address if empty
                            if (!manualAddress) {
                                setManualAddress(data.display_name?.split(',')[0] || '');
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

                <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1">Detailed Address / Landmark</label>
                    <textarea 
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                        placeholder="House No, Floor, Landmark (e.g. Near City Park)"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-base h-24 resize-none"
                    ></textarea>
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
                    disabled={!manualAddress}
                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 disabled:opacity-50 disabled:shadow-none"
                >
                    Confirm & Save Address
                </button>
            </div>
        </div>
    );
};

export default LocationPicker;
