import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import cities from '../cities.json';

function AddListingPage() {
  const { id } = useParams(); 
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
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  const isCanadianCity = (city) => {
    const cityLower = city.toLowerCase();
    return cities.some(([cityName]) => cityName.toLowerCase() === cityLower);
  };

  const resetFormFields = () => {
    setAddress('');
    setDescription('');
    setPrice('');
    setCity('');
    setName('');
    setWater(false);
    setElectricity(false);
    setInternet(false);
    setHeat(false);
    setPropertyType('');
    setRooms('');
    setBathrooms('');
    setArea('');
  };

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const fetchListing = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5000/api/listing/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setAddress(data.address);
            setDescription(data.description);
            setPrice(data.price);
            setCity(data.city);
            setName(data.name);
            setWater(data.water || false); 
            setElectricity(data.electricity || false); 
            setInternet(data.internet || false); 
            setHeat(data.heat || false); 
            setPropertyType(data.property_type);
            setRooms(data.rooms);
            setBathrooms(data.bathrooms);
            setArea(data.area);
          } else {
            setError('Failed to fetch listing details.');
          }
        } catch (err) {
          setError('An error occurred while fetching listing details.');
        }
      };

      fetchListing();
    } else {
      setIsEditMode(false);
      resetFormFields();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to add or edit a listing.');
      return;
    }

    if (!isCanadianCity(city)) {
      setError('City must be a valid Canadian city.');
      return;
    }

    try {
      const formData = {
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
      };

      const url = isEditMode
        ? `http://localhost:5000/api/update-listing/${id}`
        : 'http://localhost:5000/api/add-listing';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(isEditMode ? 'Listing updated successfully' : 'Listing added successfully');
        navigate('/profile');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>{isEditMode ? 'Edit Listing' : 'Add a New Listing'}</h1>
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

        <button type="submit">{isEditMode ? 'Update Listing' : 'Add Listing'}</button>
      </form>
    </div>
  );
}

export default AddListingPage;
