import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import ArtistCard from "../components/Artists/ArtistCard";
import { getArtists } from "../services/api";

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    country: "",
    genre: "",
  });

  const fetchArtists = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getArtists();

      if (data && Array.isArray(data)) {
        setArtists(data);
        setError(null);
      } else {
        console.error("Invalid artists data format:", data);
        setError("Received invalid data format from server");
        setArtists(getDummyArtists());
      }
    } catch (error) {
      console.error("Error fetching artists:", error);
      setError("Failed to load artists. Using sample data instead.");
      setArtists(getDummyArtists());
    } finally {
      setLoading(false);
    }
  }, []);

  const filterArtists = useCallback(() => {
    let filtered = [...artists];

    if (filters.country) {
      filtered = filtered.filter(
        (artist) => artist.user?.country === filters.country
      );
    }

    if (filters.genre) {
      filtered = filtered.filter((artist) => artist.genre === filters.genre);
    }

    setFilteredArtists(filtered);
  }, [artists, filters.country, filters.genre]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  useEffect(() => {
    filterArtists();
  }, [filterArtists]);

  // Extract unique countries and genres for filters
  const countries = [...new Set(artists.map((artist) => artist.user?.country).filter(Boolean))];
  const genres = [...new Set(artists.map((artist) => artist.genre).filter(Boolean))];

  // Fallback data in case API fails
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
        bio: "Passionate Afrobeats artist from Nairobi with a unique sound that blends traditional and modern rhythms."
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
        bio: "Kenyan vocalist specializing in Afropop with influences from traditional Kenyan music."
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
        bio: "Reggae artist from Kampala with a passion for creating music that speaks to social issues."
      },
      {
        _id: "4",
        user: {
          _id: "u4",
          name: "Moussa Diallo",
          email: "moussa@example.com",
          country: "Rwanda"
        },
        genre: "Hip-hop",
        bio: "Hip-hop artist and producer from Kigali with a unique flow and beats."
      },
      {
        _id: "5",
        user: {
          _id: "u5",
          name: "Aminata Sow",
          email: "aminata@example.com",
          country: "Tanzania"
        },
        genre: "RnB",
        bio: "R&B vocalist from Dar es Salaam with a soulful voice and touching lyrics."
      }
    ];
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>


      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ pb: 3 }}>
          Discover Artists
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              name="country"
              label="Filter by Country"
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            >
              <MenuItem value="">All Countries</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              name="genre"
              label="Filter by Genre"
              value={filters.genre}
              onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
            >
              <MenuItem value="">All Genres</MenuItem>
              {genres.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {filteredArtists.length > 0 ? (
          filteredArtists.map((artist) => (
            <Grid item xs={12} sm={6} md={4} key={artist._id}>
              <ArtistCard artist={artist} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              No artists found matching your filters.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Artists;