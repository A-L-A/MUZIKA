import React, { useState } from "react";
import { Button, TextField, Typography, Box, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { setUser, login, googleLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(formData.email, formData.password);
      setUser(user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "An error occurred during login.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await googleLogin({
        tokenId: credentialResponse.credential,
      });
      if (response.isNewUser) {
        navigate("/complete-signup", {
          state: { tempToken: response.token },
        });
      } else {
        setUser(response.user);
        localStorage.setItem("token", response.token);
        navigate("/profile");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError(
        err.response?.data?.msg || "An error occurred during Google login."
      );
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Typography color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Sign In
      </Button>
      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>
      <Box sx={{ width: "100%" }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </Box>
    </Box>
  );
};

export default Login;
