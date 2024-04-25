import React from 'react';
import './Login.css'; // Import the CSS file for styling

const Login = () => {


  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back!</h2>
        <form>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
          </div>
          <button type="submit">Login</button>
        </form>
        <p className="signup-link">Don't have an account? <a href="signup">Sign Up</a></p>
      </div>
    </div>
  );
}

export default Login;