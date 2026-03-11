import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, AlertTriangle, IndianRupee } from 'lucide-react';
import './ServiceRequest.css';

// Fix for default marker icon in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

const ServiceRequest = () => {
    const navigate = useNavigate();
    const [userLocation, setUserLocation] = useState({ lat: 17.6868, lng: 83.2185 });
    const [distance, setDistance] = useState(null);
    const [price, setPrice] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCalculateDistance = () => {
        // Mock simulation
        const mockDistance = (Math.random() * 10 + 2).toFixed(1);
        const costPerKm = 50;
        const baseFare = 200;

        setDistance(mockDistance);
        setPrice(Math.round(baseFare + (mockDistance * costPerKm)));
    };

    const handleRequestTow = async () => {
        setError('');
        setSuccess('');

        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            setError('You must be logged in to request an emergency tow.');
            return;
        }

        try {
            await api.post('/requests', {
                location: {
                    lat: userLocation.lat,
                    lng: userLocation.lng
                },
                estimatedDistance: parseFloat(distance),
                estimatedPrice: price
            });

            setSuccess('Tow truck requested successfully! Check your Emergency Log.');
            setTimeout(() => navigate('/profile'), 2500);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to request tow service.');
        }
    };

    return (
        <div className="service-request-container">
            <div className="service-header">
                <AlertTriangle size={32} color="#d9534f" className="alert-icon" />
                <h2>Emergency Tow Service</h2>
                <p>Drop a pin at your exact breakdown location</p>
            </div>

            {error && <div className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</div>}
            {success && <div className="success-message" style={{ color: 'green', textAlign: 'center', marginBottom: '15px' }}>{success}</div>}

            <div className="service-layout">
                <div className="map-section">
                    <MapContainer
                        center={[17.6868, 83.2185]}
                        zoom={13}
                        scrollWheelZoom={true}
                        className="leaflet-map"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker position={userLocation} setPosition={setUserLocation} />
                    </MapContainer>
                    <div className="map-instruction">
                        <MapPin size={18} />
                        <span>Click on the map to place your pin</span>
                    </div>
                </div>

                <div className="service-panel">
                    <div className="panel-card">
                        <h3>Request Details</h3>

                        <div className="location-info">
                            <label>Pinned Coordinates:</label>
                            <div className="coord-box">
                                {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'No location selected'}
                            </div>
                        </div>

                        <button
                            className="calc-btn"
                            onClick={handleCalculateDistance}
                            disabled={!userLocation}
                        >
                            CALCULATE ESTIMATE
                        </button>

                        {distance && price && (
                            <div className="estimate-result">
                                <div className="result-row">
                                    <span>Estimated Distance:</span>
                                    <strong>{distance} km</strong>
                                </div>
                                <div className="result-row price-row">
                                    <span>Estimated Price:</span>
                                    <strong className="price-tag">
                                        <IndianRupee size={16} /> {price}
                                    </strong>
                                </div>

                                <button className="request-submit-btn" onClick={handleRequestTow}>
                                    REQUEST TOW TRUCK
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceRequest;
