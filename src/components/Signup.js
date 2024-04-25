import React, { useState } from 'react';
import './Signup.css'; // Ensure you have a corresponding CSS file for styling

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        confirmEmail: '', // Added confirmEmail
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the signup logic here
        // Make sure to validate that passwords match, etc.
        console.log(formData);
        // You would typically send this data to your backend service
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="input-group half-width">
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="input-group half-width">
                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group half-width">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="input-group half-width">
                            <label htmlFor="confirmEmail">Confirm Email</label>
                            <input type="email" id="confirmEmail" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group half-width">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="input-group half-width">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit">Sign Up</button>
                </form>
                <p className="login-link">Already have an account? <a href="/">Login</a></p>
            </div>
        </div>
    );
}

export default Signup;