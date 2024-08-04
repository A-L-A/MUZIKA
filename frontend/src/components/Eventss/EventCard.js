import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

const EventCard = ({ event }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={event.image || "https://source.unsplash.com/random"}
        alt={event.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date(event.date).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.eventType}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EventCard;
