import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './Auth.css';
import { Mail, Lock, User, Phone } from 'lucide-react';

const Auth = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let response;
            if (isLogin) {
                response = await api.post('/auth/login', {
                    email: formData.email,
                    password: formData.password
                });
            } else {
                response = await api.post('/auth/register', {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                });
            }

            // Save user to local storage and redirect
            localStorage.setItem('userInfo', JSON.stringify(response.data));
            navigate('/profile');
            window.location.reload(); // Quick way to update navbar if we have state there later
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
                    <p>{isLogin ? 'Sign in to your account to continue' : 'Join RidePool today and start saving'}</p>
                </div>

                {error && <div className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div className="input-group">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <Phone className="input-icon" size={20} />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="input-group">
                        <Mail className="input-icon" size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock className="input-icon" size={20} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {isLogin && (
                        <div className="forgot-password">
                            <a href="#">Forgot Password?</a>
                        </div>
                    )}

                    <button type="submit" className="auth-submit-btn">
                        {isLogin ? 'SIGN IN' : 'SIGN UP'}
                    </button>
                </form>

                <div className="auth-switch">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span onClick={toggleAuthMode} className="switch-link">
                            {isLogin ? 'Register here' : 'Login here'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
