import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const { setUser, register, googleLogin } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "",
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
      const user = await register(formData);
      setUser(user);
      navigate("/");
    } catch (err) {
      console.error("Error during signup:", err);
      setError(err.response?.data?.msg || "An error occurred during signup.");
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
    setError("Google signup failed. Please try again.");
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
        id="name"
        label="Full Name"
        name="name"
        autoComplete="name"
        autoFocus
        value={formData.name}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
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
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="user-type-label">User Type</InputLabel>
        <Select
          labelId="user-type-label"
          id="userType"
          name="userType"
          value={formData.userType}
          label="User Type"
          onChange={handleChange}>
          <MenuItem value="user">Regular User</MenuItem>
          <MenuItem value="artist">Artist</MenuItem>
          <MenuItem value="eventHost">Event Host</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Sign Up
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

export default Signup;
