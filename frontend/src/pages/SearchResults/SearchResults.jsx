import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { User, Star, Clock, ChevronRight } from 'lucide-react';
import './SearchResults.css';

const SearchResults = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filters State
    const [maxPrice, setMaxPrice] = useState(2000);
    const [minRating, setMinRating] = useState(0);
    const [timeFilter, setTimeFilter] = useState('all');

    const navigate = useNavigate();

    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const fromParam = query.get('from');
    const toParam = query.get('to');
    const dateParam = query.get('date');

    const [bookingDialog, setBookingDialog] = useState({ isOpen: false, ride: null });
    const [seatsToBook, setSeatsToBook] = useState(1);
    const [passengerNames, setPassengerNames] = useState(['']);

    const handleBookClick = async (ride) => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            alert('You must be logged in to book a ride.');
            navigate('/login');
            return;
        }

        setSeatsToBook(1);
        setPassengerNames(['']);
        setBookingDialog({ isOpen: true, ride });
    };

    const handleSeatsChange = (e) => {
        const val = Number(e.target.value);
        setSeatsToBook(val);
        setPassengerNames(prev => {
            const newNames = [...prev];
            if (val > newNames.length) {
                for (let i = newNames.length; i < val; i++) newNames.push('');
            } else {
                newNames.length = val;
            }
            return newNames;
        });
    };

    const handleNameChange = (index, value) => {
        const newNames = [...passengerNames];
        newNames[index] = value;
        setPassengerNames(newNames);
    };

    const confirmBooking = async () => {
        const ride = bookingDialog.ride;
        if (!ride) return;

        if (passengerNames.some(name => !name.trim())) {
            alert('Please fill out the names of all passengers to continue.');
            return;
        }

        try {
            await api.put(`/rides/${ride._id}/book`, { seatsToBook, passengerNames });
            alert('Ride booked successfully! Check your account bookings.');
            setRides(prev => prev.map(r => r._id === ride._id ? { ...r, seats: r.seats - seatsToBook } : r));
            setBookingDialog({ isOpen: false, ride: null });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to book ride.');
            setBookingDialog({ isOpen: false, ride: null });
        }
    };

    const cancelBooking = () => {
        setBookingDialog({ isOpen: false, ride: null });
    };

    useEffect(() => {
        const fetchRides = async () => {
            try {
                setLoading(true);
                setError('');

                // Build the query string based on what the user searched
                let queryString = '?';
                if (fromParam) queryString += `from=${fromParam}&`;
                if (toParam) queryString += `to=${toParam}&`;
                if (dateParam) queryString += `date=${dateParam}`;

                const res = await api.get(`/rides${queryString}`);
                setRides(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch rides.');
            } finally {
                setLoading(false);
            }
        };

        fetchRides();
    }, [fromParam, toParam, dateParam]);

    const filteredRides = rides.filter(ride => {
        let priceMatch = ride.price <= maxPrice;
        let ratingMatch = (ride.driver?.rating || 0) >= minRating;
        
        let timeMatch = true;
        if (timeFilter !== 'all') {
            const isPM = ride.time.toLowerCase().includes('pm');
            let hourMatch = ride.time.match(/\d+/);
            let hour = hourMatch ? parseInt(hourMatch[0]) : 12;
            if (isPM && hour !== 12) hour += 12;
            if (!isPM && hour === 12) hour = 0;
            
            if (timeFilter === 'morning') timeMatch = hour >= 6 && hour < 12;
            if (timeFilter === 'afternoon') timeMatch = hour >= 12 && hour < 17;
            if (timeFilter === 'evening') timeMatch = hour >= 17 || hour < 6;
        }
        
        return priceMatch && ratingMatch && timeMatch;
    });

    return (
        <div className="search-results-container">
            <div className="results-header">
                <h2>Available Rides</h2>
                <p>
                    {fromParam || 'Anywhere'} <ChevronRight size={14} /> {toParam || 'Anywhere'}
                    {dateParam ? ` on ${dateParam}` : ' (All Dates)'}
                </p>
            </div>

            {loading && <div style={{ textAlign: 'center', margin: '40px' }}>Loading rides...</div>}
            {error && <div style={{ color: 'red', textAlign: 'center', margin: '40px' }}>{error}</div>}

            {!loading && !error && filteredRides.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '12px' }}>
                    <h3>No rides match your criteria.</h3>
                    <p style={{ color: '#666' }}>Try adjusting your filters or search parameters!</p>
                </div>
            )}

            <div className="search-layout">
                {/* Filters Sidebar */}
                <div className="filters-sidebar">
                    <h3>Filter Rides</h3>
                    
                    <div className="filter-group">
                        <label>Max Price: ₹{maxPrice}</label>
                        <input type="range" min="100" max="5000" step="100" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                    </div>

                    <div className="filter-group">
                        <label>Departure Time</label>
                        <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
                            <option value="all">All Times</option>
                            <option value="morning">Morning (06:00 - 12:00)</option>
                            <option value="afternoon">Afternoon (12:00 - 17:00)</option>
                            <option value="evening">Evening (17:00 - 06:00)</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Driver Rating</label>
                        <select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
                            <option value="0">Any Rating</option>
                            <option value="3">3 Stars & Up</option>
                            <option value="4">4 Stars & Up</option>
                            <option value="4.5">4.5 Stars & Up</option>
                        </select>
                    </div>
                </div>

                <div className="results-list">
                    {filteredRides.map(ride => (
                        <div key={ride._id} className="ride-card">
                        <div className="ride-time-location">
                            <div className="time-block">
                                <strong>{ride.time}</strong>
                                <span className="location-name">{ride.from}</span>
                            </div>
                            <div className="time-connector">
                                <div className="line"></div>
                                <Clock size={16} color="#aaa" />
                                <div className="line"></div>
                            </div>
                            <div className="time-block">
                                <strong>Estimation</strong>
                                <span className="location-name">{ride.to}</span>
                            </div>
                        </div>

                        <div className="ride-divider"></div>

                        <div className="ride-details">
                            <div className="driver-info">
                                <div className="driver-avatar">
                                    <User size={24} color="#666" />
                                </div>
                                <div className="driver-text">
                                    <h4>{ride.driver?.name || 'Unknown Driver'}</h4>
                                    <span className="rating"><Star size={12} color="#FFD700" fill="#FFD700" /> {ride.driver && ride.driver.rating ? ride.driver.rating.toFixed(1) : 'New'}</span>
                                </div>
                            </div>

                            <div className="ride-meta">
                                <span>{ride.date}</span>
                                <span>• {ride.seats} seats available</span>
                                <span style={{display: 'block', marginTop: '4px', fontSize: '13px', color: '#1a4b66', fontWeight: 'bold'}}>
                                    🚗 {ride.carModel || 'Standard Car'}
                                </span>
                            </div>

                            <div className="ride-price-action">
                                <div className="price-tag">₹{ride.price}</div>
                                <button 
                                    className="book-btn" 
                                    onClick={() => handleBookClick(ride)} 
                                    disabled={ride.seats === 0}
                                >
                                    {ride.seats === 0 ? 'FULL' : 'BOOK NOW'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Custom Confirm Dialog Modal */}
            {bookingDialog.isOpen && bookingDialog.ride && (
                <div className="custom-dialog-overlay">
                    <div className="custom-dialog-box">
                        <h3>Confirm Booking</h3>
                        <p>
                            You are about to book seats from <strong>{bookingDialog.ride.from}</strong> to <strong>{bookingDialog.ride.to}</strong>.
                        </p>
                        
                        <div className="seat-selector">
                            <label>Number of Passengers: </label>
                            <input 
                                type="number" 
                                min="1" 
                                max={bookingDialog.ride.seats} 
                                value={seatsToBook} 
                                onChange={handleSeatsChange}
                                className="seat-input"
                            />
                            <span className="max-seats">(Max: {bookingDialog.ride.seats})</span>
                        </div>

                        <div className="passenger-names-container" style={{ textAlign: 'left', marginBottom: '20px' }}>
                            {passengerNames.map((name, index) => (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                    <label style={{ fontSize: '14px', color: '#555', display: 'block', marginBottom: '5px' }}>Passenger {index + 1} Name:</label>
                                    <input 
                                        type="text"
                                        placeholder={`Enter passenger ${index + 1} name`}
                                        value={name}
                                        onChange={(e) => handleNameChange(index, e.target.value)}
                                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                                        required
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="dialog-price">Total fare: ₹{bookingDialog.ride.price * seatsToBook}</div>
                        
                        <div className="dialog-actions">
                            <button className="dialog-cancel-btn" onClick={cancelBooking}>
                                Cancel
                            </button>
                            <button className="dialog-confirm-btn" onClick={confirmBooking}>
                                Confirm Book
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
