import React from 'react';
import './ContactUs.css'; // Import the CSS file for styling

const ContactUs = () => {
    return (
        <div className="contact-container">
            <h1 className="contact-heading">Get in Touch</h1>
            <p className="contact-description">We'd love to hear from you! Contact us using the form below.</p>
            <div className="contact-form-container">
                <form className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" id="name" name="name" className="form-input" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" id="email" name="email" className="form-input" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message" className="form-label">Message</label>
                        <textarea id="message" name="message" className="form-textarea" required></textarea>
                    </div>
                    <button type="submit" className="submit-button">Send Message</button>
                </form>
            </div>
            <div className="contact-info">
                <div className="info-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <p>123 Main Street, City, Country</p>
                </div>
                <div className="info-item">
                    <i className="fas fa-phone-alt"></i>
                    <p>+1 234 567 8901</p>
                </div>
                <div className="info-item">
                    <i className="fas fa-envelope"></i>
                    <p>info@example.com</p>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;
