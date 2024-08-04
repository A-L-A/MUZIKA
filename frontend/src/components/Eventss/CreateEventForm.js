import React, { useState} from "react";
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
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { createEvent} from "../../services/api";

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



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = async (event, newValue) => {
    setFormData({ ...formData, address: newValue });
    if (newValue.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            newValue
          )}`
        );
        const data = await response.json();
        setAddressSuggestions(data.map((item) => item.display_name));
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const addressResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          formData.address
        )}`
      );
      const addressData = await addressResponse.json();
      if (addressData.length === 0) {
        alert(
          "Invalid address. Please select a valid address from the suggestions."
        );
        return;
      }

      const { lat, lon } = addressData[0];
      const eventData = {
        ...formData,
        location: {
          type: "Point",
          coordinates: [parseFloat(lon), parseFloat(lat)],
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
    }
  };

  if (!["admin", "eventHost", "artist"].includes(user.userType)) {
    return <Typography>You don't have permission to create events.</Typography>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        fullWidth
        margin="normal"
        name="title"
        label="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        name="description"
        label="Description"
        multiline
        rows={4}
        value={formData.description}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        name="date"
        label="Date and Time"
        type="datetime-local"
        value={formData.date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        required
      />
      <FormControl fullWidth margin="normal">
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
      <FormControl fullWidth margin="normal">
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
      {formData.musicGenre === "Other" && (
        <TextField
          fullWidth
          margin="normal"
          name="otherMusicGenre"
          label="Specify Other Music Genre"
          value={formData.otherMusicGenre}
          onChange={handleChange}
          required
        />
      )}
      <TextField
        fullWidth
        margin="normal"
        name="ticketPrice"
        label="Ticket Price"
        type="number"
        value={formData.ticketPrice}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        name="currency"
        label="Currency"
        value={formData.currency}
        onChange={handleChange}
        required
      />
      <Autocomplete
        freeSolo
        options={addressSuggestions}
        onInputChange={handleAddressChange}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            margin="normal"
            name="address"
            label="Address"
            required
          />
        )}
      />
      {user.userType === "admin" && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Artist</InputLabel>
          <TextField
            fullWidth
            margin="normal"
            name="artist"
            label="Artist Name"
            value={formData.artist}
            onChange={handleChange}
            required
          />
        </FormControl>
      )}
      <TextField
        fullWidth
        margin="normal"
        name="image"
        label="Image URL"
        value={formData.image}
        onChange={handleChange}
        required
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Create Event
      </Button>
    </Box>
  );
};

export default CreateEventForm;
