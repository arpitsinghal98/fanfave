import React, { useState, useEffect } from 'react';
import './ManageViewEvents.css'; // Import CSS for modal styles
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, CardActions, Dialog, Typography, DialogActions, DialogContent, DialogTitle, Button, Card } from '@mui/material';

const ManageViewEvents = ({ show, onClose }) => {
    const [events, setEvents] = useState([]);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [eventIdToDelete, setEventIdToDelete] = useState(null);
    const [error, setError] = useState(null);

    const isAdmin = localStorage.getItem('role') === 'Admin';

    useEffect(() => {
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

        if (show) {
            fetchEvents();
        }
    }, [show]);

    // Use this useEffect to log the events after they have been updated
    useEffect(() => {
        if (events.length > 0) {
            console.log("Logging event images:");
            events.forEach(event => {
                console.log(event.image);  // Assuming 'image' is the key where image URLs are stored
            });
        }
    }, [events]);

    const handleDeleteClick = (e, eventId) => {
        e.stopPropagation(); // Prevent the click from triggering other click events
        console.log(eventId);
        setEventIdToDelete(eventId);
        setDeleteConfirmationOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`/api/deleteevent/${eventIdToDelete}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                console.log('Event Deleted');
                setEvents(prevEvents => prevEvents.filter(event => event.id !== eventIdToDelete)); // Use 'id' to filter
                setDeleteConfirmationOpen(false);
            } else {
                throw new Error('Failed to delete the event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            setError('An error occurred while deleting the event');
        }
    };

    // Conditional rendering based on the 'show' prop
    return show ? (
        <div className="modal display-block">
            <div className="modal-main">
                <button className="modal-close-button" onClick={onClose}>×</button>
                <h2 className="modal-header">Events</h2>
                <div className="event-cards-container">
                    {events.map((event, index) => (
                        <div key={index} className="event-card">
                            <div className="event-image-container">
                            <img src={`${process.env.PUBLIC_URL}/${event.image}`} alt={event.eventName} className="event-image" />
                            </div>
                            <div className="event-details">
                                <h3>{event.eventName}</h3>
                                <p><strong>Date:</strong> {event.date}</p>
                                <p><strong>Time:</strong> {event.time}</p>
                                <p><strong>Location:</strong> {event.location}</p>
                                <p><strong>Organizer:</strong> {event.organizer}</p>
                                <p><strong>Sport Type:</strong> {event.sportType}</p>
                                <p><strong>Teams:</strong> {event.teams}</p>
                                <p><strong>Ticket Info:</strong> {event.ticketInfo}</p>
                                <p><strong>Capacity:</strong> {event.capacity}</p>
                            </div>
                            {isAdmin && (
                                <CardActions className='card-actions'>
                                    <IconButton onClick={(e) => handleDeleteClick(e, event.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
                <DialogTitle>Delete Post</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this post?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    ) : null;
};

export default ManageViewEvents;