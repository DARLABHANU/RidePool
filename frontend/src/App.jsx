import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import React, { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import ServiceRequest from './pages/ServiceRequest/ServiceRequest';
import PublishRide from './pages/PublishRide/PublishRide';
import SearchResults from './pages/SearchResults/SearchResults';
import Account from './pages/Account/Account';
import Footer from './components/Footer/Footer';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  useEffect(() => {
    const handleNotification = (data) => {
      const userInfo = localStorage.getItem('userInfo');
      const user = userInfo ? JSON.parse(userInfo) : null;
      
      if (user && data.userId === user._id) {
        toast.success(data.message, { duration: 5000 });
      }
    };

    socket.on('notification', handleNotification);
    return () => socket.off('notification', handleNotification);
  }, []);

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/profile" element={<Account />} />
            <Route path="/results" element={<SearchResults />} />
            <Route path="/emergency" element={<ServiceRequest />} />
            <Route path="/publish" element={<PublishRide />} />
            {/* Add more routes here later */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
