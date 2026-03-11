import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { MapPin, Calendar, Clock, Users, IndianRupee } from 'lucide-react';
import LocationInput from '../../components/LocationInput/LocationInput';
import './PublishRide.css';

const PublishRide = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        date: '',
        time: '',
        seats: 1,
        price: '',
        carModel: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Check if user is logged in
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            setError('You must be logged in to publish a ride.');
            return;
        }

        try {
            await api.post('/rides', formData);
            setSuccess('Ride published successfully!');
            setTimeout(() => {
                navigate('/profile'); // Redirect to profile to see the new ride
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to publish ride.');
        }
    };

    return (
        <div className="publish-container">
            <div className="publish-card">
                <div className="publish-header">
                    <h2>Publish a Ride</h2>
                    <p>Share your journey and save on travel costs</p>
                </div>

                {error && <div className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</div>}
                {success && <div className="success-message" style={{ color: 'green', textAlign: 'center', marginBottom: '15px' }}>{success}</div>}

                <form className="publish-form" onSubmit={handleSubmit}>

                    <div className="form-section">
                        <h3>Route Details</h3>
                        <div className="form-row">
                            <div className="input-group" style={{ padding: 0 }}>
                                <LocationInput 
                                    placeholder="Leaving from (e.g. Vizag)"
                                    value={formData.from}
                                    onChange={(place) => setFormData({...formData, from: place})}
                                />
                            </div>
                            <div className="input-group" style={{ padding: 0 }}>
                                <LocationInput 
                                    placeholder="Going to (e.g. Vijayawada)"
                                    value={formData.to}
                                    onChange={(place) => setFormData({...formData, to: place})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Schedule</h3>
                        <div className="form-row">
                            <div className="input-group">
                                <Calendar className="input-icon" size={20} />
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <Clock className="input-icon" size={20} />
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Ride Info</h3>
                        <div className="form-row form-row-thirds">
                            <div className="input-group seat-group">
                                <Users className="input-icon" size={20} />
                                <label>Available Seats:</label>
                                <input
                                    type="number"
                                    name="seats"
                                    min="1"
                                    max="8"
                                    value={formData.seats}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group price-group">
                                <IndianRupee className="input-icon" size={20} />
                                <label>Price per Seat:</label>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="e.g. 500"
                                    min="0"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row" style={{ marginTop: '20px' }}>
                            <div className="input-group" style={{ width: '100%' }}>
                                <label style={{display: 'block', marginBottom: '8px', color: '#1a4b66', fontWeight: 'bold'}}>Car Details (Model / Color):</label>
                                <input
                                    type="text"
                                    name="carModel"
                                    placeholder="e.g. White Suzuki Swift"
                                    value={formData.carModel}
                                    onChange={handleChange}
                                    style={{ width: '100%', paddingLeft: '15px' }}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="publish-submit-btn">
                        PUBLISH RIDE
                    </button>

                </form>
            </div>
        </div>
    );
};

export default PublishRide;
