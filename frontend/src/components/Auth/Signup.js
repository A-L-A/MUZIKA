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
  Grid,
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
    country: "",
    // Additional fields for artists and event hosts
    genre: "",
    bio: "",
    companyName: "",
    description: "",
    contactInfo: {
      phone: "",
      website: "",
    },
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
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
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="user-type-label">User Type</InputLabel>
            <Select
              labelId="user-type-label"
              id="userType"
              name="userType"
              value={formData.userType}
              label="User Type"
              onChange={handleChange}>
              <MenuItem value="regularUser">Regular User</MenuItem>
              <MenuItem value="artist">Artist</MenuItem>
              <MenuItem value="eventHost">Event Host</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="country"
            label="Country"
            id="country"
            value={formData.country}
            onChange={handleChange}
          />
        </Grid>
        {formData.userType === "artist" && (
          <>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="genre"
                label="Genre"
                id="genre"
                value={formData.genre}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="bio"
                label="Bio"
                id="bio"
                multiline
                rows={4}
                value={formData.bio}
                onChange={handleChange}
              />
            </Grid>
          </>
        )}
        {formData.userType === "eventHost" && (
          <>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="companyName"
                label="Company Name"
                id="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="description"
                label="Description"
                id="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="contactInfo.phone"
                label="Phone"
                id="phone"
                value={formData.contactInfo.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="contactInfo.website"
                label="Website"
                id="website"
                value={formData.contactInfo.website}
                onChange={handleChange}
              />
            </Grid>
          </>
        )}
      </Grid>
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
