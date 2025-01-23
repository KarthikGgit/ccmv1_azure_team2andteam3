import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Select, InputLabel, FormControl, CircularProgress, FormHelperText } from '@mui/material';
import Toastify from 'toastify-js';
import axios from 'axios';

const username = localStorage.getItem('username');
const encodedUsername = btoa(username);

const AddCreditCardDialog = ({ username, fetchUserData, existingCreditCards }) => {
  const [showForm, setShowForm] = useState(false); // Control the dialog visibility
  const [newCardData, setNewCardData] = useState({
    creditCardId: 1, // This will be updated based on existing cards
    creditCardNumber: '',
    confirmCreditCardNumber: '', // Added field for confirming card number
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    wireTransactionVendor: 'visa',
    status: 'enabled',
  });
  const [loading, setLoading] = useState(false); // Track loading state
  const [errors, setErrors] = useState({}); // Track form errors

  // Open the dialog
  const handleClickOpen = () => {
    const nextCardId = existingCreditCards?.length > 0 ? Math.max(...existingCreditCards.map(card => card.creditCardId)) + 1 : 1;

    setNewCardData({
      ...newCardData,
      creditCardId: nextCardId, // Set the next ID dynamically
    });
    setShowForm(true);
  };

  // Close the dialog
  const handleClose = () => {
    setShowForm(false);
    setErrors({}); // Clear errors when closing the dialog
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCardData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle blur event (validation after the field is completed)
  const handleBlur = (fieldName) => {
    if (newCardData[fieldName]) {
      validateField(fieldName);
    }
  };

  // Validate individual field
  const validateField = (fieldName) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case 'creditCardNumber':
        const cardNumberRegex = /^[0-9]{16}$/;
        if (!newCardData.creditCardNumber || !cardNumberRegex.test(newCardData.creditCardNumber)) {
          newErrors.creditCardNumber = 'Please enter a valid 16-digit credit card number';
        } else {
          delete newErrors.creditCardNumber; // Clear error if valid
        }
        break;

      case 'confirmCreditCardNumber':
        if (newCardData.confirmCreditCardNumber !== newCardData.creditCardNumber) {
          newErrors.confirmCreditCardNumber = 'Credit card numbers do not match';
        } else {
          delete newErrors.confirmCreditCardNumber; // Clear error if valid
        }
        break;

      case 'expiryMonth':
      case 'expiryYear':
        const currentDate = new Date();
        const expiryDate = new Date(`${newCardData.expiryYear}-${newCardData.expiryMonth}-01`);
        if (!newCardData.expiryMonth || !newCardData.expiryYear) {
          newErrors.expiryDate = 'Please select both expiry month and year';
        } else if (expiryDate <= currentDate) {
          newErrors.expiryDate = 'Credit card has expired or is not valid yet';
        } else {
          delete newErrors.expiryDate; // Clear error if valid
        }
        break;

      case 'cvv':
        const cvvRegex = /^[0-9]{3}$/;
        if (!newCardData.cvv || !cvvRegex.test(newCardData.cvv)) {
          newErrors.cvv = 'Please enter a valid 3-digit CVV';
        } else {
          delete newErrors.cvv; // Clear error if valid
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  // Validate the entire form before submitting
  const validateForm = () => {
    const allErrors = {};

    if (newCardData.creditCardNumber) {
      const cardNumberRegex = /^[0-9]{16}$/;
      if (!cardNumberRegex.test(newCardData.creditCardNumber)) {
        allErrors.creditCardNumber = 'Please enter a valid 16-digit credit card number';
      }
    }

    if (newCardData.confirmCreditCardNumber) {
      if (newCardData.confirmCreditCardNumber !== newCardData.creditCardNumber) {
        allErrors.confirmCreditCardNumber = 'Credit card numbers do not match';
      }
    }

    if (newCardData.expiryMonth || newCardData.expiryYear) {
      const currentDate = new Date();
      const expiryDate = new Date(`${newCardData.expiryYear}-${newCardData.expiryMonth}-01`);
      if (!newCardData.expiryMonth || !newCardData.expiryYear) {
        allErrors.expiryDate = 'Please select both expiry month and year';
      } else if (expiryDate <= currentDate) {
        allErrors.expiryDate = 'Credit card has expired or is not valid yet';
      }
    }

    if (newCardData.cvv) {
      const cvvRegex = /^[0-9]{3}$/;
      if (!cvvRegex.test(newCardData.cvv)) {
        allErrors.cvv = 'Please enter a valid 3-digit CVV';
      }
    }

    setErrors(allErrors);
    return Object.keys(allErrors).length === 0; // Returns true if no errors
  };
  

  // Submit form and call API to add credit card
  const handleSubmit = async () => {
    if (!validateForm()) return; // Stop submission if form is invalid

    // Prepare the card data
    const formattedCardData = {
      creditCardNumber: newCardData.creditCardNumber,
      expiryMonth: parseInt(newCardData.expiryMonth, 10),
      expiryYear: parseInt(newCardData.expiryYear, 10),
      cvv: parseInt(newCardData.cvv, 10),
      wireTransactionVendor: newCardData.wireTransactionVendor,
      status: newCardData.status,
    };

    setLoading(true);
    try {
      // Send data to backend
      // const response = await axios.post(`/api2/api/customer/creditcard/addcreditcard/${encodeURIComponent(encodedUsername)}`, formattedCardData);
      const response = await axios.post(`${process.env.REACT_APP_API2_URL}/api/customer/creditcard/addcreditcard/${encodeURIComponent(encodedUsername)}`, formattedCardData);
      
      console.log('API Response:', response); // Debugging the API response

      if (response.status == 201) {
        // Show success toast
        Toastify({
          text: 'Credit card added successfully!',
          duration: 3000,
          gravity: 'center',
          position: 'right',
          backgroundColor: 'green',
          className: 'large-toast',
        }).showToast();

        // Close the form
        handleClose();

        // window.location.reload();

        // Fetch updated user data to reflect the new card
     // Ensure the new card data is updated in the parent component
        console.log('User data fetched and updated');
      }

    } catch (error) {
      console.error('Error adding credit card:', error);

      // Show failure toast if an error occurs
      Toastify({
        text: 'Failed to add credit card!',
        duration: 3000,
        gravity: 'center',
        position: 'right',
        backgroundColor: 'red',
        className: 'large-toast',
      }).showToast();

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button to open the dialog */}
      <Button variant="contained" color="primary" onClick={handleClickOpen} >
        Add Credit Card
      </Button>

      {/* Dialog for adding a credit card */}
      <Dialog open={showForm} onClose={handleClose}>
        <DialogTitle>Add Credit Card</DialogTitle>
        <DialogContent>
          <TextField
            label="Credit Card Number"
            variant="outlined"
            fullWidth
            margin="normal"
            name="creditCardNumber"
            value={newCardData.creditCardNumber}
            onChange={handleInputChange}
            onBlur={() => handleBlur('creditCardNumber')}
            error={!!errors.creditCardNumber}
            helperText={errors.creditCardNumber}
          />
          
          <TextField
            label="Confirm Credit Card Number"
            variant="outlined"
            fullWidth
            margin="normal"
            name="confirmCreditCardNumber"
            value={newCardData.confirmCreditCardNumber}
            onChange={handleInputChange}
            onBlur={() => handleBlur('confirmCreditCardNumber')}
            error={!!errors.confirmCreditCardNumber}
            helperText={errors.confirmCreditCardNumber}
          />

          <FormControl fullWidth margin="normal" error={!!errors.expiryDate}>
            <InputLabel>Expiry Month</InputLabel>
            <Select
              label="Expiry Month"
              name="expiryMonth"
              value={newCardData.expiryMonth}
              onChange={handleInputChange}
              onBlur={() => handleBlur('expiryMonth')}
            >
              {Array.from({ length: 12 }, (_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.expiryDate}</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.expiryDate}>
            <InputLabel>Expiry Year</InputLabel>
            <Select
              label="Expiry Year"
              name="expiryYear"
              value={newCardData.expiryYear}
              onChange={handleInputChange}
              onBlur={() => handleBlur('expiryYear')}
            >
              {Array.from({ length: 20 }, (_, index) => (
                <MenuItem key={2024 + index} value={2024 + index}>
                  {2024 + index}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.expiryDate}</FormHelperText>
          </FormControl>

          <TextField
            label="CVV"
            variant="outlined"
            fullWidth
            margin="normal"
            name="cvv"
            type="password"
            value={newCardData.cvv}
            onChange={handleInputChange}
            onBlur={() => handleBlur('cvv')}
            error={!!errors.cvv}
            helperText={errors.cvv}
          />
          
          {/* Vendor Selection (e.g., Visa, MasterCard, etc.) */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Vendor</InputLabel>
            <Select
              label="Vendor"
              name="wireTransactionVendor"
              value={newCardData.wireTransactionVendor}
              onChange={handleInputChange}
            >
              <MenuItem value="visa">Visa</MenuItem>
              <MenuItem value="mastercard">MasterCard</MenuItem>
              <MenuItem value="americanexpress">American Express</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          {/* Cancel Button */}
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Card'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddCreditCardDialog;
