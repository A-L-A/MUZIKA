import React, { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Autocomplete,
  CircularProgress,
  Paper,
  Grid,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { createEvent } from "../../services/api";
import axios from "axios";

const OPENCAGE_API_KEY = process.env.REACT_APP_OPENCAGE_API_KEY;

const eventTypes = [
  "Open Mic",
  "Karaoke",
  "Concert",
  "Festival",
  "Party",
  "Live Music",
];

const musicGenres = [
  "Afrobeats",
  "Afropop",
  "Afrofusion",
  "Amapiano",
  "Bongo Flava",
  "Classic",
  "Highlife",
  "Hiphop/Rap",
  "Kinyatrap",
  "Reggae",
  "RnB",
  "Sega",
  "Zouk",
  "Other",
];

const CreateEventForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    eventType: "",
    musicGenre: "",
    otherMusicGenre: "",
    ticketPrice: "",
    currency: "",
    address: "",
    artist: "",
    image: "",
  });

  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = async (event, newValue) => {
    setFormData({ ...formData, address: newValue });
    if (newValue.length > 2) {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json`,
          {
            params: {
              q: newValue,
              key: OPENCAGE_API_KEY,
              limit: 5,
            },
          }
        );
        if (response.data && response.data.results) {
          setAddressSuggestions(
            response.data.results.map((result) => result.formatted)
          );
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const addressResponse = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json`,
        {
          params: {
            q: formData.address,
            key: OPENCAGE_API_KEY,
            limit: 1,
          },
        }
      );

      if (addressResponse.data.results.length === 0) {
        alert(
          "Invalid address. Please select a valid address from the suggestions."
        );
        setLoading(false);
        return;
      }

      const { lat, lng } = addressResponse.data.results[0].geometry;
      const eventData = {
        ...formData,
        location: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        artist: user.userType === "artist" ? user._id : formData.artist,
        eventHost: user.userType === "eventHost" ? user._id : undefined,
      };
      await createEvent(eventData);
      alert("Event created successfully");
      // Reset form or redirect
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event");
    } finally {
      setLoading(false);
    }
  };

  if (!["admin", "eventHost", "artist"].includes(user.userType)) {
    return <Typography>You don't have permission to create events.</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create New Event
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="title"
              label="Event Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="date"
              label="Date and Time"
              type="datetime-local"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="description"
              label="Event Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                required>
                {eventTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Music Genre</InputLabel>
              <Select
                name="musicGenre"
                value={formData.musicGenre}
                onChange={handleChange}
                required>
                {musicGenres.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {formData.musicGenre === "Other" && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="otherMusicGenre"
                label="Specify Other Music Genre"
                value={formData.otherMusicGenre}
                onChange={handleChange}
                required
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="ticketPrice"
              label="Ticket Price"
              type="number"
              value={formData.ticketPrice}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="currency"
              label="Currency"
              value={formData.currency}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              options={addressSuggestions}
              onInputChange={handleAddressChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  name="address"
                  label="Event Address"
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          {user.userType === "admin" && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="artist"
                label="Artist Name"
                value={formData.artist}
                onChange={handleChange}
                required
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="image"
              label="Event Image URL"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 2 }}>
              {loading ? <CircularProgress size={24} /> : "Create Event"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CreateEventForm;
