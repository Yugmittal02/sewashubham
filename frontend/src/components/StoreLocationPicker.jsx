import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { FaLocationArrow, FaTimes, FaCheck, FaMapMarkerAlt } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update map center
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

// Component to handle map clicks
const ClickHandler = ({ onLocationSelect }) => {
    useMapEvents({
        click: (e) => {
            onLocationSelect(e.latlng);
        }
    });
    return null;
};

const StoreLocationPicker = ({ 
    isOpen, 
    onClose, 
    onSave, 
    initialLocation = { lat: 28.6139, lng: 77.2090 } 
}) => {
    const [position, setPosition] = useState(initialLocation);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && initialLocation) {
            setPosition(initialLocation);
        }
    }, [isOpen, initialLocation]);

    // Fallback to IP-based geolocation using ipapi.co (HTTPS, works in browsers)
    const getLocationByIP = async () => {
        try {
            // Using ipapi.co which supports HTTPS (free tier: 1000 requests/day)
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            if (data.latitude && data.longitude) {
                return { lat: data.latitude, lng: data.longitude, city: data.city };
            }
            return null;
        } catch (err) {
            console.error('IP-API error:', err);
            return null;
        }
    };

    const handleGetCurrentLocation = async () => {
        setLoading(true);
        setError('');

        // First try GPS
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    });
                    setLoading(false);
                },
                async (err) => {
                    console.error('GPS error:', err);
                    
                    // GPS failed, try IP-based location as fallback
                    const ipLocation = await getLocationByIP();
                    if (ipLocation) {
                        setPosition({ lat: ipLocation.lat, lng: ipLocation.lng });
                        setError(`GPS failed. Using approximate location${ipLocation.city ? ` (${ipLocation.city})` : ''} via IP.`);
                        setLoading(false);
                    } else {
                        let msg = 'Could not get location. ';
                        if (err.code === 1) msg += 'Permission denied.';
                        else if (err.code === 2) msg += 'Position unavailable.';
                        else if (err.code === 3) msg += 'Timed out.';
                        msg += ' Click on map to select manually.';
                        setError(msg);
                        setLoading(false);
                    }
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            // No GPS available, try IP-based location
            const ipLocation = await getLocationByIP();
            if (ipLocation) {
                setPosition({ lat: ipLocation.lat, lng: ipLocation.lng });
                setError(`Using approximate location${ipLocation.city ? ` (${ipLocation.city})` : ''} via IP.`);
            } else {
                setError('Geolocation not supported. Click on map to select manually.');
            }
            setLoading(false);
        }
    };

    const handleSave = () => {
        onSave(position);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-red-500" />
                            Select Store Location
                        </h3>
                        <p className="text-sm text-gray-500">Click on the map to set your store location</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Map */}
                <div className="h-[400px] relative">
                    <MapContainer
                        center={[position.lat, position.lng]}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker 
                            position={[position.lat, position.lng]}
                            draggable={true}
                            eventHandlers={{
                                dragend: (e) => {
                                    const marker = e.target;
                                    const pos = marker.getLatLng();
                                    setPosition({ lat: pos.lat, lng: pos.lng });
                                }
                            }}
                        />
                        <MapUpdater center={[position.lat, position.lng]} />
                        <ClickHandler onLocationSelect={(latlng) => setPosition({ lat: latlng.lat, lng: latlng.lng })} />
                    </MapContainer>

                    {/* Get Current Location Button */}
                    <button
                        onClick={handleGetCurrentLocation}
                        disabled={loading}
                        className="absolute bottom-4 right-4 z-[1000] bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 disabled:opacity-50"
                        title="Get my location"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <FaLocationArrow className="text-blue-600" />
                        )}
                    </button>
                </div>

                {/* Coordinates Display */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-sm">
                            <span className="text-gray-500">Latitude:</span>
                            <span className="font-mono font-bold text-gray-800 ml-2">{position.lat.toFixed(6)}</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-500">Longitude:</span>
                            <span className="font-mono font-bold text-gray-800 ml-2">{position.lng.toFixed(6)}</span>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 mb-3 bg-red-50 p-2 rounded-lg">{error}</p>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-700"
                        >
                            <FaCheck />
                            Set This Location
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreLocationPicker;
