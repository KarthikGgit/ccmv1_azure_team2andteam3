import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddCircleIcon from '@mui/icons-material/AddCircle'; 
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { getJwtToken, removeJwtToken, validateJwt } from './LoginPage';
import AddCreditCardDialog from "./AddCreditCard";


const CreditCard = ({ card, onClick }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleDetails = () => {
    // setShowDetails(!showDetails);
    setShowDetails((prev) => !prev);
    if (!showDetails) {
      setTimeout(() => {
        setShowDetails(false);
      }, 5000);
    }
  };
  const [isEnabled, setIsEnabled] = useState(card.status === "enabled");
  const username = localStorage.getItem('username');
  const encodedUsername=btoa(username);
  const handleActiveStatus = async () => {
    
    try {
        // Toggle the card status via the API
        const response = await axios.put(`${process.env.REACT_APP_API2_URL}/api/customer/creditcard/togglecreditcard/${encodeURIComponent(encodedUsername)}/${card.creditCardId}/toggle`);
        if (response.status === 200) {
            // Toggle the card's active state
            const newStatus = !isEnabled;
            setIsEnabled(newStatus);  // Update state

            // Log the new status after updating the state
            console.log(`${card.creditCardNumber} ${newStatus ? 'Enabled' : 'Disabled'}`);
        }
    } catch (error) {
        const errorMessage = `Error: Activate/Disable Card, ${error.message}`;
        // Toastify({
        //     text: `${errorMessage}`,
        //     duration: 3500,
        //     gravity: 'center',
        //     position: 'right',
        //     backgroundColor: '#FFEFD5',
        //     className: "large-toast",
        // }).showToast();
        
        // If the API call fails, revert the state
        setIsEnabled(!setIsEnabled);  // Revert to the original state
    }
};
  

  return (    
   
    <Card
      sx={{
        width: 320,
        height: 200,
        backgroundColor: "#0047ba",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 2,
        position: "relative",
        cursor: "pointer",
        boxShadow: 3,
        transition: "transform 0.3s ease",
        "&:hover": { transform: "scale(1.05)" },
      }}
      // onClick={() => onClick(card.creditCardId)}
    >
      <Typography variant="h7" sx={{ marginLeft: 0, marginTop: -1, fontSize: 11 }}>
        Card ID: {`${card.creditCardId}`}
      </Typography>
      
      <Box sx={{ display: "flex", justifyContent: "space-between", marginLeft: 0 }}>
        <Box
          component="img"
          src="/images/WMT-Spark-SparkYellow-RGB.svg"
          alt="Spark Logo"
          sx={{ width: 40, height: 40, marginTop: 0 }}
        />
        <Box
          component="img"
          src="/images/WMT-Wordmark-Small-TrueBlue-White-RGB.svg"
          alt="Walmart Logo"
          sx={{ width: 100, height: 75, marginTop: -2 }}
        />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ letterSpacing: 2, textAlign: "center" }}>
          {showDetails
            ? card.creditCardNumber.replace(/-/g, " ") // Show the full number when `showDetails` is true and replace the "-" with space
            : `•••• •••• •••• ${card.creditCardNumber.slice(-4)}`}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ fontSize: 9 }}>Card Holder</Typography>
            <Typography variant="body2">{card.holder}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontSize: 9 }}>CVV</Typography>
            <Typography variant="body2">
              {showDetails
                ? card.cvv // Show the full CVV when `showDetails` is true
                : `•••` // Mask CVV when false
              }
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontSize: 9 }}>Valid Till</Typography>
            <Typography variant="body2">{`${card.expiryMonth}/${card.expiryYear}`}</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginLeft: 0 }}>
        <IconButton onClick={handleToggleDetails} sx={{ color: "#fff" }}>
          {showDetails ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>

        <Box
          component="img"
          src={
            card.wireTransactionVendor.toLowerCase() === "rupay" ? "/images/rupay_logo.png" :
            card.wireTransactionVendor.toLowerCase() === "visa" ? "/images/visa_logo.png" :
            card.wireTransactionVendor.toLowerCase() === "mastercard" ? "/images/mastercard_logo.png" :
            "/images/default_logo.png" // Default logo if none of the above match
          }
          alt={`${card.wireTransactionVendor} Logo`}
          sx={{
            marginBottom: -10,
            width: card.wireTransactionVendor.toLowerCase() === "visa" ? 80 :
              card.wireTransactionVendor.toLowerCase() === "mastercard" ? 90 :
              card.wireTransactionVendor.toLowerCase() === "rupay" ? 100 : 70,
            height: card.wireTransactionVendor.toLowerCase() === "visa" ? 45 :
              card.wireTransactionVendor.toLowerCase() === "mastercard" ? 50 :
              card.wireTransactionVendor.toLowerCase() === "rupay" ? 60 : 40,
          }}
        />

        {/* Toggle switch for "Enabled" or "Disabled" */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" sx={{ color: "#fff", mr: 1 }}>
            {isEnabled ? "Enabled" : "Disabled"}
          </Typography>
          <Switch
            checked={isEnabled}
            onChange={handleActiveStatus}
            sx={{ color: "#fff" }}
          />
        </Box>
      </Box>
    </Card>
  );
};




function ManageCards() {
  
  const username = localStorage.getItem('username');
  const encodedUsername=btoa(username);
 
  const [selectedCard, setSelectedCard] = useState(null);
  const [numTransactions, setNumTransactions] = useState("");
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const [creditCards, setCreditCards] = useState([]); // Assume this is already populated
  const [openDialog, setOpenDialog] = useState(false); // State for controlling dialog visibility

  const handleOpenDialog = () => {
    setOpenDialog(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
  };

  
  const [isValidToken, setIsValidToken] = useState(null); // Track token validation status

  

  

 
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

  useEffect(() => {
    const fetchCreditCards = async () => {
      try {
        // console.log(encodedUsername);
        // const encodedUsername="YWNoaWxsZXli";
        const response = await axios.get(
          // "/api2/api/customer/creditcard/listcreditcards/YWNoaWxsZXli",       
          `${process.env.REACT_APP_API2_URL}/api/customer/creditcard/listcreditcards/${encodedUsername}`,   //uncomment to use encoded username
           // "/api2/api/customer/creditcard/listcreditcards/achilleyb",       
        {
          params: {showFullNumber: 'true'},
        }
        );
        const data = response.data;
        console.log(response.data);
        // const activeCards = data.creditcards
        //   .filter((card) => card.status === "enabled")
        //   .map((card) => ({
        //     ...card,
        //     holder: data.nameOnTheCard,
        //   }));
          
        const allCards = data.creditcards
  .map((card) => ({
    ...card,
    holder: data.nameOnTheCard,
    status: card.status === "enabled" ? "enabled" : "disabled", // add status based on the card's current status
  }));
        setCreditCards(allCards);
      } catch (error) {
        console.error("Failed to fetch credit cards:", error);
      }
    };

    fetchCreditCards();
  }, []);

 


  
  const goToHome = () => {
    navigate("/dashboard");
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
    {
    return (
        <Box sx={{ padding: 3, minHeight: "100vh", backgroundColor: "#bfbaba" }}>
        <Button
            variant="contained"
            color="primary"
            onClick={goToHome}
            sx={{ position: "absolute", top: 16, right: 16 }}
        >
            Home
        </Button>

        <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{ position: "absolute", top: 16, left: 16}}
        >
            Logout
        </Button>

        <Typography
            variant="h4"
            align="center"
            sx={{ marginTop: 5, marginBottom: 4 }}
        >
           Your Credit Cards
        </Typography>

        <Grid container spacing={3} justifyContent="center">
        {creditCards.length === 0 ? (
          <Typography>Loading credit cards...</Typography>
        ) : (
          creditCards.map((card) => (
            <Grid item key={card.creditCardId}>
              <CreditCard card={card} />
            </Grid>
          ))
        )}

        {/* Add New Credit Card Icon */}
        <Grid item>
          <IconButton
            color="primary"
            onClick={handleOpenDialog} // Open dialog to add a new card
            sx={{ fontSize: 40 }} // Adjust size if needed
          >
         
          </IconButton>
        </Grid>
      </Grid>

      {/* AddCreditCardDialog */}
      <AddCreditCardDialog open={openDialog} onClose={handleCloseDialog} />
        

       
        </Box>
    );
    }
}

export default ManageCards;
