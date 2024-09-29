import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cities from '../cities.json';

function AddListingPage() {
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [water, setWater] = useState(false);
  const [electricity, setElectricity] = useState(false);
  const [internet, setInternet] = useState(false);
  const [heat, setHeat] = useState(false);
  const [error, setError] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [rooms, setRooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');
  const navigate = useNavigate();

  const isCanadianCity = (city) => {
    const cityLower = city.toLowerCase();
    return cities.some(([cityName]) => cityName.toLowerCase() === cityLower);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to add a listing.');
      return;
    }

    if (!isCanadianCity(city)) {
      setError('City must be a valid Canadian city.');
      return;
    }

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          address
        )},${encodeURIComponent(city)}&key=dba5a6c69c204c15a6009781837926da&limit=1`
      );
      const data = await response.json();

      if (
        data.results.length === 0 ||
        data.results[0].components.country !== 'Canada' ||
        !data.results[0].components.city ||
        data.results[0].components.city.toLowerCase() !== city.toLowerCase()
      ) {
        setError('Address must be a valid address in the specified city.');
        return;
      }

      const listingResponse = await fetch('http://localhost:5000/api/add-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          city,
          address,
          name,
          description,
          price: parseFloat(price),
          water,
          electricity,
          internet,
          heat,
          property_type: propertyType,
          rooms: parseInt(rooms, 10),
          bathrooms: parseFloat(bathrooms),
          area: parseFloat(area),
        }),
      });

      if (listingResponse.ok) {
        const data = await listingResponse.json();
        alert(data.message);
        navigate('/');
      } else {
        const errorData = await listingResponse.json();
        setError(errorData.message || 'An error occurred.');
      }
    } catch (err) {
      console.error('Error:', err);
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

        <div>
          <label>Utilities:</label>
          <div>
            <input
              type="checkbox"
              checked={water}
              onChange={() => setWater(!water)}
            />
            <label>Water</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={electricity}
              onChange={() => setElectricity(!electricity)}
            />
            <label>Electricity</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={internet}
              onChange={() => setInternet(!internet)}
            />
            <label>Internet</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={heat}
              onChange={() => setHeat(!heat)}
            />
            <label>Heat</label>
          </div>
        </div>

        <div>
          <label>Property Type:</label>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
            <option value="">Select Property Type</option>
            <option value="house">House</option>
            <option value="room">Room</option>
          </select>
        </div>

        <div>
          <label>Number of Rooms:</label>
          <input
            type="number"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Number of Bathrooms:</label>
          <input
            type="number"
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Area (sq ft):</label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />
        </div>

        <button type="submit">Add Listing</button>
      </form>
    </div>
  );
}

export default AddListingPage;
