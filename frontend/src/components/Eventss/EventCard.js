import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Event as EventIcon,
  MusicNote as MusicNoteIcon,
  LocationOn as LocationOnIcon,
  AttachMoney as AttachMoneyIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const EventCard = ({ event }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const openGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      event.address
    )}`;
    window.open(googleMapsUrl, "_blank");
  };

  const openOpenStreetMap = () => {
    const [longitude, latitude] = event.coordinates.coordinates;
    const openStreetMapUrl = `https://www.openstreetmap.org/directions?engine=osrm_car&route=;${latitude},${longitude}`;
    window.open(openStreetMapUrl, "_blank");
  };

  return (
    <>
      <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <CardMedia
          component="img"
          height="140"
          image={event.image || "https://source.unsplash.com/random"}
          alt={event.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {event.title}
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <EventIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(event.date).toLocaleDateString()}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <MusicNoteIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {event.eventType}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {event.address}
            </Typography>
          </Box>
        </CardContent>
        <Box sx={{ p: 2 }}>
          <Button variant="contained" fullWidth onClick={handleClickOpen}>
            More Info
          </Button>
        </Box>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {event.title}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <EventIcon
              fontSize="small"
              sx={{ mr: 1, verticalAlign: "middle" }}
            />
            Date: {new Date(event.date).toLocaleString()}
          </Typography>
          <Typography gutterBottom>
            <MusicNoteIcon
              fontSize="small"
              sx={{ mr: 1, verticalAlign: "middle" }}
            />
            Event Type: {event.eventType}
          </Typography>
          <Typography gutterBottom>
            <LocationOnIcon
              fontSize="small"
              sx={{ mr: 1, verticalAlign: "middle" }}
            />
            Address: {event.address}
          </Typography>
          <Typography gutterBottom>
            <AttachMoneyIcon
              fontSize="small"
              sx={{ mr: 1, verticalAlign: "middle" }}
            />
            Price: {event.ticketPrice} {event.currency}
          </Typography>
          <Typography gutterBottom>Description: {event.description}</Typography>
          <Typography gutterBottom>
            Artists:{" "}
            {event.artistsNames
              ? event.artistsNames.join(", ")
              : "Not specified"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            onClick={openGoogleMaps}
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}>
            Google Maps
          </Button>
          <Button
            onClick={openOpenStreetMap}
            variant="contained"
            color="secondary">
            OpenStreetMap
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventCard;
