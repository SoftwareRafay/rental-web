//Homepage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cities from '../cities.json'; // Adjust the path based on your file structure

function HomePage() {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [canadianCities, setCanadianCities] = useState([]);
  const navigate = useNavigate();

  // Extract city names from the JSON data
  useEffect(() => {
    const cityNames = cities.map(cityData => cityData[0]);
    setCanadianCities(cityNames);
  }, []);

  // Handle city input changes
  const handleChange = (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.length >= 3) {
      // Filter Canadian cities based on user input and limit to 10 suggestions
      const filteredSuggestions = canadianCities
        .filter(c => c.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10); // Limit to 10 suggestions

      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Handle city selection from suggestions
  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setSuggestions([]);
  };

  // Handle search
  const handleSearch = () => {
    if (canadianCities.includes(city)) {
      navigate(`/map?city=${city}`);
    } else {
      alert('Please enter a valid Canadian city.');
    }
  };

  return (
    <div>
      <h1>Find Rental Properties</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={handleChange}
      />
      <button onClick={handleSearch}>Search</button>
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HomePage;
