import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { User, Shield, Car, MessageCircle } from 'lucide-react';
import ChatModal from './ChatModal';
import './Account.css';

const Account = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState(null);
    const [rides, setRides] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [requests, setRequests] = useState([]);
    const [adminRequests, setAdminRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [chatRide, setChatRide] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const userInfoStr = localStorage.getItem('userInfo');
            if (!userInfoStr) {
                navigate('/login');
                return;
            }

            try {
                setLoading(true);
                // Fetch profile
                const profileRes = await api.get('/auth/profile');
                setUser({
                    ...profileRes.data,
                    memberSince: "Oct 2024", // Mocked date for now
                    status: "Verified",
                    rating: 4.8
                });

                // Fetch my rides
                const ridesRes = await api.get('/rides/myrides');
                setRides(ridesRes.data);

                // Fetch my bookings
                const bookingsRes = await api.get('/rides/mybookings');
                setBookings(bookingsRes.data);

                // Fetch my emergency requests
                const requestsRes = await api.get('/requests/myrequests');
                setRequests(requestsRes.data);

                // Fetch all requests if role is admin
                if (profileRes.data.role === 'admin') {
                    const adminReqRes = await api.get('/requests');
                    setAdminRequests(adminReqRes.data);
                }

            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load details.');
                if (err.response?.status === 401) {
                    localStorage.removeItem('userInfo');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
        window.location.reload();
    };

    const handleStatusChange = async (reqId, newStatus) => {
        try {
            await api.put(`/requests/${reqId}/status`, { status: newStatus });
            setAdminRequests(prev => prev.map(r => r._id === reqId ? { ...r, status: newStatus } : r));
        } catch (err) {
            console.error('Failed to update status', err);
            alert('Failed to update status');
        }
    };

    const handleCompleteRide = async (rideId) => {
        try {
            await api.put(`/rides/${rideId}/complete`);
            setRides(prev => prev.map(r => r._id === rideId ? { ...r, status: 'completed' } : r));
        } catch (err) {
            console.error('Failed to complete ride', err);
            alert('Failed to complete ride');
        }
    };

    const handleReviewDriver = async (driverId) => {
        if (!driverId) {
            alert('Driver information is missing and cannot be reviewed.');
            return;
        }
        const rating = prompt('Please rate the driver from 1 to 5:');
        if (rating) {
            try {
                await api.post(`/auth/users/${driverId}/review`, { rating: Number(rating) });
                alert('Review submitted successfully!');
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to submit review');
            }
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Details...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</div>;

    return (
        <div className="account-container">
            {/* Sidebar / Tabs */}
            <div className="account-sidebar">
                <div className="user-summary">
                    <div className="avatar-large">
                        <User size={40} color="#555" />
                    </div>
                    <h3>{user?.name}</h3>
                    <p className="user-rating-text">⭐ {user?.rating} - {user?.status}</p>
                </div>

                <div className="account-nav">
                    <button
                        className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <User size={18} /> My Profile
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'rides' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rides')}
                    >
                        <Car size={18} /> My Published Rides ({rides.length})
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        <Car size={18} /> My Booked Rides ({bookings.length})
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'emergency' ? 'active' : ''}`}
                        onClick={() => setActiveTab('emergency')}
                    >
                        <Shield size={18} /> Emergency Log ({requests.length})
                    </button>
                    {user?.role === 'admin' && (
                        <button
                            className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
                            onClick={() => setActiveTab('admin')}
                        >
                            <Shield size={18} /> Admin Dashboard ({adminRequests.length})
                        </button>
                    )}
                    <button
                        className="nav-btn"
                        style={{ marginTop: '20px', color: '#d9534f' }}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="account-content">
                {activeTab === 'profile' && (
                    <div className="tab-section">
                        <h2>Profile Information</h2>
                        <div className="info-card">
                            <div className="info-row">
                                <label>Full Name</label>
                                <span>{user?.name}</span>
                            </div>
                            <div className="info-row">
                                <label>Email Address</label>
                                <span>{user?.email}</span>
                            </div>
                            <div className="info-row">
                                <label>Phone Number</label>
                                <span>{user?.phone}</span>
                            </div>
                            <div className="info-row">
                                <label>Member Since</label>
                                <span>{user?.memberSince}</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'rides' && (
                    <div className="tab-section">
                        <h2>My Published Rides</h2>
                        {rides.length === 0 ? <p>No rides published yet.</p> : rides.map(ride => (
                            <div key={ride._id} className="info-card ride-summary-card">
                                <div className="ride-header">
                                    <span className={`ride-status ${ride.status === 'completed' ? '' : 'active'}`} style={ride.status === 'completed' ? {background: '#999'} : {}}>
                                        {ride.status === 'completed' ? 'COMPLETED' : 'ACTIVE'}
                                    </span>
                                    <strong>{new Date(ride.createdAt).toLocaleDateString()}</strong>
                                </div>
                                <div className="ride-body">
                                    <h3>{ride.from} → {ride.to}</h3>
                                    <p>Date: {ride.date} • Time: {ride.time} • ₹{ride.price}/seat</p>
                                    <p>Car details: 🚗 <strong>{ride.carModel || 'Standard Car'}</strong></p>
                                    <p>Booked by: {ride.passengers?.length || 0} passenger(s)</p>
                                    {ride.passengers?.length > 0 && (
                                        <p style={{fontSize: '13px', color: '#666', marginTop: '4px'}}>
                                            <strong>Passengers:</strong> {ride.passengers.map(p => p && p.name ? p.name : 'Unknown').join(', ')}
                                        </p>
                                    )}
                                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                        <button 
                                            className="view-details-btn"
                                            onClick={() => setChatRide(ride)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            <MessageCircle size={16} /> Open Chat
                                            {ride.messages?.length > 0 && <span style={{ background: '#d9534f', color: '#fff', padding: '2px 6px', borderRadius: '10px', fontSize: '10px', marginLeft: '4px' }}>{ride.messages.length}</span>}
                                        </button>
                                        {ride.status !== 'completed' && (
                                            <button 
                                                onClick={() => handleCompleteRide(ride._id)}
                                                style={{ padding: '8px 16px', background: '#5cb85c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                Mark as Finished
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div className="tab-section">
                        <h2>My Booked Rides</h2>
                        {bookings.length === 0 ? <p>No rides booked yet.</p> : bookings.map(ride => (
                            <div key={ride._id} className="info-card ride-summary-card">
                                <div className="ride-header">
                                    <span className="ride-status active" style={{background: ride.status === 'completed' ? '#999' : '#5cb85c'}}>
                                        {ride.status === 'completed' ? 'COMPLETED' : 'BOOKED'}
                                    </span>
                                    <strong>{new Date(ride.createdAt).toLocaleDateString()}</strong>
                                </div>
                                <div className="ride-body">
                                    <h3>{ride.from} → {ride.to}</h3>
                                    <p>Date: {ride.date} • Time: {ride.time} • ₹{ride.price}/seat</p>
                                    <p>Car details: 🚗 <strong>{ride.carModel || 'Standard Car'}</strong></p>
                                    <p style={{ marginTop: '8px', color: '#1a4b66', fontWeight: 600}}>
                                        Driver: {ride.driver?.name} ({ride.driver?.phone || 'No phone available'})
                                    </p>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button 
                                            className="view-details-btn"
                                            onClick={() => setChatRide(ride)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            <MessageCircle size={16} /> Open Chat
                                        </button>
                                        
                                        {ride.status === 'completed' && (
                                            <button 
                                                onClick={() => handleReviewDriver(ride.driver?._id)}
                                                style={{ padding: '8px 16px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                ⭐ Rate Driver
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'emergency' && (
                    <div className="tab-section">
                        <h2>Emergency Service Logs</h2>
                        {requests.length === 0 ? <p>No emergency requests made.</p> : requests.map(req => (
                            <div key={req._id} className="info-card emergency-log-card">
                                <div className="log-header">
                                    <Shield size={20} color="#d9534f" />
                                    <span>Tow Truck Requested - {req.status.toUpperCase()}</span>
                                </div>
                                <p>Requested on: {new Date(req.createdAt).toLocaleDateString()}</p>
                                <p>Coordinates: {req.location.lat.toFixed(4)}, {req.location.lng.toFixed(4)}</p>
                                <p>Estimated Cost: ₹{req.estimatedPrice}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'admin' && (
                    <div className="tab-section">
                        <h2>Admin Dashboard - Tow Requests</h2>
                        {adminRequests.length === 0 ? <p>No emergency requests found.</p> : adminRequests.map(req => (
                            <div key={req._id} className="info-card emergency-log-card">
                                <div className="log-header">
                                    <Shield size={20} color={req.status === 'completed' ? '#5cb85c' : '#d9534f'} />
                                    <span>{req.user?.name || 'User'} - {req.status.toUpperCase()}</span>
                                </div>
                                <p><strong>Phone:</strong> {req.user?.phone || 'N/A'}</p>
                                <p><strong>Requested on:</strong> {new Date(req.createdAt).toLocaleDateString()}</p>
                                <p><strong>Coordinates:</strong> {req.location.lat.toFixed(4)}, {req.location.lng.toFixed(4)}</p>
                                <p><strong>Estimated Cost:</strong> ₹{req.estimatedPrice}</p>
                                
                                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                    {req.status === 'pending' && (
                                        <button 
                                            onClick={() => handleStatusChange(req._id, 'accepted')} 
                                            style={{ padding: '8px 16px', background: '#337ab7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Accept Request
                                        </button>
                                    )}
                                    {req.status === 'accepted' && (
                                        <button 
                                            onClick={() => handleStatusChange(req._id, 'completed')} 
                                            style={{ padding: '8px 16px', background: '#5cb85c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Mark Completed
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Chat Modal View */}
            {chatRide && (
                <ChatModal 
                    ride={chatRide} 
                    currentUser={user} 
                    onClose={() => setChatRide(null)} 
                />
            )}
        </div>
    );
};

export default Account;
