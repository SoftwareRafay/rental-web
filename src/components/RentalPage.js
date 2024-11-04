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

  // Construct the mailto link for contacting the owner
  const contactOwner = `mailto:${rental.ownerEmail}?subject=Inquiry about ${rental.name}`;

  // Utility display logic
  const utilities = [];
  if (rental.water) utilities.push('Water');
  if (rental.electricity) utilities.push('Electricity');
  if (rental.internet) utilities.push('Internet');
  if (rental.heat) utilities.push('Heat');

  return (
    <div>
      <h1>{rental.name}</h1>
      <p><strong>Address:</strong> {rental.address}</p>
      <p><strong>City:</strong> {rental.city}</p>
      <p><strong>Price:</strong> ${rental.price}</p>
      <p><strong>Description:</strong> {rental.description}</p>
      <p><strong>Property Type:</strong> {rental.property_type}</p>
      <p><strong>Rooms:</strong> {rental.rooms}</p>
      <p><strong>Bathrooms:</strong> {rental.bathrooms}</p>
      <p><strong>Area:</strong> {rental.area} sq ft</p>

      {/* Display utilities if any are available */}
      <p><strong>Utilities:</strong> {utilities.length > 0 ? utilities.join(', ') : 'None'}</p>

      {/* Contact Owner button */}
      <button onClick={() => window.location.href = contactOwner}>
        Contact Owner
      </button>
    </div>
  );
}

export default RentalPage;
