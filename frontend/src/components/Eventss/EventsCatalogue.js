import React, { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import EventCard from "./EventCard";

const EventsCatalogue = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleOpenDialog = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
  };

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>
        Events Catalogue
      </Typography>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <EventCard
              event={event}
              onClickMore={() => handleOpenDialog(event)}
            />
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={!!selectedEvent}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth>
        {selectedEvent && (
          <>
            <DialogTitle>{selectedEvent.title}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                <strong>Date:</strong>{" "}
                {new Date(selectedEvent.date).toLocaleString()}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Description:</strong> {selectedEvent.description}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Address:</strong> {selectedEvent.address}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Event Type:</strong> {selectedEvent.eventType}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Music Genre:</strong> {selectedEvent.musicGenre}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Ticket Price:</strong> {selectedEvent.ticketPrice}{" "}
                {selectedEvent.currency}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Artists:</strong>{" "}
                {selectedEvent.artistsNames
                  ? selectedEvent.artistsNames.join(", ")
                  : "Not specified"}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
              <Button
                onClick={() => {
                  const osmUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${selectedEvent.coordinates.coordinates[1]}%2C${selectedEvent.coordinates.coordinates[0]}`;
                  window.open(osmUrl, "_blank");
                }}
                color="primary">
                OpenStreetMap Directions
              </Button>
              <Button
                onClick={() => {
                  const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    selectedEvent.address
                  )}`;
                  window.open(googleUrl, "_blank");
                }}
                color="primary">
                Google Maps Directions
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default EventsCatalogue;
