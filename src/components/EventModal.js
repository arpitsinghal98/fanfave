import React, { useState } from 'react';
import './EventModal.css';

const EventModal = ({ isVisible, onClose, onSave }) => {
    const [eventData, setEventData] = useState({
        eventName: '',
        description: '',
        dateTime: '',
        location: '',
        organizer: '',
        sportType: '',
        teams: '',
        ticketInfo: '',
        capacity: '',
        image: null,
    });

    if (!isVisible) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        // We're only interested in the first file
        const file = e.target.files[0];
        setEventData({ ...eventData, image: file });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // FormData is used for multipart/form-data for file uploads
        const formData = new FormData();
        Object.keys(eventData).forEach(key => {
            formData.append(key, eventData[key]);
        });

        // You'd need to replace this console.log with your actual save logic
        console.log('Event Data:', eventData);
        onSave(formData); // Pass the form data up for submission

        onClose(); // Close the modal
    };

    return (
        <div className={`create-event-modal-backdrop ${isVisible ? 'show' : ''}`}>
            <div className="create-event-modal">
                <div className="create-event-modal-header">
                    <h2>Create New Event</h2>
                    <button className="modal-close-button" onClick={onClose}>×</button>
                </div>
                <form className="create-event-form" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-row full">
                        <input type="text" name="eventName" placeholder="Event Name" onChange={handleChange} required />
                    </div>
                    <div className="form-row half">
                        <input type="datetime-local" name="dateTime" onChange={handleChange} required />
                        <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
                    </div>
                    <div className="form-row half">
                        <input type="text" name="organizer" placeholder="Organizer" onChange={handleChange} required />
                        <input type="text" name="sportType" placeholder="Sport Type" onChange={handleChange} required />
                    </div>
                    <div className="form-row half">
                        <input type="text" name="teams" placeholder="Teams" onChange={handleChange} />
                        <input type="text" name="ticketInfo" placeholder="Ticket Information" onChange={handleChange} />
                    </div>
                    <div className="form-row full">
                        <textarea name="description" placeholder="Description" onChange={handleChange} required />
                    </div>
                    <div className="form-row half">
                        <input type="number" name="capacity" placeholder="Capacity" onChange={handleChange} required />
                        <div className="image-upload-container">
                            <label htmlFor="image-upload" className="image-upload-label">
                                Upload Event Image
                            </label>
                            <input id="image-upload" type="file" name="image" className="image-upload-input" onChange={handleImageChange} accept="image/*" />
                            <span className="image-upload-instruction">No file chosen</span>
                        </div>
                    </div>
                    <div className="form-row full">
                        <button type="submit" className="modal-save-button">Save Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventModal;    