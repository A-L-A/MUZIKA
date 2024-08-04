import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Avatar,
  Box,
  TextField,
  Grid,
  Paper,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";
import EventCard from "../components/Eventss/EventCard";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [userEvents, setUserEvents] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const response = await api.getEventsByUser();
        setUserEvents(response.data);
      } catch (err) {
        console.error("Error fetching user events:", err);
      }
    };
    fetchUserEvents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updatedUser = await api.updateUserProfile(formData);
      updateUser(updatedUser);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const isProfileComplete = () => {
    return (
      user.country &&
      (user.userType === "artist" ? user.genre && user.bio : true) &&
      (user.userType === "eventHost"
        ? user.companyName && user.description
        : true)
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {!isProfileComplete() && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Your profile is incomplete. Please add more details to get the most
            out of our platform!
          </Alert>
        )}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar
            alt={user.name}
            src="/static/images/avatar/1.jpg"
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {user.email} • {user.userType} • {user.country}
          </Typography>
          {!editMode ? (
            <IconButton onClick={() => setEditMode(true)} color="primary">
              <EditIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <IconButton onClick={handleSave} color="primary">
                <SaveIcon />
              </IconButton>
              <IconButton onClick={() => setEditMode(false)} color="secondary">
                <CancelIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{ mb: 2 }}>
          <Tab label="Profile Details" />
          <Tab label="My Events" />
          <Tab label="Settings" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            {editMode ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="User Type"
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    fullWidth
                    disabled
                  />
                </Grid>
              </Grid>
            ) : (
              <Box>
                <Typography variant="body1" gutterBottom>
                  <strong>Name:</strong> {user.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Country:</strong> {user.country}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>User Type:</strong> {user.userType}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Grid container spacing={2}>
            {userEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            <Button variant="outlined" color="primary" sx={{ mr: 2 }}>
              Change Password
            </Button>
            <Button variant="outlined" color="secondary">
              Delete Account
            </Button>
          </Box>
        )}

        <Box mt={4} display="flex" justifyContent="center">
          <Button variant="contained" color="secondary" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
