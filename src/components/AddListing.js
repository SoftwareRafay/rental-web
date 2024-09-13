//AddListing.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddListingPage() {
  const [address, setAddress] = useState(''); // Changed from title to address
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [name, setName] = useState(''); // Added name field
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to add a listing.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/add-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Attach the JWT token in the header with Bearer prefix
        },
        body: JSON.stringify({ city, address, name, description, price }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        navigate('/'); // Redirect to homepage after successful listing
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Add a New Listing</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Listing</button>
      </form>
    </div>
  );
}

export default AddListingPage;
