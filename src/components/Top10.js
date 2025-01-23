import React, { useState, useEffect } from "react";
import { styled, Box, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";

// Custom StyledTableContainer component using MUI's styled API
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2),
}));

const username = localStorage.getItem('username');
const encodedUsername = btoa(username);

const Top10 = ({ isValidToken }) => {
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!encodedUsername || !isValidToken) {
      setLoadingTransactions(false); // Stop loading if conditions are not met
      return;
    }

    const fetchTransactions = async () => {
      setLoadingTransactions(true); // Set loading to true before fetching data
      try {
        // const response = await axios.get(`/api2/api/customer/transactions/lastXTransactions/${encodedUsername}?limit=10&status=both`);
        const response = await axios.get(`${process.env.REACT_APP_API2_URL}/api/customer/transactions/lastXTransactions/${encodedUsername}?limit=10&status=both`);
        console.log("Transactions Response:", response.data);  // Log the full response to inspect it

        // Now inspect the structure of response.data
        const allTransactions = [];

        // Loop over each card in the response (1, 2, 3, etc.)
        Object.entries(response.data).forEach(([cardId, cardData]) => {
          console.log(`Card ID: ${cardId}`, cardData.content);  // Log content of each card's transactions

          // Ensure the content is an array before attempting to map
          if (Array.isArray(cardData.content)) {
            allTransactions.push(...cardData.content.map(transaction => ({
              ...transaction,
              creditCardId: cardId, // Add cardId to each transaction
            })));
          } else {
            console.error(`Expected an array for cardData.content, but got:`, cardData.content);
          }
        });

        // Sort transactions by transactionDate in descending order
        allTransactions.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

        // Set only the top 10 transactions
        setTransactions(allTransactions.slice(0, 10)); 

      } catch (error) {
        console.error("Error fetching transactions:", error.message);
      } finally {
        setLoadingTransactions(false); // Always set loading to false after fetch attempt
      }
    };

    fetchTransactions();
  }, [encodedUsername, isValidToken]);

  if (!isValidToken) {
    return null; // Replace with a redirect or error page if needed
  }

  return (
    <Box sx={{ padding: 3, minHeight: "100vh", backgroundColor: "#bfbaba" }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ marginTop: 5, marginBottom: 4 }}
      >
        Top 10 Transactions From All Cards
      </Typography>

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
        {loadingTransactions ? (
          <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />
        ) : transactions.length > 0 ? (
          <StyledTableContainer component={Paper}>
            <Table aria-label="transactions table">
              <TableHead>
                <TableRow>
                  <TableCell>Card Id</TableCell>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Transaction Date</TableCell>
                  <TableCell>Transaction Time</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.transactionId}>
                    <TableCell>{transaction.creditCardId}</TableCell>
                    <TableCell>{transaction.transactionId}</TableCell>
                    <TableCell>{transaction.transactionDate}</TableCell>
                    <TableCell>{transaction.transactionTime}</TableCell>
                    <TableCell>{transaction.transactionType === "cr" ? "Credit" : "Debit"}</TableCell>
                    <TableCell>{transaction.transactionAmount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.transactionDesc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        ) : (
          <Typography align="center">No transactions available.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Top10;
