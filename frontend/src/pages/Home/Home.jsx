import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import SearchCard from '../../components/SearchCard/SearchCard';
import { CreditCard, ShieldCheck, Pointer, Clock, User, Star } from 'lucide-react';
import poolRideImg from '../../assets/poolride.png';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [recentRides, setRecentRides] = useState([]);

    useEffect(() => {
        const fetchRecentRides = async () => {
            try {
                const res = await api.get('/rides');
                // Show max 6 active rides having seats
                const active = res.data.filter(r => r.status !== 'completed' && r.seats > 0).slice(0, 6);
                setRecentRides(active);
            } catch (err) {
                console.error("Failed to fetch rides", err);
            }
        };
        fetchRecentRides();
    }, []);

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <h1 className="hero-title">
                    BOOK YOUR <span className="title-highlight">RIDE</span>
                </h1>
                <p className="hero-subtitle">COMFORT IN OUR HANDS</p>

                <div className="hero-search-wrapper">
                    <SearchCard />
                </div>
            </section>

            {/* Available Rides Section */}
            {recentRides.length > 0 && (
                <section className="recent-rides-section">
                    <h2>LATEST AVAILABLE RIDES</h2>
                    <div className="recent-rides-grid">
                        {recentRides.map(ride => (
                            <div key={ride._id} className="home-ride-card" onClick={() => navigate(`/results?from=${ride.from}&to=${ride.to}`)}>
                                <div className="home-ride-header">
                                    <div className="home-ride-route">
                                        <span>{ride.from}</span>
                                        <Pointer size={14} style={{ margin: '0 8px', color: '#5c8fd2'}} />
                                        <span>{ride.to}</span>
                                    </div>
                                    <span className="home-ride-price">₹{ride.price}</span>
                                </div>
                                <div className="home-ride-time">
                                    <Clock size={16} /> {ride.date} • {ride.time}
                                </div>
                                <div className="home-ride-divider"></div>
                                <div className="home-ride-footer">
                                    <div className="home-driver-info">
                                        <div className="home-driver-avatar">
                                            <User size={16} color="#666" />
                                        </div>
                                        <span>{ride.driver?.name}</span>
                                        <span className="home-driver-rating">
                                            <Star size={12} color="#FFD700" fill="#FFD700" style={{marginLeft: '4px', marginRight:'2px'}}/> 
                                            {ride.driver?.rating ? ride.driver.rating.toFixed(1) : 'New'}
                                        </span>
                                    </div>
                                    <span className="home-seats-badge">{ride.seats} seat{ride.seats > 1 ? 's' : ''} left</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Publish Promo Section */}
            <section className="publish-promo-section">
                <div className="publish-promo-banner-img">
                    <img src={poolRideImg} alt="Publish your ride, pool your vehicle" />
                </div>

                <div className="promo-features">
                    <div className="feature-item">
                        <div className="feature-icon"><CreditCard size={32} color="#1c3654" /></div>
                        <h4>Your pick of rides at low prices</h4>
                        <p>No matter where you're going, by bus or carpool, find the perfect ride from our wide range of destinations and routes at low prices.</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon"><ShieldCheck size={32} color="#1c3654" /></div>
                        <h4>Trust who you travel with</h4>
                        <p>We take the time to get to know each of our members and bus partners. We check reviews, profiles and IDs, so you know who you're travelling with.</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon"><Pointer size={32} color="#1c3654" /></div>
                        <h4>Scroll, click, tap and go!</h4>
                        <p>Booking a ride has never been easier! Thanks to our simple app powered by great technology, you can book a ride close to you in just minutes.</p>
                    </div>
                </div>
            </section>

            {/* Driving Promo Section */}
            <section className="driving-promo-section">
                <div className="driving-promo-content">
                    <div className="driving-promo-image">
                        <img 
                            src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                            alt="Coastal road trip car driving" 
                            className="car-with-people-img"
                        />
                    </div>
                    <div className="driving-promo-text">
                        <h2>DRIVING IN YOUR CAR SOON?</h2>
                        <p>LET'S MAKE THIS YOUR LEAST EXPENSIVE JOURNEY EVER.</p>
                        <button className="offer-ride-btn" onClick={() => navigate('/publish')}>OFFER RIDE</button>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <h2>Carpool Help Centre</h2>
                <div className="faq-grid">
                    <div className="faq-item">
                        <h4>How do I book a carpool ride?</h4>
                        <p>You can book a carpool ride on our mobile app, or on blablacar.in. Simply search for your destination, choose the date you want to travel and pick the carpool that suits you best! Some... <a href="#">read more</a></p>
                    </div>
                    <div className="faq-item">
                        <h4>How do I publish a carpool ride?</h4>
                        <p>Offering a carpool ride on BlaBlaCar is easy. To publish your ride, use our mobile app or blablacar.in. Indicate your departure and arrival points, the date and time of your departure, how many... <a href="#">read more</a></p>
                    </div>
                    <div className="faq-item">
                        <h4>How do I cancel my carpool ride?</h4>
                        <p>If you have a change of plans, you can always cancel your carpool ride from the 'Your rides' section of our app. The sooner you cancel, the better. That way the driver has time to accept ne... <a href="#">read more</a></p>
                    </div>
                    <div className="faq-item">
                        <h4>What are the benefits of travelling by carpool?</h4>
                        <p>There are multiple advantages to carpooling, over other means of transport. Travelling by carpool is usually more affordable, especially for longer distances. Carpooling is also more eco-... <a href="#">read more</a></p>
                    </div>
                    <div className="faq-item">
                        <h4>How much does a carpool ride cost?</h4>
                        <p>The costs of a carpool ride can vary greatly, and depend on factors like distance, time of departure, the demand of that ride and more. It is also up to the driver to decide how much to charg... <a href="#">read more</a></p>
                    </div>
                    <div className="faq-item">
                        <h4>How do I start carpooling?</h4>
                        <p>Carpooling with BlaBlaCar is super easy, and free! Simply sign up for an account and tell us some basic details about yourself. Once you have a BlaBlaCar account, you can start booking or... <a href="#">read more</a></p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
