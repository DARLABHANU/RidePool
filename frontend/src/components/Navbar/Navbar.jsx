import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, User, AlertTriangle, Bell, Trash2 } from 'lucide-react';
import { io } from 'socket.io-client';
import './Navbar.css';

const Navbar = () => {
    const userInfo = localStorage.getItem('userInfo');
    const user = userInfo ? JSON.parse(userInfo) : null;

    const [notifications, setNotifications] = useState(() => {
        if (user) {
            try { return JSON.parse(localStorage.getItem(`notifs_${user._id}`)) || []; } catch { return []; }
        }
        return [];
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const socketRef = useRef(null);

    const userId = user?._id;

    useEffect(() => {
        if (userId) {
            socketRef.current = io('http://localhost:5000');
            
            // Join personal notification room
            socketRef.current.emit('join_user', userId);

            socketRef.current.on('notification', (data) => {
                setNotifications((prev) => {
                    const newNotifs = [data, ...prev];
                    localStorage.setItem(`notifs_${userId}`, JSON.stringify(newNotifs));
                    return newNotifs;
                });
            });

            return () => {
                socketRef.current?.disconnect();
            };
        }
    }, [userId]);

    const clearNotifications = () => {
        setNotifications([]);
        if (user) localStorage.removeItem(`notifs_${user._id}`);
        setShowDropdown(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo Section */}
                <Link to="/" className="navbar-logo">
                    <div className="logo-placeholder">
                        {/* Replace with actual image logo later */}
                        <span className="logo-text">RidePool</span>
                    </div>
                </Link>

                {/* Actions Section */}
                <div className="navbar-actions">
                    <Link to="/emergency" className="action-item">
                        <AlertTriangle size={28} color="#d9534f" className="action-icon" />
                        <span style={{ color: '#d9534f' }}>EMERGENCY TOW</span>
                    </Link>
                    <Link to="/publish" className="action-item">
                        <PlusCircle size={28} className="action-icon primary-color" />
                        <span>PUBLISH RIDE</span>
                    </Link>
                    {user ? (
                        <>
                            <div className="notification-wrapper" style={{ position: 'relative' }}>
                                <div className="action-item" onClick={() => setShowDropdown(!showDropdown)} style={{ cursor: 'pointer' }}>
                                    <Bell size={28} className="action-icon primary-color" />
                                    {notifications.length > 0 && (
                                        <span className="notification-badge" style={{ position: 'absolute', top: '-10px', right: '0', background: 'red', color: 'white', fontSize: '12px', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {notifications.length}
                                        </span>
                                    )}
                                </div>
                                {showDropdown && (
                                    <div className="notification-dropdown" style={{ position: 'absolute', top: '40px', right: '0', background: 'white', border: '1px solid #ddd', borderRadius: '8px', width: '300px', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                        <div style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4 style={{ margin: 0 }}>Notifications</h4>
                                            {notifications.length > 0 && <Trash2 size={16} color="red" style={{ cursor: 'pointer' }} onClick={clearNotifications} />}
                                        </div>
                                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            {notifications.length === 0 ? (
                                                <div style={{ padding: '15px', textAlign: 'center', color: '#888' }}>No new notifications</div>
                                            ) : (
                                                notifications.map((n, i) => (
                                                    <div key={i} style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px', color: '#444' }}>
                                                        {n.message}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Link to="/profile" className="action-item">
                                <User size={28} className="action-icon primary-color" />
                                <span>{user.name.split(' ')[0].toUpperCase()}</span>
                            </Link>
                        </>
                    ) : (
                        <Link to="/login" className="action-item">
                            <User size={28} className="action-icon primary-color" />
                            <span>LOGIN / SIGNUP</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
