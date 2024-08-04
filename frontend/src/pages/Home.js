import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import Hero from "../components/Home/Hero";
import EventCard from "../components/Eventss/EventCard";
import ArtistCard from "../components/Artists/ArtistCard";
import { getEvents, getArtists } from "../services/api";

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsResponse, artistsResponse] = await Promise.all([
          getEvents(),
          getArtists(),
        ]);
        setUpcomingEvents(eventsResponse.data.slice(0, 5));
        setFeaturedArtists(artistsResponse.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <Container
        maxWidth="lg"
        sx={{ py: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container
        maxWidth="lg"
        sx={{ py: 8, display: "flex", justifyContent: "center" }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );

  return (
    <>
      <Hero />

      {/* Upcoming Events Section */}
      <Box sx={{ bgcolor: "#f5f5f5", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            align="center"
            sx={{ mb: 4, fontWeight: "bold" }}>
            Upcoming Events
          </Typography>
          <Grid container spacing={4}>
            {upcomingEvents.map((event) => (
              <Grid item key={event._id} xs={12} sm={6} md={4}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              component={Link}
              to="/events"
              variant="contained"
              color="primary">
              View All Events
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Artists Section */}
      <Box sx={{ bgcolor: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            align="center"
            sx={{ mb: 4, fontWeight: "bold" }}>
            Featured Artists
          </Typography>
          <Grid container spacing={4}>
            {featuredArtists.map((artist) => (
              <Grid item key={artist._id} xs={12} sm={6} md={4}>
                <ArtistCard artist={artist} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              component={Link}
              to="/artists"
              variant="contained"
              color="secondary">
              Explore All Artists
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Home;
