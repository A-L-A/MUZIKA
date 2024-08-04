import React, { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  IconButton,
  Grid,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const EventsCatalogue = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const eventsPerPage = 5;

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : events.length - eventsPerPage
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < events.length - eventsPerPage ? prevIndex + 1 : 0
    );
  };

  return (
    <Box mt={4} position="relative">
      <Typography variant="h4" gutterBottom>
        Events Catalogue
      </Typography>
      <Grid container spacing={2}>
        {events
          .slice(currentIndex, currentIndex + eventsPerPage)
          .map((event) => (
            <Grid item xs={12} key={event._id}>
              <Card sx={{ display: "flex", height: 140 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 140 }}
                  image={event.image || "https://source.unsplash.com/random"}
                  alt={event.title}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}>
                  <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography component="div" variant="h6">
                      {event.title}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      component="div">
                      {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.eventType} | {event.address}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          ))}
      </Grid>
      <IconButton
        onClick={handlePrevious}
        sx={{
          position: "absolute",
          left: -20,
          top: "50%",
          transform: "translateY(-50%)",
        }}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          right: -20,
          top: "50%",
          transform: "translateY(-50%)",
        }}>
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default EventsCatalogue;
