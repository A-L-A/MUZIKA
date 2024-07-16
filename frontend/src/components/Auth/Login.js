import React, { useState } from "react";
import { Button, TextField, Typography, Box, Divider } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err || "An error occurred during login.");
    }
  };

  const handleGoogleLogin = async () => {
    // Implement Google login logic here
    console.log("Google login not implemented yet");
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
      <Button
        fullWidth
        variant="outlined"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleLogin}>
        Sign in with Google
      </Button>
    </Box>
  );
};

export default Login;
