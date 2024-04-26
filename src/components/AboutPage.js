import React from 'react';
import './AboutPage.css';

const AboutPage = () => {

    const teamMembers = [
        {
            name: "John Doe",
            description: "John's description...",
            photo: "/path/to/johns_photo.jpg", // make sure the path is correct
            alt: "John Doe",
        },
        {
            name: "Almeda Smith",
            description: "Almeda's description...",
            photo: "/path/to/almedas_photo.jpg",
            alt: "Almeda Smith",
        },
        {
            name: "Amny Gale",
            description: "Amny's description...",
            photo: "/path/to/amnys_photo.jpg",
            alt: "Amny Gale",
        },
    ];

    return (
        <div className="about-page-container">
            <section className="about-hero-section">
                <h1>About FanFave</h1>
                <p>Discover the passion behind our platform that brings sports fans together.</p>
            </section>

            <section className="about-content-section">
                <div className="about-description">
                    <h2>Who We Are</h2>
                    <p>At FanFave, we're not just a platform; we're a gathering place for the heartbeat of every game—its fans. Born from a passion for the roar of the crowd and the thrill of the game, FanFave stands as a beacon for sports enthusiasts worldwide.</p>
                    <p>Here, in the digital stands of FanFave, the game never ends. Whether you're a die-hard follower of football, a basketball aficionado, or a baseball buff, you're home. We bring the spectacle of sports right to your fingertips, bridging distances and connecting fans across the globe in a shared celebration of human potential.</p>
                </div>

                <div className="about-mission">
                    <h2>Our Mission</h2>
                    <p>Our mission is simple yet profound: to cultivate a space where fans can come together to revel in their passion for sports. We believe in creating an experience that's more than just schedules and scores. We're about the shared experiences, the community conversations, and the personal stories that turn spectators into legends.</p>
                    <ul>
                        <li>Empowering Fans: We give you a voice and a place to connect, discuss, and engage with your favorite sports on a deeper level.</li>
                        <li>Enriching Experiences: Through immersive content, real-time updates, and comprehensive guides, we enhance your enjoyment of every game.</li>
                        <li>Elevating Every Event: From local scrimmages to international championships, we highlight the moments that matter, ensuring you never miss a beat.</li>
                    </ul>
                    <p>Join us in building the most vibrant and inclusive community where every cheer, every triumph, and every fan is celebrated. Because here at FanFave, every game is a home game.</p>
                </div>
            </section>
            <section className="about-team-section">
                {teamMembers.map((member, index) => (
                    <div className="team-member" key={index}>
                        <img src={member.photo} alt={member.alt} className="team-member-photo" />
                        <div className="team-member-description">
                            <h3>{member.name}</h3>
                            <p>{member.description}</p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default AboutPage;