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

    const isValidStep1 = (formData) => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.confirmEmail || !formData.password || !formData.confirmPassword) {
            console.log("All fields must be filled out.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            console.log("Please enter a valid email address.");
            return false;
        }

        if (formData.password.length < 8) {
            console.log("Password must be at least 8 characters long.");
            return false;
        }

        return true;
    };

    const sendSignupRequest = async (userDoc) => {
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDoc),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                window.location.href = "/login";
            }
        } catch (error) {
            console.error('There was an error creating the user:', error);
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (step === 1) {
            if (isValidStep1(formData)) {
                setStep(2);
            } else {
                alert("Please correct the errors in the form.");
            }
        } else {
            try {
                await sendSignupRequest(formData);
            } catch (error) {
                console.error(error);
                alert("An error occurred during signup.");
            }
        }
    };

    return (
        <div className="page-background">
            <div className="signup-container">
                <div className="signup-box">
                    {step === 1 && (
                        <>
                            <h2 className="header2">Create Account</h2>
                            <br />
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="input-group half-width">
                                        <label className="label" htmlFor="firstName">First Name</label>
                                        <input className="input-text" type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                    </div>
                                    <div className="input-group half-width">
                                        <label className="label" htmlFor="lastName">Last Name</label>
                                        <input className="input-text" type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="input-group half-width">
                                        <label className="label" htmlFor="email">Email</label>
                                        <input className="input-email" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="input-group half-width">
                                        <label className="label" htmlFor="confirmEmail">Confirm Email</label>
                                        <input className="input-email" type="email" id="confirmEmail" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="input-group half-width">
                                        <label className="label" htmlFor="password">Password</label>
                                        <input className="input-password" type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                                    </div>
                                    <div className="input-group half-width">
                                        <label className="label" htmlFor="confirmPassword">Confirm Password</label>
                                        <input className="input-password" type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                                    </div>
                                </div>
                                <br />
                                <button className="button" type="button" onClick={() => setStep(2)}>Next</button>
                            </form>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <h2 className="header2">Create Account</h2>
                            <br />
                            <h3>We wanna know you better. Please select the sport(s) in which you are interested.</h3>
                            <br />
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
                            <button className="button" type="button" onClick={handleSubmit}>Sign Up</button>
                            <br />
                            <br />
                            <p className="link-text">Missed Something? <a href="#" className="link-anchor" onClick={() => setStep(1)}>Go Back</a></p>
                        </>
                    )}
                    <p className="login-link-text">Already have an account? <a className="link" href="/login">Login</a></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;