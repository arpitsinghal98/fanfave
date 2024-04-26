import React, { useState } from 'react';
import './Login.css'; // Import the CSS file for styling
import Signup from './Signup'; // Import the Signup component

const Login = ({ onClose, onShowSignup }) => {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevCredentials => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      else {
        const data = await response.json();
        const userInterests = data.interests;
        localStorage.setItem('login', 'true');
        localStorage.setItem('interests', userInterests);
        setLoginSuccess(true); // Set login success state to true
        setTimeout(() => {
          onClose(); // Close the modal
          window.location.reload(); // Refresh the page after a delay
        }, 1000); // 3000 milliseconds (3 seconds) delay
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="login-container">
        <div className="login-box">
          {loginSuccess && (
            <div className="success-banner">
              Login successful!
            </div>
          )}
          <h2 className="header-title">Login</h2>
          <form onSubmit={handleLogin} className="form-container">
            <div className="input-group">
              <label htmlFor="email" className="input-label">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                className="input-field"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="input-field"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="action-button">Login</button>
          </form>
          <p className="link-text">
            Don't have an account?{' '}
            <button
              className="link-anchor"
              onClick={() => {
                onShowSignup(); // This will trigger the handleShowSignup function in Header.js
              }}
            >
              Sign Up
            </button>
          </p>
          <p className="link-text">Continue as a Guest? <a href="/home" className="link-anchor">Click Here</a></p>
        </div>
      </div>
      {showSignupModal && <Signup onClose={() => setShowSignupModal(false)} />}
    </div>
  );
}

export default Login;