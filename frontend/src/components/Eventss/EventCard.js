import React, { useState, memo } from "react";
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
  Skeleton,
} from "@mui/material";
import {
  Event as EventIcon,
  MusicNote as MusicNoteIcon,
  LocationOn as LocationOnIcon,
  AttachMoney as AttachMoneyIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

/**
 * EventCard Component
 * Displays an individual event in a card format with modal details
 *
 * @param {Object} event - The event data to display
 */
const EventCard = ({ event }) => {
  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get event image based on event type with intelligent matching
  const getEventImage = (event) => {
    // If event.image is a full URL, use it directly
    if (event.image && event.image.startsWith("http")) {
      return event.image;
    }

    // Try to use event type
    if (event.eventType) {
      const type = event.eventType.toLowerCase().replace(/\s+/g, "-");
      const validTypes = [
        "concert",
        "festival",
        "karaoke",
        "live-music",
        "open-mic",
        "party",
      ];

      if (validTypes.includes(type)) {
        return `${process.env.PUBLIC_URL}/images/eventz/${type}.jpg`;
      }
    }

    // Try to match based on music genre
    if (event.musicGenre) {
      const genre = event.musicGenre.toLowerCase().replace(/\s+/g, "-");
      const genreImageMap = {
        afrobeats: "concert",
        afropop: "festival",
        afrofusion: "concert",
        amapiano: "party",
        "bongo flava": "concert",
        classic: "open-mic",
        highlife: "live-music",
        "hiphop/rap": "concert",
        kinyatrap: "festival",
        reggae: "concert",
        rnb: "live-music",
        sega: "party",
        zouk: "party",
      };

      if (genreImageMap[genre]) {
        return `${process.env.PUBLIC_URL}/images/eventz/${genreImageMap[genre]}.jpg`;
      }
    }

    // If event.image exists but isn't a URL, prepend PUBLIC_URL
    if (event.image) {
      return `${process.env.PUBLIC_URL}${event.image}`;
    }

    // Default fallback
    return `${process.env.PUBLIC_URL}/images/eventz/default-event.jpg`;
  };

  const imageUrl = getEventImage(event);

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
    if (event.coordinates && event.coordinates.coordinates) {
      const [longitude, latitude] = event.coordinates.coordinates;
      const openStreetMapUrl = `https://www.openstreetmap.org/directions?engine=osrm_car&route=;${latitude},${longitude}`;
      window.open(openStreetMapUrl, "_blank");
    }
  };

  // Format date once to avoid repeated processing
  const formattedDate = new Date(event.date).toLocaleDateString();
  const formattedDateTime = new Date(event.date).toLocaleString();

  return (
    <>
      <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Show skeleton while image loads */}
        {!imageLoaded && (
          <Skeleton variant="rectangular" height={140} animation="wave" />
        )}
        <CardMedia
          component="img"
          height="140"
          image={imageUrl}
          alt={event.title}
          sx={{ display: imageLoaded ? "block" : "none" }}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            // On error, try to load default image
            console.log("Error loading image:", e.target.src);
            e.target.src = `${process.env.PUBLIC_URL}/images/eventz/default-event.jpg`;
          }}
          loading="lazy" // Use native lazy loading
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {event.title}
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <EventIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {formattedDate}
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

      {/* Only render Dialog when open to save resources */}
      {open && (
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
              Date: {formattedDateTime}
            </Typography>
            <Typography gutterBottom>
              <MusicNoteIcon
                fontSize="small"
                sx={{ mr: 1, verticalAlign: "middle" }}
              />
              Event Type: {event.eventType}
            </Typography>
            <Typography gutterBottom>
              <MusicNoteIcon
                fontSize="small"
                sx={{ mr: 1, verticalAlign: "middle" }}
              />
              Music Genre: {event.musicGenre}
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
            <Typography gutterBottom>
              Description: {event.description || "No description available"}
            </Typography>
            <Typography gutterBottom>
              Artists:{" "}
              {event.artistsNames && event.artistsNames.length > 0
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
      )}
    </>
  );
};
export default memo(EventCard);
