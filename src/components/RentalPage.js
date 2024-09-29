// RentalPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function RentalPage() {
  const { id } = useParams(); // Get rental ID from URL
  const [rental, setRental] = useState(null);

  useEffect(() => {
    const fetchRentalDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/rental/${id}`);
        setRental(response.data);
      } catch (error) {
        console.error('Error fetching rental details:', error);
      }
    };

    fetchRentalDetails();
  }, [id]);

  if (!rental) {
    return <p>Loading rental details...</p>;
  }

  return (
    <div>
      <h1>{rental.name}</h1>
      <p>Address: {rental.address}</p>
      <p>City: {rental.city}</p>
      <p>Price: {rental.price}</p>
      <p>Description: {rental.description}</p>
      
    </div>
  );
}

export default RentalPage;
