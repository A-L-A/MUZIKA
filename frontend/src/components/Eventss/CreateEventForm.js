import { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Grid,
  Snackbar,
  Alert,
  Paper,
  Autocomplete,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { createEvent } from "../../services/api";

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

const CreateEventForm = () => {
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    eventType: "",
    musicGenre: "",
    otherMusicGenre: "",
    ticketPrice: "",
    currency: "USD",
    address: "",
    latitude: "",
    longitude: "",
    imageFile: null,
  });

  const [loading, setLoading] = useState(false);

  // Alert state
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Address autocomplete state
  const [setAddressInput] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleAddressInputChange = async (event, value) => {
    setAddressInput(value);
    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            value
          )}&key=YOUR_REAL_API_KEY&limit=5`
        );
        const data = await response.json();
        if (data.results) {
          setAddressSuggestions(
            data.results.map((r) => ({
              formatted: r.formatted,
              lat: r.geometry.lat,
              lng: r.geometry.lng,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching address suggestions:", err);
      }
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
        if (!formData[field])
          throw new Error(
            `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
          );
      }

      if (!selectedAddress)
        throw new Error("Please select a valid address from the suggestions");

      // Prepare FormData for image upload
      const data = new FormData();
      data.append("address", selectedAddress.formatted);
      data.append("latitude", selectedAddress.lat);
      data.append("longitude", selectedAddress.lng);

      for (const key in formData) {
        if (key === "imageFile" && formData.imageFile)
          data.append("image", formData.imageFile);
        else if (!["latitude", "longitude", "imageFile"].includes(key))
          data.append(key, formData[key]);
      }

      await createEvent(data);

      setAlert({
        open: true,
        message: "Event created successfully!",
        severity: "success",
      });

      setFormData({
        title: "",
        description: "",
        date: "",
        eventType: "",
        musicGenre: "",
        otherMusicGenre: "",
        ticketPrice: "",
        currency: "USD",
        address: "",
        latitude: "",
        longitude: "",
        imageFile: null,
      });
      setSelectedAddress(null);
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

  if (!["admin", "eventHost", "artist"].includes(user?.userType)) {
    return (
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h6" color="error">
          You don't have permission to create events.
        </Typography>
      </Paper>
    );
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
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Event Type</InputLabel>
              <Select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                label="Event Type">
                {EVENT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Music Genre</InputLabel>
              <Select
                name="musicGenre"
                value={formData.musicGenre}
                onChange={handleChange}
                label="Music Genre">
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
            <FormControl fullWidth required>
              <InputLabel>Currency</InputLabel>
              <Select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                label="Currency">
                <MenuItem value="USD">USD ($)</MenuItem>
                <MenuItem value="EUR">EUR (€)</MenuItem>
                <MenuItem value="GBP">GBP (£)</MenuItem>
                <MenuItem value="RWF">RWF (RWF)</MenuItem>
                <MenuItem value="KES">KES (KSh)</MenuItem>
                <MenuItem value="UGX">UGX (USh)</MenuItem>
                <MenuItem value="TZS">TZS (TSh)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              options={addressSuggestions}
              getOptionLabel={(option) => option.formatted || ""}
              onInputChange={handleAddressInputChange}
              onChange={(event, value) => setSelectedAddress(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Event Address"
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              id="event-image-upload"
              type="file"
              style={{ display: "none" }}
              onChange={(e) =>
                setFormData({ ...formData, imageFile: e.target.files[0] })
              }
            />
            <label htmlFor="event-image-upload">
              <Button variant="contained" component="span">
                Upload Event Image
              </Button>
            </label>
            {formData.imageFile && (
              <Typography>{formData.imageFile.name}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}>
              {loading ? "Creating Event..." : "Create Event"}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}>
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
