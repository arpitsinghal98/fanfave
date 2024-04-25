import React, { useState } from 'react';
import './Login.css'; // Import the CSS file for styling

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });

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
      const response = await fetch('/api/login', { // Use your server's URL
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
        localStorage.setItem('login', 'true');
        window.location.href = "/home";
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <div className="page-background">
      <div className="login-container">
        <div className="login-box">
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
          <p className="link-text">Don't have an account? <a href="/signup" className="link-anchor">Sign Up</a></p>
          <p className="link-text">Continue as a Guest? <a href="/home" className="link-anchor">Click Here</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;