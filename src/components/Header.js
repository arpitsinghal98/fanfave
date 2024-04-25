import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import companyLogo from '../images/comapnyLogo.png';
import companyNameImage from '../images/companyNameImage.png';

const Header = () => {
    const loggedIn = localStorage.getItem('login') === 'true';
    const location = useLocation();
    const currentUrl = window.location.pathname === '/login';

    const handleLogout = () => {
        localStorage.clear();
    };

    return (
        <div className="header-container">
            <header className="header">
                <div className="brand-container">
                    <a href="/home" onclick="navigateToHome()">
                        <img src={companyLogo} alt="Company Logo" className="company-logo" />
                        <img src={companyNameImage} alt="Company Name" className="company-name-image" />
                    </a>
                </div>
                <nav className="navigation">
                    {loggedIn ? (
                        <Link to="/login" className="login-link" onClick={handleLogout}>Logout</Link>
                    ) : (
                        !currentUrl && <Link to="/login" className="login-link">Login</Link>
                    )}
                </nav>
            </header>
        </div>
    );
};

export default Header;