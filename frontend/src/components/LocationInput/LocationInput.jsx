import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import './LocationInput.css';

const LocationInput = ({ placeholder, value, onChange, iconColor = "#5c8fd2", hideIcon = false }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const debounceTimeout = useRef(null);
    const wrapperRef = useRef(null);

    // Detect click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchSuggestions = async (query) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            // Photon API is more reliable for client-side geocoding without blocking via rate limits 
            const res = await fetch(`https://photon.komoot.io/api/?q=${query}&limit=5`);
            const data = await res.json();
            
            // Format places to get a clean descriptive name
            const parsed = data.features.map(item => {
                const { name, city, state, country } = item.properties;
                // Build a nice string like "Vizag, Andhra Pradesh, India"
                return [name, city, state, country].filter((v, i, a) => v && a.indexOf(v) === i).join(', ');
            });
            setSuggestions([...new Set(parsed)]); // Remove duplicates
        } catch (error) {
            console.error("Geocoding failed", error);
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        onChange(val);
        setIsTyping(true);
        setShowSuggestions(true);

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            fetchSuggestions(val);
            setIsTyping(false);
        }, 600);
    };

    const handleSelect = (place) => {
        onChange(place);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    return (
        <div className="location-input-wrapper" ref={wrapperRef}>
            {!hideIcon && <MapPin className="field-icon" size={24} color={iconColor} />}
            <div className="input-field-container">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value || ''}
                    onChange={handleInputChange}
                    onFocus={() => { if(value?.length > 2) setShowSuggestions(true) }}
                    autoComplete="off"
                />
            </div>
            
            {showSuggestions && (isTyping || suggestions.length > 0) && (
                <ul className="suggestions-dropdown">
                    {isTyping ? (
                        <li className="suggestion-item loading">Searching...</li>
                    ) : (
                        suggestions.map((place, idx) => (
                            <li key={idx} className="suggestion-item" onClick={() => handleSelect(place)}>
                                <MapPin size={14} style={{ marginRight: '8px', color: '#888' }} />
                                {place}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default LocationInput;
