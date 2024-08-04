import React from "react";
import { Typography, Container, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <Box
      sx={{
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        pt: 16,
        pb: 16,
      }}>
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}>
          Muzika
        </Typography>
        <Typography
          variant="h5"
          align="center"
          paragraph
          sx={{ mb: 4, textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
          Locate & Attend East Africa's best music events!
        </Typography>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            component={Link}
            to="/events"
            sx={{
              mr: 2,
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}>
            Explore Events
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/artists"
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "primary.light",
                color: "primary.light",
              },
            }}>
            Discover Artists
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
