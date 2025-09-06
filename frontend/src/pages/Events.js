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
  useTheme,
  Alert,
} from "@mui/material";
import EventMap from "../components/Eventss/EventMap";
import EventsCatalogue from "../components/Eventss/EventsCatalogue";
import { getEvents } from "../services/api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const response = await getEvents();

        if (
          response &&
          (Array.isArray(response) || Array.isArray(response.data))
        ) {
          const eventsData = Array.isArray(response) ? response : response.data;

          const eventsWithCoordinates = eventsData.map((event) => ({
            ...event,
            coordinates: event.coordinates || {
              type: "Point",
              coordinates: [0, 0], // Default coordinates if missing
            },
          }));

          setEvents(eventsWithCoordinates);
          setFilteredEvents(eventsWithCoordinates);
          setError(null);
        } else {
          console.error("Invalid events data format:", response);
          setError("No events found. Please try again later.");
          setEvents([]);
          setFilteredEvents([]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);

        if (error.response) {
          setError(
            `Error: ${error.response.status} - ${
              error.response.data?.message || "Failed to load events"
            }`
          );
        } else if (error.request) {
          setError("Network error: Unable to connect to the server.");
        } else {
          setError("Error loading events. Please try again later.");
        }

        setEvents([]);
        setFilteredEvents([]);
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
          // Event type filter
          (eventTypeFilter ? event.eventType === eventTypeFilter : true) &&
          (searchTerm
            ? event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (event.artistsNames || []).some((name) =>
                name?.toLowerCase().includes(searchTerm.toLowerCase())
              ) ||
              (event.address || "")
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
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading events...
        </Typography>
      </Container>
    );
  }

  const availableEventTypes = [
    "Concert",
    "Festival",
    "Karaoke",
    "Live Music",
    "Open Mic",
    "Party",
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {events.length === 0 && !error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No events found. Create a new event to get started.
        </Alert>
      )}

      <Box
        sx={{
          bgcolor: theme.palette.background.paper,
          py: 4,
          px: 2,
          borderRadius: 2,
          mb: 4,
          boxShadow: 1,
        }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{ pb: 3 }}>
          Events
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleLocateEventsNearMe}
          sx={{ mb: 3, mr: 2 }}>
          Locate Events Near Me
        </Button>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search events, artists, or venues"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Filter by Date"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                label="Event Type">
                <MenuItem value="">All</MenuItem>
                {availableEventTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {events.length > 0 && (
        <>
          <Box
            sx={{
              bgcolor: theme.palette.background.default,
              py: 4,
              px: 2,
              borderRadius: 2,
              mb: 4,
              boxShadow: 1,
            }}>
            <EventMap
              events={filteredEvents}
              userLocation={userLocation}
              onLocationSelect={handleLocationSelect}
            />
          </Box>

          <Box
            sx={{
              bgcolor: theme.palette.background.paper,
              py: 4,
              px: 2,
              borderRadius: 2,
              boxShadow: 1,
            }}>
            <EventsCatalogue events={filteredEvents} />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Events;
