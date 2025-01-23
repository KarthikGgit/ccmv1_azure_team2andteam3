import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Tooltip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { getJwtToken, validateJwt, removeJwtToken } from './LoginPage';
import axios from "axios";
import Top10 from './Top10';
import ProfileView from './ProfileView'

function Dashboard() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isValidToken, setIsValidToken] = useState(null); // Track token validation status
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    // const axios = require('axios').default;
    const token=getJwtToken();

    const options = {
      method: 'POST',
      // url: '/api1/api/customer/logout',
      url: `${process.env.REACT_APP_API1_URL}/api/customer/logout`,
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      }
    };

    try {
      const { data } = await axios(options);
      console.log(data);
      } catch (error) {
      // Handle the error silently
      if (error.response.status === 403) {
        console.warn("Suppressed 403 error.");
      } else {
        console.error(error); // Log other errors if necessary
      }
    }
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    // Validate the JWT token on component mount
    const validateToken = async () => {
      const token = getJwtToken();
      if (!token) {
        alert('No token found. Redirecting to login page.');
        handleLogout();
        return;
      }

      const isValid = await validateJwt(token);     
      if (isValid) {
        setIsValidToken(true);
      } else {
        alert('Invalid JWT session token. Redirecting to login page.');
        handleLogout();
      }
    };

    validateToken();
  }, []);

  if (isValidToken === null) {
    // Show a loading state while the token validation is in progress
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: '#f4f6f8',
          color: '#333',
        }}
      >
        <Typography variant="h6">Validating session...</Typography>
      </Box>
    );
  }

  if (!isValidToken) {
    return null; // Redirect will occur in the `useEffect`, so nothing to render here
  }

  const firstName = localStorage.getItem('userNameFirst');
  const lastName = localStorage.getItem('userNameLast');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: '#f4f6f8',
        color: '#333',
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          bgcolor: '#0047ba',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img
            src="/images/image03.png"
            alt="Logo"
            style={{ height: 40, width: 'auto' }}
          />
          <Typography variant="h4" component="h1">
            Cards Manager
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              display: { xs: 'none', sm: 'block' },
              color: '#fff',
            }}
          >
            Welcome {firstName.toUpperCase()} {lastName.toUpperCase()}  
          </Typography>
          <Tooltip title="Account Menu">
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar alt={`${firstName} ${lastName}`} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                boxShadow: 3,
                borderRadius: 2,
                minWidth: 200,
              },
            }}
          >
          <MenuItem>
  <ProfileView isValidToken={isValidToken} />
</MenuItem>
<Divider />
<MenuItem onClick={handleLogout}>
  <Typography color="error">Logout</Typography>
</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Body */}
      <Box
        component="div"
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        {/* Sidebar */}
        <Box
          component="aside"
          sx={{
            bgcolor: '#94a2b8',
            color: '#000',
            width: { xs: '100%', sm: '250px' },
            p: 2,
          }}
        >
          <List>
            
            <ListItem disablePadding>
              <ListItemButton component="a" href="/managecards">
                <ListItemText primary="Manage Cards" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/viewexpenses">
                <ListItemText primary="View Expenses" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: 2,
            textAlign: 'center',
            bgcolor: '#fff',
            color: '#333',
          }}
        >
          <Box>
      
      {/* Render Top10 component */}
      <Top10
        isValidToken={isValidToken}
      />
    </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;