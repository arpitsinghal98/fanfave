import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Snackbar, Alert } from '@mui/material';

const EditEventModal = ({ eventId, open, onClose, onSave }) => {

  const [eventData, setEventData] = useState({
    eventName: '',
    date: '',
    time: '',
    location: '',
    organizer: '',
    sportType: '',
    teams: '',
    ticketInfo: '',
    capacity: ''
  });
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/geteventtoupdate/${eventId}`);
        console.log(response);
        const data = await response.json();
        if (response.ok) {
          setEventData(data);
        } else {
          console.error('Failed to fetch event details');
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorSnackbarOpen(true); // Show error snackbar if there's a network or server error
      }
    };

    if (eventId && open) {
      fetchEventDetails();
    }
  }, [eventId, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/updateevent/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      if (response.ok) {
        setSuccessSnackbarOpen(true);
        setTimeout(() => {
          onSave(); // This function should trigger a refresh of the event list in the parent component.
          setSuccessSnackbarOpen(false);
          onClose(); // Optionally close the modal on save
        }, 2000); // Wait for 2 seconds before executing these actions
      } else {
        setErrorSnackbarOpen(true);
        setTimeout(() => {
          setErrorSnackbarOpen(false);
        }, 2000); // Display error for 2 seconds then close it
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorSnackbarOpen(true);
      setTimeout(() => {
        setErrorSnackbarOpen(false);
      }, 2000); // Display error for 2 seconds then close it
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessSnackbarOpen(false);
    setErrorSnackbarOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>Edit Event</DialogTitle>
      <DialogContent sx={{ padding: 3 }}>
        <TextField
          sx={{ marginBottom: 2 }}
          margin="dense"
          label="Event Name"
          type="text"
          fullWidth
          variant="outlined"
          name="eventName"
          value={eventData.eventName}
          onChange={handleChange}
        />
        <TextField
          sx={{ marginBottom: 2 }}
          margin="dense"
          label="Date"
          type="date"
          fullWidth
          variant="outlined"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          sx={{ marginBottom: 2 }}
          margin="dense"
          label="Time"
          type="time"
          fullWidth
          variant="outlined"
          name="time"
          value={eventData.time}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          sx={{ marginBottom: 2 }}
          margin="dense"
          label="Location"
          type="text"
          fullWidth
          variant="outlined"
          name="location"
          value={eventData.location}
          onChange={handleChange}
        />
        <TextField
          sx={{ marginBottom: 2 }}
          margin="dense"
          label="Organizer"
          type="text"
          fullWidth
          variant="outlined"
          name="organizer"
          value={eventData.organizer}
          onChange={handleChange}
        />
        <TextField
         sx={{ marginBottom: 2 }}
          margin="dense"
          label="Sport Type"
          type="text"
          fullWidth
          variant="outlined"
          name="sportType"
          value={eventData.sportType}
          onChange={handleChange}
        />
        <TextField
         sx={{ marginBottom: 2 }}
          margin="dense"
          label="Teams"
          type="text"
          fullWidth
          variant="outlined"
          name="teams"
          value={eventData.teams}
          onChange={handleChange}
        />
        <TextField
          sx={{ marginBottom: 2 }}
          margin="dense"
          label="Ticket Info"
          type="text"
          fullWidth
          variant="outlined"
          name="ticketInfo"
          value={eventData.ticketInfo}
          onChange={handleChange}
        />
        <TextField
          sx={{ marginBottom: 2 }}
          margin="dense"
          label="Capacity"
          type="number"
          fullWidth
          variant="outlined"
          name="capacity"
          value={eventData.capacity}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Save</Button>
      </DialogActions>
      <Snackbar open={successSnackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Event updated successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={errorSnackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          Failed to update the event. Please try again.
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default EditEventModal;