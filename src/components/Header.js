import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Header.css'; 

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleAddListingClick = () => {
    if (token) {
      navigate('/add-listing');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Rental App</Link>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><span onClick={handleAddListingClick} style={{cursor: 'pointer'}}>Add Listing</span></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
