import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRightLeft } from 'lucide-react';
import LocationInput from '../LocationInput/LocationInput';
import './SearchCard.css';

const SearchCard = () => {
    const navigate = useNavigate();
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');

    const handleSearch = () => {
        let query = '?';
        if (from) query += `from=${from}&`;
        if (to) query += `to=${to}&`;
        if (date) query += `date=${date}`;
        navigate(`/results${query}`);
    };

    const swapLocations = () => {
        const temp = from;
        setFrom(to);
        setTo(temp);
    };

    return (
        <div className="search-card">
            <div className="search-field from-field">
                <MapPin className="field-icon primary-color" size={24} />
                <div className="input-group">
                    <label>From</label>
                    <LocationInput 
                        placeholder="Starting Location"
                        value={from}
                        onChange={setFrom}
                        hideIcon={true}
                    />
                </div>
            </div>

            <div className="swap-btn-container">
                <button className="swap-btn" onClick={swapLocations}>
                    <ArrowRightLeft size={16} />
                </button>
            </div>

            <div className="search-field to-field">
                <MapPin className="field-icon primary-color" size={24} />
                <div className="input-group">
                    <label>To</label>
                    <LocationInput 
                        placeholder="Destination"
                        value={to}
                        onChange={setTo}
                        hideIcon={true}
                    />
                </div>
            </div>

            <div className="search-field date-field">
                <Calendar className="field-icon" size={24} color="#888" />
                <div className="input-group">
                    <label>Departure Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{ fontWeight: 600, color: '#333' }}
                    />
                </div>
            </div>

            <button className="main-search-btn" onClick={handleSearch}>
                SEARCH
            </button>
        </div>
    );
};

export default SearchCard;
