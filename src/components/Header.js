import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import companyLogo from '../images/comapnyLogo.png';
import companyNameImage from '../images/companyNameImage.png';
import Login from './Login';
import Signup from './Signup'; // Import your signup modal component

const Header = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false); // Add this line
    const [showLogoutBanner, setShowLogoutBanner] = useState(false);
    const loggedIn = localStorage.getItem('login') === 'true';

    const handleLogout = () => {
        
        setShowLogoutBanner(true); // Show logout banner
        setTimeout(() => {
            setShowLogoutBanner(false);
            localStorage.clear();
            window.location.href = "/"; // Navigate to home page
        }, 3000); // 3000 milliseconds (3 seconds) delay
    };

    const handleShowSignup = () => {
        setShowLoginModal(false); // This will close the Login modal
        setShowSignupModal(true); // This will open the Signup modal
    };

    const handleShowLogin = () => {
        setShowLoginModal(true); // This will open the Login modal
        setShowSignupModal(false); // This will close the Signup modal if it's open
    };

    return (
        <div className="header-container">
            <header className="header">
                <div className="brand-container">
                    <Link to="/home">
                        <img src={companyLogo} alt="Company Logo" className="company-logo" />
                        <img src={companyNameImage} alt="Company Name" className="company-name-image" />
                    </Link>
                </div>
                <nav className="navigation">
                    {loggedIn ? (
                        <Link className="login-link" onClick={handleLogout}>Logout</Link>
                    ) : (
                        <Link className="login-link" onClick={() => setShowLoginModal(true)}>Login</Link>
                    )}
                </nav>
            </header>
            {/* Render the login modal if showLogin state is true */}
            {showLoginModal && <Login onClose={() => setShowLoginModal(false)} onShowSignup={handleShowSignup} />}
            {showSignupModal && <Signup onClose={() => setShowSignupModal(false)} onShowLogin={handleShowLogin} />}
            {showLogoutBanner && <div className="logout-banner">Logging Out!</div>}
        </div>
    );
};

export default Header;