import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

function WelcomePage() {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        backgroundImage: "url('/images/image01.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        px: 2, // Padding for responsiveness
      }}
    >
      {/* Login Button */}
      <Button
        component={Link}
        to="/login"
        variant="contained"
        sx={{
          bgcolor: '#0047ba',
          position: 'absolute',
          top: 16, // Top-right for all screen sizes
          right: 16,
          fontSize: { xs: '0.8rem', sm: '1rem' },
          py: 1,
          px: 3,
          borderRadius: 2,
        }}
      >
        Login
      </Button>

      {/* Text Content */}
      {/* <Box
        sx={{
          position: 'absolute',
          top: { xs: 'auto', sm: 80 }, // Move below button on mobile
          bottom: { xs: 100, sm: 'auto' }, // Maintain spacing for mobile
          left: '50%',
          transform: 'translateX(-50%)', // Center horizontally
          textAlign: 'center',
          width: '100%', // Ensures proper alignment on small screens
          px: 2,
          display: 'flex',
          flexDirection: 'column', // Stack text
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            bgcolor: '#000',
            // color: '#0047ba',
            color: '#fff',
            mb: 2,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            // fontWeight: 'bold',
          }}
        >
          Welcome to Credit Card Management Portal
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{
            color: '#000',
            mb: 2,
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            fontWeight: 'bold',
          }}
        >
          Manage your accounts, track expenses, and stay on top of your finances.
        </Typography>
      </Box> */}
    </Box>
  );
}

export default WelcomePage;
