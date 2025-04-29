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
      const [eventsData, artistsData] = await Promise.allSettled([
        getEvents(),
        getArtists()
      ]);

      // Handle events data
      if (eventsData.status === 'fulfilled' && Array.isArray(eventsData.value)) {
        setEvents(eventsData.value);
      } else {
        console.error("Error fetching events:", eventsData);
        // Use dummy events as fallback
        setEvents(getDummyEvents());
      }

      // Handle artists data
      if (artistsData.status === 'fulfilled' && Array.isArray(artistsData.value)) {
        setArtists(artistsData.value);
      } else {
        console.error("Error fetching artists:", artistsData);
        // Use dummy artists as fallback
        setArtists(getDummyArtists());
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Using sample data instead.");
      // Use dummy data as fallback
      setEvents(getDummyEvents());
      setArtists(getDummyArtists());
    } finally {
      setLoading(false);
    }
  };

  // Fallback data in case API fails
  const getDummyEvents = () => {
    return [
      {
        _id: "1",
        title: "Nairobi Groove Festival",
        description: "A night of amazing Afrobeats and dance",
        date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
        address: "Carnivore Grounds, Nairobi, Kenya",
        coordinates: {
          type: "Point",
          coordinates: [36.8219, -1.3022]
        },
        eventType: "Festival",
        musicGenre: "Afrobeats",
        ticketPrice: 2000,
        currency: "KES",
        artistsNames: ["Juma Kipchoge", "Wanjiku Mwangi"]
      },
      {
        _id: "2",
        title: "Kampala Live Music Night",
        description: "Enjoy live performances from Uganda's top artists",
        date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
        address: "Sheraton Garden, Kampala, Uganda",
        coordinates: {
          type: "Point",
          coordinates: [32.5825, 0.3476]
        },
        eventType: "Live Music",
        musicGenre: "Reggae",
        ticketPrice: 50000,
        currency: "UGX",
        artistsNames: ["Esther Akello"]
      },
      {
        _id: "3",
        title: "Kigali Hip-Hop Showcase",
        description: "Rwanda's best hip-hop artists on one stage",
        date: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
        address: "Kigali Convention Center, Rwanda",
        coordinates: {
          type: "Point",
          coordinates: [30.0591, -1.9441]
        },
        eventType: "Concert",
        musicGenre: "Hip-hop",
        ticketPrice: 15000,
        currency: "RWF",
        artistsNames: ["Moussa Diallo"]
      }
    ];
  };

  const getDummyArtists = () => {
    return [
      {
        _id: "1",
        user: {
          _id: "u1",
          name: "Juma Kipchoge",
          email: "juma@example.com",
          country: "Kenya"
        },
        genre: "Afrobeats",
        bio: "Passionate Afrobeats artist from Nairobi."
      },
      {
        _id: "2",
        user: {
          _id: "u2",
          name: "Wanjiku Mwangi",
          email: "wanjiku@example.com",
          country: "Kenya"
        },
        genre: "Afropop",
        bio: "Kenyan vocalist specializing in Afropop."
      },
      {
        _id: "3",
        user: {
          _id: "u3",
          name: "Esther Akello",
          email: "esther@example.com",
          country: "Uganda"
        },
        genre: "Reggae",
        bio: "Reggae artist from Kampala."
      }
    ];
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
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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
      </Container>
    </>
  );
};

export default Home;