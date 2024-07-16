import React from "react";
import { Typography, Container, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        pt: 8,
        pb: 6,
      }}>
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom>
          Muzika
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          paragraph>
          Discover and connect with East African musicians and events
        </Typography>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            component={Link}
            to="/artists"
            sx={{ mr: 2 }}>
            Explore Artists
          </Button>
          <Button variant="outlined" component={Link} to="/events">
            Find Events
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
