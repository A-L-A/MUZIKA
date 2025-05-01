import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Skeleton,
  Box,
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!event) return;

    let imgUrl = '';

    // First try to use the event's image if provided
    if (event.image) {
      imgUrl = event.image.startsWith('/') 
        ? `${process.env.PUBLIC_URL}${event.image}`
        : `${process.env.PUBLIC_URL}/${event.image}`;
    } 
    // Otherwise try to match by event type
    else if (event.eventType) {
      const type = event.eventType.toLowerCase().replace(/\s+/g, '-');
      const eventTypeImageMap = {
        "concert": "concert.jpg",
        "festival": "festival.jpg",
        "karaoke": "karaoke.jpg",
        "live-music": "live-music.jpg",
        "open-mic": "open-mic.jpg",
        "party": "party.jpg"
      };
      
      if (eventTypeImageMap[type]) {
        imgUrl = `${process.env.PUBLIC_URL}/images/eventz/${eventTypeImageMap[type]}`;
      }
    }

    setImageUrl(imgUrl);
  }, [event]);

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

  const formattedDate = new Date(event.date).toLocaleDateString();
  const formattedDateTime = new Date(event.date).toLocaleString();

  return (
    <>
      <Card sx={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "100%",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 5
        }
      }}>
        {!imageLoaded && (
          <Skeleton variant="rectangular" height={140} animation="wave" />
        )}
        {imageUrl && (
          <CardMedia
            component="img"
            height={140}
            width="100%"
            image={imageUrl}
            alt={event.title}
            sx={{ 
              display: imageLoaded ? "block" : "none", 
              objectFit: "cover",
              objectPosition: "center"
            }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.style.display = 'none';
              setImageLoaded(false);
            }}
            loading="eager"
          />
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {event.title}
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <EventIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="body2" color="text.secondary">
              {formattedDate}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <MusicNoteIcon fontSize="small" sx={{ mr: 1, color: "secondary.main" }} />
            <Typography variant="body2" color="text.secondary">
              {event.eventType}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <LocationOnIcon fontSize="small" sx={{ mr: 1, color: "error.main" }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {event.address}
            </Typography>
          </Box>
        </CardContent>
        <Box sx={{ p: 2, pt: 0 }}>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleClickOpen}
            sx={{
              textTransform: "none", 
              fontWeight: 500,
              borderRadius: 2
            }}>
            More Info
          </Button>
        </Box>
      </Card>

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
              <EventIcon fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
              Date: {formattedDateTime}
            </Typography>
            <Typography gutterBottom>
              <MusicNoteIcon fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
              Event Type: {event.eventType}
            </Typography>
            <Typography gutterBottom>
              <MusicNoteIcon fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
              Music Genre: {event.musicGenre}
            </Typography>
            <Typography gutterBottom>
              <LocationOnIcon fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
              Address: {event.address}
            </Typography>
            <Typography gutterBottom>
              <AttachMoneyIcon fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
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

export default EventCard;