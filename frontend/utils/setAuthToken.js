import axios from "axios";

// Function to set or remove authorization token in axios headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token; 
  } else {
    delete axios.defaults.headers.common["x-auth-token"]; 
  }
};

export default setAuthToken;
