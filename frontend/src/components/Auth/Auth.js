import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Auth = () => {
  const { setUser, login, register, googleLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
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
     let user;
     if (isLogin) {
       user = await login(formData.email, formData.password);
     } else {
       if (!formData.email || !formData.password || !formData.userType) {
         throw new Error("Email, password, and user type are required");
       }
       user = await register(formData);
     }
     setUser(user);
     navigate("/profile");
   } catch (err) {
     console.error("Error during auth:", err);
     setError(err.response?.data?.msg || err.message || "An error occurred.");
   }
 };


  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await googleLogin({
        tokenId: credentialResponse.credential,
        userType: formData.userType,
      });
      setUser(response.user);
      localStorage.setItem("token", response.token);
      navigate("/profile");
    } catch (err) {
      console.error("Google login error:", err);
      setError(
        err.response?.data?.msg || "An error occurred during Google login."
      );
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication failed. Please try again.");
  };

  return (
    <Box maxWidth="sm" margin="auto" padding={3}>
      <Tabs
        value={isLogin ? 0 : 1}
        onChange={(_, newValue) => setIsLogin(newValue === 0)}
        centered>
        <Tab label="Login" />
        <Tab label="Signup" />
      </Tabs>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
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
          autoComplete={isLogin ? "current-password" : "new-password"}
          value={formData.password}
          onChange={handleChange}
        />
        {!isLogin && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="user-type-label">User Type</InputLabel>
            <Select
              labelId="user-type-label"
              id="userType"
              name="userType"
              value={formData.userType}
              label="User Type"
              onChange={handleChange}
              required>
              <MenuItem value="regularUser">Regular User</MenuItem>
              <MenuItem value="artist">Artist</MenuItem>
              <MenuItem value="eventHost">Event Host</MenuItem>
            </Select>
          </FormControl>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}>
          {isLogin ? "Sign In" : "Sign Up"}
        </Button>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
        />
      </Box>
    </Box>
  );
};

export default Auth;
