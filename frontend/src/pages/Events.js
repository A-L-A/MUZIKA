import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";

import EventMap from "../components/Eventss/EventMap";
import EventList from "../components/Eventss/EventList";
import EventsCatalogue from "../components/Eventss/EventsCatalogue";
import CreateEventForm from "../components/Eventss/CreateEventForm";
import { getEvents } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
   const fetchEvents = async () => {
     try {
       setLoading(true);
       const response = await getEvents();
       const data = response.data.map((event) => ({
         ...event,
         location: event.location || {
           type: "Point",
           coordinates: [0, 0], 
         },
       }));
       setEvents(data);
       setFilteredEvents(data);
     } catch (error) {
       console.error("Error fetching events:", error);
       setError("Failed to load events. Please try again later.");
     } finally {
       setLoading(false);
     }
   };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const filtered = events.filter(
        (event) =>
          (dateFilter
            ? new Date(event.date).toDateString() ===
              new Date(dateFilter).toDateString()
            : true) &&
          (eventTypeFilter ? event.eventType === eventTypeFilter : true) &&
          (searchTerm
            ? event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (event.artist?.name || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              (event.venue?.name || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            : true)
      );
      setFilteredEvents(filtered);
    }
  }, [dateFilter, eventTypeFilter, searchTerm, events]);

  const handleLocateEventsNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          alert(
            "Unable to get your location. Please check your browser settings."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleLocationSelect = (location) => {
    setUserLocation(location);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* <Typography variant="h2" component="h1" gutterBottom>
        Events
      </Typography> */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLocateEventsNearMe}
        sx={{ mb: 3, mr: 2 }}>
        Locate Events Near Me
      </Button>
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search events, artists, or venues"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                style: { padding: "10px" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Filter by Date"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                style: { padding: "10px" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="event-type-label">Event Type</InputLabel>
              <Select
                labelId="event-type-label"
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                label="Event Type"
                sx={{ padding: "10px" }}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Concert">Concert</MenuItem>
                <MenuItem value="Festival">Festival</MenuItem>
                <MenuItem value="Karaoke">Karaoke</MenuItem>
                <MenuItem value="Live Music">Live Music</MenuItem>
                <MenuItem value="Open Mic">Open Mic</MenuItem>
                <MenuItem value="Party">Party</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <EventMap
            events={filteredEvents}
            userLocation={userLocation}
            onLocationSelect={handleLocationSelect}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <EventList events={filteredEvents.slice(0, 3)} />
        </Grid>
      </Grid>
      <EventsCatalogue events={filteredEvents} />
      {["admin", "eventHost", "artist"].includes(user?.userType) && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
          sx={{ mt: 3 }}>
          {showCreateForm ? "Hide Create Event Form" : "Create New Event"}
        </Button>
      )}
      {showCreateForm && <CreateEventForm />}
    </Container>
  );
};

export default Events;
