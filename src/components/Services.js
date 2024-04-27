import React from 'react';
import './Services.css';
import service1 from '../images/service1.jpg';
import service2 from '../images/service2.jpg';
import service3 from '../images/service3.jpg';

const Services = () => {
    return (
        <div className="services-container">
            <h1 className="services-heading">Our Premium Services</h1>
            <p className="services-description">Explore our meticulously crafted services designed to elevate your experience.</p>
            <div className="service-card">
                <img src={service1} alt="Service 1" className="service-image" />
                <div className="service-details">
                    <h2 className="service-title">Custom Web Development</h2>
                    <p className="service-description">Tailored solutions for your unique business needs. From dynamic websites to complex web applications, we deliver excellence.</p>
                    <button className="service-button">Learn More</button>
                </div>
            </div>
            <div className="service-card">
            <img src={service2} alt="Service 2" className="service-image" />
                <div className="service-details">
                    <h2 className="service-title">Digital Marketing Strategy</h2>
                    <p className="service-description">Unlock your brand's potential with our data-driven digital marketing strategies. From SEO to social media management, we've got you covered.</p>
                    <button className="service-button">Learn More</button>
                </div>
            </div>
            <div className="service-card">
            <img src={service3} alt="Service 3" className="service-image" />
                <div className="service-details">
                    <h2 className="service-title">E-commerce Solutions</h2>
                    <p className="service-description">Transform your online presence with our comprehensive e-commerce solutions. Seamlessly integrate payment gateways and optimize your sales funnel.</p>
                    <button className="service-button">Learn More</button>
                </div>
            </div>
        </div>
    );
}

export default Services;
