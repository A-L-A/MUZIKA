import React, { useState, useCallback, useRef } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { createEvent } from "../../services/api";
import axios from "axios";

const OPENCAGE_API_KEY = process.env.REACT_APP_OPENCAGE_API_KEY;

/**
 * Constants for form options and configuration
 */
const EVENT_TYPES = [
  "Open Mic",
  "Karaoke",
  "Concert",
  "Festival",
  "Party",
  "Live Music",
];

const MUSIC_GENRES = [
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

/**
 * CreateEventForm Component
 * Provides a form for creating new events with geocoding via OpenCage API
 */
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
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const debounceTimerRef = useRef(null);
  const geocodeCacheRef = useRef({});

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Debounced address lookup with caching
  const handleAddressChange = useCallback(async (event, newValue) => {
    setFormData((prevData) => ({ ...prevData, address: newValue }));

    // Don't perform search for short inputs
    if (!newValue || newValue.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Check cache first
    const cacheKey = `address_${newValue.toLowerCase()}`;
    if (geocodeCacheRef.current[cacheKey]) {
      setAddressSuggestions(geocodeCacheRef.current[cacheKey]);
      return;
    }

    // Debounce API call to prevent excessive requests
    debounceTimerRef.current = setTimeout(async () => {
      try {
        setLoading(true);

        // Use OpenCage API for address suggestions
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
          const suggestions = response.data.results.map(
            (result) => result.formatted
          );

          // Store in cache
          geocodeCacheRef.current[cacheKey] = suggestions;

          // Update state with suggestions
          setAddressSuggestions(suggestions);
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        setAlert({
          open: true,
          message:
            "Failed to fetch address suggestions. Please try typing a more specific address.",
          severity: "warning",
        });
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      const requiredFields = [
        "title",
        "date",
        "eventType",
        "musicGenre",
        "ticketPrice",
        "currency",
        "address",
      ];
      for (const field of requiredFields) {
        if (!formData[field]) {
          throw new Error(
            `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
          );
        }
      }

      // Get coordinates for the address using OpenCage API
      let coordinates;
      const cacheKey = `geocode_${formData.address}`;

      if (geocodeCacheRef.current[cacheKey]) {
        // Use cached coordinates
        coordinates = geocodeCacheRef.current[cacheKey];
      } else {
        // Geocode the address using OpenCage API
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json`,
          {
            params: {
              q: formData.address,
              key: OPENCAGE_API_KEY,
              limit: 1,
            },
          }
        );

        if (
          !response.data ||
          !response.data.results ||
          response.data.results.length === 0
        ) {
          throw new Error(
            "Invalid address. Please select a valid address from the suggestions."
          );
        }

        const { lng, lat } = response.data.results[0].geometry;
        coordinates = {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        };

        // Cache the coordinates
        geocodeCacheRef.current[cacheKey] = coordinates;
      }

      // Use event type to generate default image path
      const eventType = formData.eventType.toLowerCase().replace(/\s+/g, "-");
      const defaultImagePath = `${process.env.PUBLIC_URL}/images/eventz/${eventType}.jpg`;

      // Prepare event data
      const eventData = {
        ...formData,
        // Use provided image or default based on event type
        image: formData.image || defaultImagePath,
        coordinates: coordinates,
        artist: user.userType === "artist" ? user._id : formData.artist,
        eventHost: user.userType === "eventHost" ? user._id : undefined,
        // Convert ticket price to number
        ticketPrice: parseFloat(formData.ticketPrice),
      };

      // Send to API
      await createEvent(eventData);

      setAlert({
        open: true,
        message: "Event created successfully!",
        severity: "success",
      });

      // Reset form
      setFormData({
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
    } catch (error) {
      console.error("Error creating event:", error);
      setAlert({
        open: true,
        message: error.message || "Error creating event",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check user permission
  if (!["admin", "eventHost", "artist"].includes(user?.userType)) {
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
                {EVENT_TYPES.map((type) => (
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
                {MUSIC_GENRES.map((genre) => (
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
              value={formData.address}
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
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Image URL (Optional - a default image will be used based on event
              type)
            </Typography>
            <TextField
              fullWidth
              name="image"
              label="Event Image URL"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
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

      {/* Alert notifications */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CreateEventForm;
