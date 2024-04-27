import React, { useState, useEffect } from 'react';
import './ManageViewEvents.css'; // Import CSS for modal styles

const ManageViewEvents = ({ show, onClose }) => {
    const [events, setEvents] = useState([]);

    // Function to fetch events from the API
    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events');
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            const data = await response.json();
            setEvents(data.events);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    // Effect to fetch events on component mount
    useEffect(() => {
        if (show) {
            fetchEvents();
        }
    }, [show]);

    // Conditional rendering based on the 'show' prop
    return show ? (
        <div className="modal display-block">
            <div className="modal-main">
                <button className="modal-close-button" onClick={onClose}>×</button>
                <h2 className='modal-header'>Manage Events</h2>
                <div className="event-cards-container">
                    {events.map((event, index) => (
                        <div key={index} className="event-card">
                            <div className="event-image-container">
                                <img src={event.image} alt={event.eventName} className="event-image" />
                            </div>
                            <div className="event-details">
                                <h3>{event.eventName}</h3>
                                <p><strong>Location:</strong> {event.location}</p>
                                <p><strong>Sport Type:</strong> {event.sportType}</p>
                                <p><strong>Time:</strong> {event.time}</p>
                                <p><strong>Ticket Info:</strong> {event.ticketInfo}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ) : null;
};

export default ManageViewEvents;