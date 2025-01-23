import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem} from '@mui/material';
import axios from 'axios';

const username = localStorage.getItem('username');
const encodedUsername = btoa(username);

const ProfileView = () => {
  const [data, setData] = useState(null); // Store profile data
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track any error
  const [openDialog, setOpenDialog] = useState(false); // Track dialog open/close state

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API2_URL}/api/customer/${encodeURIComponent(encodedUsername)}`);
        setData(response.data.data); // Assuming data is inside the "data" field
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false); // Set loading to false after the request
      }
    };

    fetchProfile();
  }, []); // Empty dependency array to fetch data only once on mount

  // Function to handle opening the dialog
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  // Function to handle closing the dialog
  const handleClose = () => {
    setOpenDialog(false);
  };

  if (loading) {
    return (
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <Typography variant="h6">No profile data available.</Typography>
      </Box>
    );
  }

  // Destructure the profile data for easy use
  const { name, username, email, dob, sex, address, active, createdAt } = data;

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f4f6f8' }}>
     {/* MenuItem to trigger profile dialog */}
     <MenuItem onClick={handleClickOpen}>
     <Typography variant="h6" gutterBottom align="center">Profile</Typography>
      </MenuItem>
      {/* Dialog for Profile View */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Profile View</DialogTitle>
        <DialogContent>
          {/* Profile Content inside Dialog */}
          <Box sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              {name.first.toUpperCase()} {name.last.toUpperCase()}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Username: <strong>{username}</strong>
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Email: <strong>{email}</strong>
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Date of Birth: <strong>{dob}</strong>
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Gender: <strong>{sex}</strong>
            </Typography>
            
            {/* Address Section */}
            <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
              Address Information
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Street:</strong> {address.street}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>City:</strong> {address.city}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>State:</strong> {address.state}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>ZIP:</strong> {address.zip}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Country:</strong> {address.country}
            </Typography>

            {/* Account Status Section */}
            <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
              Account Status
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Account Status: <strong>{active ? 'Active' : 'Inactive'}</strong>
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Created At: <strong>{new Date(createdAt).toLocaleDateString()}</strong>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileView;
