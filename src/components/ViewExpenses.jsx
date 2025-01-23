import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { getJwtToken, removeJwtToken, validateJwt } from './LoginPage';

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
      onClick={() => onClick(card.creditCardId)}
    >    
        <Typography variant="h7" sx={{ marginLeft: 0, marginTop: -1, fontSize: 11 }}>Card ID: {`${card.creditCardId}`}</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", marginLeft: 0}}>
            <Box
                component="img"
                src="/images/WMT-Spark-SparkYellow-RGB.svg"
                alt="Spark Logo"
                sx={{ width: 40, height: 40, marginTop: 0 }}
            />
            {/* <Typography variant="h7" sx={{ marginLeft: 5, marginTop: -1 }}>Card ID: {`${card.creditCardId}`}</Typography> */}

            <Box
                component="img"
                src="/images/WMT-Wordmark-Small-TrueBlue-White-RGB.svg"
                alt="Walmart Logo"
                sx={{ width: 100, height: 75, marginTop: -2 }}
            />
            {/* <Typography variant="h6" component="div" sx={{ color: "#ffcc00", marginTop: 0.5 }}>
            Walmart
            </Typography> */}

        </Box>


        <Box>
            <Typography variant="h6" sx={{ letterSpacing: 2, textAlign: "center" }}>

            {
              showDetails 
              ? card.creditCardNumber.replace(/-/g, " ")                // Show the full number when `showDetails` is true and replace the "-" with space
              : `•••• •••• •••• ${card.creditCardNumber.slice(-4)}`     // Mask all but the last 4 digits when false
            }

            </Typography>
            
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }} >
                <Box>
                    <Typography variant="caption" sx={{fontSize:9}}>Card Holder</Typography>
                    <Typography variant="body2" >{card.holder}</Typography>
                </Box>

                <Box>
                    <Typography variant="caption" sx={{fontSize:9}}>CVV</Typography>
                    {/* <Typography variant="body2">{`${card.cvv}`}</Typography> */} 
                    <Typography variant="body2">
                    {
                    showDetails 
                    ? card.cvv    // Show the full cvv number when `showDetails` is true 
                    : `•••`       // Mask all digits when false
                    }
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="caption" sx={{fontSize:9}} >Valid Till</Typography>
                    <Typography variant="body2">{`${card.expiryMonth}/${card.expiryYear}`}</Typography>
                </Box>
            </Box>
        </Box>
        
        <Box sx={{ display: "flex", justifyContent: "space-between", marginLeft: 0}}>
            <IconButton onClick={handleToggleDetails} sx={{ color: "#fff" }}>
                    {showDetails ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
            
            <Box
                component="img"
                // src="/images/rupay_logo.png"
                src={
                  card.wireTransactionVendor.toLowerCase() === "rupay" ? "/images/rupay_logo.png" :
                  card.wireTransactionVendor.toLowerCase() === "visa" ? "/images/visa_logo.png" :
                  card.wireTransactionVendor.toLowerCase() === "mastercard" ? "/images/mastercard_logo.png" :
                  "/images/default_logo.png"  // Default logo if none of the above match
                }

                alt={`${card.wireTransactionVendor} Logo`}
                sx={{
                    marginBottom: -10,
                    width: 
                        card.wireTransactionVendor.toLowerCase() === "visa" ? 80 : 
                        card.wireTransactionVendor.toLowerCase() === "mastercard" ? 90 : 
                        card.wireTransactionVendor.toLowerCase() === "rupay" ? 100 : 70, // Set width based on vendor
                    height: 
                        card.wireTransactionVendor.toLowerCase() === "visa" ? 45 : 
                        card.wireTransactionVendor.toLowerCase() === "mastercard" ? 50 : 
                        card.wireTransactionVendor.toLowerCase() === "rupay" ? 60 : 40, // Set height based on vendor
                    // ...(card.wireTransactionVendor.toLowerCase() === "visa" && { border: "2px solid blue" }), // Example for Visa
                    // ...(card.wireTransactionVendor.toLowerCase() === "mastercard" && { border: "2px solid red" }), // Example for Mastercard
                    // ...(card.wireTransactionVendor.toLowerCase() === "rupay" && { border: "2px solid green" }), // Example for Rupay
                }}
            />

            {/* <Typography variant="body2" align="right" sx={{ marginBottom :0 }} >
                {card.wireTransactionVendor.toUpperCase()}
            </Typography> */}
        </Box>
        
    </Card>
  );
};

function ViewExpenses() {
  const [creditCards, setCreditCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [numTransactions, setNumTransactions] = useState("");
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const encodedUsername=btoa(username);
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
          `/api2/api/customer/creditcard/listcreditcards/${encodedUsername}`,   //uncomment to use encoded username
           // "/api2/api/customer/creditcard/listcreditcards/achilleyb",       
        {
          params: {showFullNumber: 'true'},
        }
        );
        const data = response.data;
        console.log(response.data);
        const activeCards = data.creditcards
          .filter((card) => card.status === "enabled")
          .map((card) => ({
            ...card,
            holder: data.nameOnTheCard,
          }));
        setCreditCards(activeCards);
      } catch (error) {
        console.error("Failed to fetch credit cards:", error);
      }
    };

    fetchCreditCards();
  }, []);

  const fetchTransactions = async (cardId, limit) => {
    try {
      const response = await axios.get(
        // "/api2/api/customer/transactions/YWNoaWxsZXli",
        `/api2/api/customer/transactions/${encodedUsername}`,   //uncomment to use encoded username

        // "/api2/api/customer/transactions/lastXTransactions/achilleyb",
        // {
        //   params: { limit, status: "both" },
        // }

      );
      const data = response.data.content;
      const filteredTransactions = data.filter(
        (transaction) => transaction.creditCardId === cardId
      )
      console.log(data);
      console.log(filteredTransactions);

      const sortedTransactions = filteredTransactions.sort((a, b) => 
        new Date(b.transactionDetail.transactionDate) - new Date(a.transactionDetail.transactionDate)
        // b.transactionDetail.transactionAmount - a.transactionDetail.transactionAmount   //sort by amount in descending order.
      );
      console.log("sorted",sortedTransactions);

      const limitedTransactions = sortedTransactions.slice(0, limit);
      console.log(limitedTransactions);
      setTransactions(limitedTransactions || []);
      if (limitedTransactions.length == 0)
        alert("No Transactions found for this credit card");
      // setTransactions(filteredTransactions || []);
      // setTransactions(sortedTransactions || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const handleCardClick = (cardId) => {
    setSelectedCard(cardId);
    setTransactions([]);
  };

  const handleTransactionsSubmit = () => {
    const parsedNumber = parseInt(numTransactions, 10);
    if (!Number.isNaN(parsedNumber) && parsedNumber > 0) {
      fetchTransactions(selectedCard, parsedNumber);
    } else {
      alert("Please enter a valid number!");
    }
  };

  const goToHome = () => {
    navigate("/dashboard");
  };

  const handleLogout = async () => {
    // const axios = require('axios').default;
    const token=getJwtToken();

    const options = {
      method: 'POST',
      url: '/api1/api/customer/logout',
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
            Active Credit Cards
        </Typography>

        <Grid container spacing={3} justifyContent="center">
            {creditCards.length === 0 ? (
            <Typography>Loading credit cards...</Typography>
            ) : (
            creditCards.map((card) => (
                <Grid item key={card.creditCardId}>
                <CreditCard card={card} onClick={handleCardClick} />
                </Grid>
            ))
            )}
        </Grid>

        {selectedCard && (
        // {(    //uncomment this and comment above line to have the transaction block always visible.
            <Box
            sx={{
                marginTop: 4,
                padding: 5,
                backgroundColor: "#fff",
                borderRadius: 2,
                maxWidth: 800,
                mx: "auto",
            }}
            >
            <Typography variant="h5" gutterBottom sx={{ marginTop: 0 }}>
                Transactions for {creditCards.find((card) => card.creditCardId === selectedCard)?.holder}
            </Typography>

            <Typography variant="h7" sx={{ marginTop: 0, fontSize: 14 }}>
                Selected Card ID: {`${selectedCard}`}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, marginTop: 3 }}>
                <TextField
                label="Enter Number of Transactions to List"
                type="number"
                variant="outlined"
                value={numTransactions}
                onChange={(e) => setNumTransactions(e.target.value)}
                fullWidth
                />
                
                <Button variant="contained" onClick={handleTransactionsSubmit}>
                View
                </Button>
            </Box>

            {transactions.length > 0 ? (
                <TableContainer component={Paper}>
                <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#0047ba" }}> {/* Custom background color */}
                    <TableCell sx={{ fontWeight: "bold", color: "#fff", textAlign: "justify"  }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Amount</TableCell> {/* Right-aligned for numerical values */}
                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Type</TableCell>
                  </TableRow>
                </TableHead>
                    <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.transactionDetail.transactionId}>
                        <TableCell>{transaction.transactionDetail.transactionId}</TableCell>                        
                        <TableCell>{transaction.transactionDetail.transactionDate}</TableCell>
                        <TableCell>{transaction.transactionDetail.transactionTime}</TableCell>                        
                        <TableCell>{transaction.transactionDetail.transactionDesc}</TableCell>
                        <TableCell>${transaction.transactionDetail.transactionAmount.toFixed(2)}</TableCell>
                        <TableCell>{transaction.transactionDetail.transactionType.toUpperCase()}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            ) : (
                <Typography></Typography>
            )}            
            </Box>
        )}
        </Box>
    );
    }
}

export default ViewExpenses;
