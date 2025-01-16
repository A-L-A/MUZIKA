import React, { useState, useEffect } from "react";
import { Container, Typography, useTheme } from "@mui/material";
import ArtistList from "../components/Artists/ArtistList";
import * as api from "../services/api";

const Artists = () => {
  const [artists, setArtists] = useState([]);
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

      <ArtistList artists={artists} />
    </Container>
  );
};

export default Artists;
