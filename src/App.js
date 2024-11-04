import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import MapPage from './components/MapPage';
import SignupPage from './components/SignupPage';
import AddListingPage from './components/AddListing'; 
import RentalPage from './components/RentalPage';  
import ProfilePage from './components/ProfilePage';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/add-listing" element={<AddListingPage />} /> 
        <Route path="/rental/:id" element={<RentalPage />} /> 
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-listing/:id" element={<AddListingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
