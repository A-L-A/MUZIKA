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
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
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

      const coordinates = {
        type: "Point",
        coordinates: [0, 0], 
      };

      const eventType = formData.eventType.toLowerCase().replace(/\s+/g, "-");
      const defaultImagePath = `/images/eventz/${eventType}.jpg`;

      const eventData = {
        ...formData,
        image: formData.image || defaultImagePath,
        coordinates: coordinates,
        ticketPrice: parseFloat(formData.ticketPrice),
        // This will automatically link the event to the creator
        eventHost: user._id,
      };

      await createEvent(eventData);

      setAlert({
        open: true,
        message: "Event created successfully! It will appear in your profile.",
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
        currency: "USD",
        address: "",
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
            <TextField
              fullWidth
              name="address"
              label="Event Address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter the full event address"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="image"
              label="Event Image URL (Optional)"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              helperText="Leave blank to use a default image based on event type"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 2 }}>
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
