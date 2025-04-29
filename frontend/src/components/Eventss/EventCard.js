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
    try {
      // If event.image is a full URL, use it directly
      if (event?.image && event.image.startsWith("http")) {
        return event.image;
      }
      
      // Try to use event type
      if (event?.eventType) {
        // Normalize the event type
        const type = event.eventType.toLowerCase().replace(/\s+/g, "-");
        
        // Map for exact matches
        const eventTypeImageMap = {
          "concert": "concert.jpg",
          "festival": "festival.jpg",
          "karaoke": "karaoke.jpg",
          "live-music": "live-music.jpg",
          "open-mic": "open-mic.jpg",
          "party": "party.jpg"
        };
        
        if (eventTypeImageMap[type]) {
          return `${process.env.PUBLIC_URL}/images/eventz/${eventTypeImageMap[type]}`;
        }
      }
      
      // Try to match based on music genre if eventType didn't match
      if (event?.musicGenre) {
        const genre = event.musicGenre.toLowerCase().replace(/\s+/g, "-");
        
        // Map from genre to appropriate event image
        const genreImageMap = {
          "afrobeats": "concert.jpg",
          "afropop": "festival.jpg",
          "afrofusion": "concert.jpg",
          "amapiano": "party.jpg",
          "bongo-flava": "concert.jpg",
          "classic": "open-mic.jpg",
          "highlife": "live-music.jpg",
          "hiphop/rap": "concert.jpg",
          "hiphop": "concert.jpg",
          "rap": "concert.jpg",
          "kinyatrap": "concert.jpg",
          "reggae": "concert.jpg",
          "rnb": "live-music.jpg",
          "sega": "party.jpg",
          "zouk": "party.jpg"
        };
        
        if (genreImageMap[genre]) {
          return `${process.env.PUBLIC_URL}/images/eventz/${genreImageMap[genre]}`;
        }
      }
      
      // If event.image exists but isn't a URL, prepend PUBLIC_URL
      if (event?.image) {
        // Handle both with and without leading slash
        return event.image.startsWith('/') 
          ? `${process.env.PUBLIC_URL}${event.image}`
          : `${process.env.PUBLIC_URL}/${event.image}`;
      }
      
      // Random image based on event ID for variety if nothing else matched
      if (event?._id) {
        const imageOptions = ["concert.jpg", "festival.jpg", "live-music.jpg", "party.jpg"];
        const randomIndex = event._id.charCodeAt(0) % imageOptions.length;
        return `${process.env.PUBLIC_URL}/images/eventz/${imageOptions[randomIndex]}`;
      }
      
      // Final fallback
      return `${process.env.PUBLIC_URL}/images/eventz/concert.jpg`;
    } catch (error) {
      console.error("Error getting event image:", error);
      return `${process.env.PUBLIC_URL}/images/eventz/concert.jpg`;
    }
  };
  
  // Handle case where event is undefined
  if (!event) {
    return (
      <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Skeleton variant="rectangular" height={140} animation="wave" />
        <CardContent>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="rectangular" width="100%" height={36} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    );
  }
  
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
          sx={{ display: imageLoaded ? "block" : "none", objectFit: "cover" }}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            // On error, try to load a generic event image based on type
            console.log("Error loading image:", e.target.src);
            const fallbackImage = event.eventType?.toLowerCase().includes("concert") 
              ? "concert.jpg" 
              : "festival.jpg";
            e.target.src = `${process.env.PUBLIC_URL}/images/eventz/${fallbackImage}`;
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