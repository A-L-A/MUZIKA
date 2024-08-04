import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
} from "@mui/material";
import { completeGoogleSignup } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const CompleteSignup = () => {
  const [userType, setUserType] = useState("");
  const [country, setCountry] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await completeGoogleSignup({
        tempToken: location.state.tempToken,
        userType,
        country,
      });
      setUser(result.user);
      localStorage.setItem("token", result.token);
      navigate("/profile");
    } catch (error) {
      console.error("Error completing signup:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Complete Your Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          fullWidth
          label="User Type"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          margin="normal">
          <MenuItem value="regularUser">Regular User</MenuItem>
          <MenuItem value="artist">Artist</MenuItem>
          <MenuItem value="eventHost">Event Host</MenuItem>
        </TextField>
        <TextField
          fullWidth
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Complete Signup
        </Button>
      </form>
    </Container>
  );
};

export default CompleteSignup;
