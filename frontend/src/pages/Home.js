import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, Box, CircularProgress, Alert } from "@mui/material";
import EventCard from "../components/Eventss/EventCard";
import ArtistCard from "../components/Artists/ArtistCard";
import Hero from "../components/Home/Hero";
import { getEvents, getArtists } from "../services/api";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Try to fetch both events and artists concurrently
      const [eventsResponse, artistsResponse] = await Promise.allSettled([
        getEvents(),
        getArtists()
      ]);

      // Handle events data
      if (eventsResponse.status === 'fulfilled') {
        const eventsData = eventsResponse.value;
        const normalizedEvents = Array.isArray(eventsData) ? eventsData : 
                             (eventsData?.data && Array.isArray(eventsData.data)) ? eventsData.data : [];
        
        setEvents(normalizedEvents);
      } else {
        console.error("Error fetching events:", eventsResponse.reason);
        setEvents([]);
      }

      // Handle artists data
      if (artistsResponse.status === 'fulfilled') {
        const artistsData = artistsResponse.value;
        const normalizedArtists = Array.isArray(artistsData) ? artistsData : 
                              (artistsData?.data && Array.isArray(artistsData.data)) ? artistsData.data : [];
        
        setArtists(normalizedArtists);
      } else {
        console.error("Error fetching artists:", artistsResponse.reason);
        setArtists([]);
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again later.");
      setEvents([]);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Hero />
      <Container sx={{ mt: 4, mb: 8 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {events.length === 0 && !error ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No upcoming events found.
          </Alert>
        ) : (
          <>
            <Typography variant="h4" component="h2" sx={{ mb: 3, mt: 5 }}>
              Upcoming Events
            </Typography>
            <Grid container spacing={3}>
              {events.slice(0, 3).map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event._id}>
                  <EventCard event={event} />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {artists.length === 0 && !error ? (
          <Alert severity="info" sx={{ mt: 5, mb: 2 }}>
            No featured artists found.
          </Alert>
        ) : (
          <>
            <Typography variant="h4" component="h2" sx={{ mb: 3, mt: 6 }}>
              Featured Artists
            </Typography>
            <Grid container spacing={3}>
              {artists.slice(0, 3).map((artist) => (
                <Grid item xs={12} sm={6} md={4} key={artist._id}>
                  <ArtistCard artist={artist} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </>
  );
};

export default Home;