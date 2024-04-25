import React from 'react';
import { SocialIcon } from 'react-social-icons'
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h3>About Us</h3>
                    <p>We are dedicated to bringing you the best sports event recommendations tailored to your interests and location. Explore top sports events and ensure you never miss a game!</p>
                </div>
                <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                    </ul>
                </div>
                <div className="footer-section social">
                    <h3>Follow Us</h3>
                    <div className="social-links">
                        <SocialIcon network="facebook" />
                        <SocialIcon network="twitter" />
                        <SocialIcon network="instagram" />
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Sports AI | Designed by YourCompany</p>
            </div>
        </footer>
    );
};

export default Footer;
