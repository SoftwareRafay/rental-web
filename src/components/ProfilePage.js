import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/my-listings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setListings(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch listings.');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    };

    if (token) {
      fetchListings();
    } else {
      navigate('/login');
    }
  }, [navigate, token]);

  const handleEdit = (id) => {
    navigate(`/edit-listing/${id}`);
  };
  

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/delete-listing/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setListings(listings.filter((listing) => listing.id !== id));
          alert('Listing deleted successfully');
        } else {
          setError('Failed to delete listing.');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1>Your Listings</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {listings.length > 0 ? (
          listings.map((listing) => (
            <li key={listing.id}>
              <h3>{listing.name}</h3>
              <p>{listing.address}</p>
              <p>{listing.price}</p>
              <button onClick={() => handleEdit(listing.id)}>Edit</button>
              <button onClick={() => handleDelete(listing.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No listings found.</p>
        )}
      </ul>
    </div>
  );
}

export default ProfilePage;
