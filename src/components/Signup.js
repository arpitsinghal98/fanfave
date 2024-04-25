import React, { useState } from 'react';
import './Signup.css';

const Signup = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: '',
        interests: [],
    });

    const sportsOptions = [
        'Basketball', 'Soccer', 'Tennis', 'Swimming', 'Boxing',
        'NASCAR', 'Archery', 'Cricket', 'MotoGP', 'Kabaddi'
    ];

    const handleSelectSport = (sport) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            interests: prevFormData.interests.includes(sport)
                ? prevFormData.interests.filter(s => s !== sport)
                : [...prevFormData.interests, sport]
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 1) {
            // Move to the next step
            setStep(2);
        } else {
            // Handle the final submission here
            console.log(formData);
            // You would typically send this data to your backend service
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                {step === 1 && (
                    <>
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

                            <button type="button" onClick={() => setStep(2)}>Next</button>
                        </form>
                    </>
                )}
                {step === 2 && (
                    <>
                        <h2>We want to know you better. Please select the sports in which you are interested.</h2>
                        <div className="interests-grid">
                            {sportsOptions.map(sport => (
                                <div key={sport} className="interests-option">
                                    <input
                                        type="checkbox"
                                        id={sport}
                                        name="interests"
                                        value={sport}
                                        checked={formData.interests.includes(sport)}
                                        onChange={() => handleSelectSport(sport)}
                                    />
                                    <label htmlFor={sport}>{sport}</label>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => setStep(1)}>Back</button>
                        <br/>
                        <br/>
                        <button type="button" onClick={handleSubmit}>Sign Up</button>
                    </>
                )}
                <p className="login-link">Already have an account? <a href="/">Login</a></p>
            </div>
        </div>
    );
}

export default Signup;