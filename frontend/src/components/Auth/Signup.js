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
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(formData);
      navigate("/");
    } catch (err) {
      setError(err || "An error occurred during signup.");
    }
  };

  const handleGoogleSignup = async () => {
    // Implement Google signup logic here
    console.log("Google signup not implemented yet");
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
          <MenuItem value="user">User</MenuItem>
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
      <Button
        fullWidth
        variant="outlined"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleSignup}>
        Sign up with Google
      </Button>
    </Box>
  );
};

export default Signup;
