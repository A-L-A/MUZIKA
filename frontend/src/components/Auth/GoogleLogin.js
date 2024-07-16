// src/components/auth/GoogleLogin.js
import React from "react";
import { GoogleLogin } from "react-google-login";
import axios from "axios";

const GoogleLogin = () => {
  const onSuccess = async (response) => {
    try {
      const res = await axios.post("/api/auth/google", {
        tokenId: response.tokenId,
      });
      console.log(res.data);
      // Handle successful Google login (e.g., save token, redirect)
    } catch (err) {
      console.error(err.response.data);
      // Handle errors (e.g., display error messages)
    }
  };

  const onFailure = (error) => {
    console.error(error);
    // Handle Google login failure
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Login with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};

export default GoogleLogin;
