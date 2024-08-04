import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  useTheme,
} from "@mui/material";
import ArtistCard from "../components/Artists/ArtistCard";
import CreateArtistForm from "../components/Artists/CreateArtistForm";
import * as api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await api.getArtists();
      setArtists(response.data);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  const handleArtistCreated = (newArtist) => {
    setArtists([...artists, newArtist]);
    setShowCreateForm(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          mb: 4,
          color: theme.palette.primary.main,
        }}>
        Discover Artists
      </Typography>

      {user && user.userType === "artist" && !showCreateForm && (
        <Box display="flex" justifyContent="flex-end" mb={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowCreateForm(true)}
            sx={{
              fontWeight: "bold",
              padding: "10px 20px",
            }}>
            Create Artist Profile
          </Button>
        </Box>
      )}

      {showCreateForm && (
        <Box mb={4}>
          <CreateArtistForm onArtistCreated={handleArtistCreated} />
        </Box>
      )}

      <Grid container spacing={3}>
        {artists.map((artist) => (
          <Grid item key={artist._id} xs={12} sm={6} md={4} lg={3}>
            <ArtistCard artist={artist} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Artists;
