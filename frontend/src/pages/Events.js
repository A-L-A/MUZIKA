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
} from "@mui/material";
import EventMap from "../components/Eventss/EventMap";
import EventList from "../components/Eventss/EventList";
import { sampleEvents } from "../sampleEvents";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // In a real application, this would be an API call
    setEvents(sampleEvents);
    setFilteredEvents(sampleEvents);
  }, []);

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        (dateFilter ? event.date === dateFilter : true) &&
        (genreFilter ? event.genre === genreFilter : true) &&
        (searchTerm
          ? event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.venue.name.toLowerCase().includes(searchTerm.toLowerCase())
          : true)
    );
    setFilteredEvents(filtered);
  }, [dateFilter, genreFilter, searchTerm, events]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" gutterBottom>
        Events
      </Typography>
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search events, artists, or venues"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <InputLabel>Genre</InputLabel>
              <Select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Jazz">Jazz</MenuItem>
                <MenuItem value="Rock">Rock</MenuItem>
                <MenuItem value="Traditional">Traditional</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <EventMap events={filteredEvents} />
        </Grid>
        <Grid item xs={12} md={4}>
          <EventList events={filteredEvents} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Events;
