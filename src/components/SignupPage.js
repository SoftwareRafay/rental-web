//SignupPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const [name, setName] = useState('');  // New state for name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!passwordPattern.test(password)) {
      setError('Password must be at least 8 characters, include letters and numbers.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),  // Include name in the request
      });

      if (response.ok) {
        const data = await response.json();
        if (response.status === 201) {
          navigate('/');
        } else {
          setError(data.message || 'An unexpected error occurred.');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
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
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={() => navigate('/login')}>Login with existing account</button>
    </div>
  );
}

export default SignupPage;
