import React, { useState } from 'react';
import './EventModal.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const EventModal = ({ isVisible, onClose, onSave }) => {
    const [eventData, setEventData] = useState({
        eventName: '',
        description: '',
        date: '',
        time: '',
        location: '',
        organizer: '',
        sportType: '',
        teams: '',
        ticketInfo: '',
        capacity: '',
        image: null,
    });

    const [imageName, setImageName] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    if (!isVisible) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        // We're only interested in the first file
        const file = e.target.files[0];
        setEventData({ ...eventData, image: file });
        setImageName(file.name); // Set the image name
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(eventData).forEach(key => {
            formData.append(key, eventData[key]);
        });

        try {
            const response = await fetch('/api/createEvent', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Event created successfully');
                setSnackbarMessage('Event created successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                onClose();
            } else {
                console.error('Failed to create event:', response.statusText);
                setSnackbarMessage('Failed to create event. Please try again.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSnackbarMessage('Error submitting form. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        // Reload window after 2 seconds
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };

    return (
        <div className={`create-event-modal-backdrop ${isVisible ? 'show' : ''}`}>
            <div className="create-event-modal">
                <div className="create-event-modal-header">
                    <h2>Create New Event</h2>
                    <div className="modal-close-button-container">
                        <button className="modal-close-button" onClick={onClose}>×</button>
                    </div>
                </div>
                <form className="create-event-form" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-row full">
                        <input type="text" name="eventName" placeholder="Event Name" onChange={handleChange} required />
                    </div>
                    <div className="form-row half">
                        <input type="date" name="date" onChange={handleChange} required />
                        <input type="number" name="capacity" placeholder="Capacity" onChange={handleChange} required />
                    </div>
                    <div className="form-row half">

                        <input type="time" name="time" onChange={handleChange} required />
                        <input type="text" name="sportType" placeholder="Sport Type" onChange={handleChange} required />
                    </div>
                    <div className="form-row half">

                        <input type="text" name="ticketInfo" placeholder="Ticket Information" onChange={handleChange} />
                    </div>
                    <div className="form-row full">
                        <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
                        <input type="text" name="teams" placeholder="Teams" onChange={handleChange} />
                        <input type="text" name="organizer" placeholder="Organizer" onChange={handleChange} required />
                        <textarea name="description" placeholder="Description" onChange={handleChange} required />
                    </div>
                    <div className="form-row half">
                        <div className="image-upload-container">
                            <label htmlFor="image-upload" className="image-upload-label">
                                Upload Event Image
                            </label>
                            <input id="image-upload" type="file" name="image" className="image-upload-input" onChange={handleImageChange} accept="image/*" />
                            <span className="image-upload-instruction">{imageName || "No file chosen"}</span> {/* Display the image name */}
                        </div>
                    </div>
                    <div className="form-row full">
                        <button type="submit" className="modal-save-button">Save Event</button>
                    </div>
                </form>
            </div>
            <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default EventModal;    