import axios from 'axios';
import { getJwtToken, removeJwtToken, validateJwt } from './LoginPage';

export let userName = { first: '', last: '' };

export const setUserName = (first, last) => {
  userName = { first, last };
};


// Declare oneusername outside the function
export let oneusername = null;

// Function to send JWT token to an API and extract the username
export async function fetchUsernameFromApi(savedtoken) {
  try {
    // const apiUrl = '/api1/api/customer/jwt/validate';
    // Retrieve the JWT token from localStorage
    const token = savedtoken;

    if (!token) {
      throw new Error('No JWT token found in localStorage.');
    }

    // Send the token to the API
    // const response = await axios.get('/api1/api/customer/jwt/validate', {
    const response = await axios.get('/api1/api/customer/jwt/validate', {
      params: {
        token: token
      }
    });

    
    // Assign the retrieved username to the exported variable
    oneusername = response.data.username;
    localStorage.setItem('username', oneusername);

    console.log('Username retrieved:', oneusername);
    console.log('Status code:', response.status);

    return oneusername;
  } catch (error) {
    alert(error.response.data.error);
    console.error('Error fetching username:', error.message);
  }
}


// export const handleLogout = (navigate) => {
//   const token = getJwtToken();

//   const options = {
//     method: 'POST',
//     url: '/api1/api/customer/logout',
//     headers: {
//       Accept: '*/*',
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   try {
//     const { data } = axios(options);
//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
//   localStorage.clear();
//   navigate('/login');
// };



// Usage
// const apiEndpoint = 'https://example.com/api/endpoint'; // Replace with your API URL


// export const checkToken = async () => {
//   const token = getJwtToken();

//   // Await the promise from validateJwt to get the resolved value (true/false)
//   const isValid =  validateJwt(token);
//   console.log ("ud",isValid);
//   // Now you can use the value of isValid in an if condition
//   if (isValid) {
//     console.log("Token is valid");
//     return true;
//     // Proceed with your logic if valid
//   } else {
//     console.log("Token is invalid");
//     return false;
//     // Handle invalid token logic (e.g., redirect or show an error message)
//   }
// };




