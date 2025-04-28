import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
  Box,
  Skeleton,
} from "@mui/material";
import {
  LocationOn,
  Email,
  MusicNote,
  Instagram,
  Facebook,
  Twitter,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import ReactCountryFlag from "react-country-flag";

const ArtistCard = ({ artist }) => {
  const [open, setOpen] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getCountryCode = (countryName) => {
    const countryCodes = {
      Burundi: "BI",
      "Democratic Republic of the Congo": "CD",
      DRC: "CD",
      Kenya: "KE",
      Rwanda: "RW",
      Uganda: "UG",
      Tanzania: "TZ",
      Somalia: "SO",
      "South Sudan": "SS",
    };
    return countryCodes[countryName] || countryName.slice(0, 2).toUpperCase();
  };

  const truncateBio = (bio, maxLength = 120) => {
    if (!bio) return "No bio available";
    if (bio.length <= maxLength) return bio;
    return bio.slice(0, maxLength).trim() + "...";
  };

  // Get artist image based on artist name or fallback
  const getArtistImage = () => {
    // If artist.image is a full URL, use it directly
    if (artist.image && artist.image.startsWith("http")) {
      return artist.image;
    }

    // Try to use artist first name from the full name
    if (artist.user && artist.user.name) {
      const firstName = artist.user.name.split(" ")[0].toLowerCase();
      // List of available artist images
      const availableArtists = [
        "juma",
        "wanjiku",
        "esther",
        "aminata",
        "moussa",
        "chantal",
        "jean-claude",
        "tariq",
      ];

      if (availableArtists.includes(firstName)) {
        return `${process.env.PUBLIC_URL}/images/artistz/${firstName}.jpg`;
      }
    }

    // If artist.image exists but isn't a URL, prepend PUBLIC_URL
    if (artist.image) {
      return `${process.env.PUBLIC_URL}${artist.image}`;
    }

    // Default fallback
    return `${process.env.PUBLIC_URL}/images/artistz/default-artist.jpg`;
  };

  const artistImage = getArtistImage();

  return (
    <>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Show skeleton while image loads */}
        {!imageLoaded && (
          <Skeleton variant="rectangular" height={140} animation="wave" />
        )}
        <CardMedia
          component="img"
          height="140"
          image={artistImage}
          alt={artist.user.name}
          sx={{ display: imageLoaded ? "block" : "none" }}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            console.log("Error loading artist image:", e.target.src);
            e.target.src = `${process.env.PUBLIC_URL}/images/artistz/default-artist.jpg`;
          }}
          loading="lazy"
        />
        <CardContent
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Typography gutterBottom variant="h5" component="div">
            {artist.user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {artist.genre}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}>
            <ReactCountryFlag
              countryCode={getCountryCode(artist.user.country)}
              svg
              style={{ marginRight: "8px" }}
            />
            {artist.user.country}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              mb: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}>
            {truncateBio(artist.bio)}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={handleOpen} sx={{ mt: 1, alignSelf: "flex-start" }}>
            More Info
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between">
            {artist.user.name}
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src={artistImage}
                alt={artist.user.name}
                sx={{ width: "100%", borderRadius: "4px" }}
                onError={(e) => {
                  e.target.src = `${process.env.PUBLIC_URL}/images/artistz/default-artist.jpg`;
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                <MusicNote sx={{ mr: 1, verticalAlign: "middle" }} />
                Genre: {artist.genre}
              </Typography>
              <Typography variant="body1" paragraph>
                <Box
                  component="span"
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOn sx={{ mr: 1 }} />
                  Country:
                  <ReactCountryFlag
                    countryCode={getCountryCode(artist.user.country)}
                    svg
                    style={{ marginLeft: "8px", marginRight: "8px" }}
                  />
                  {artist.user.country}
                </Box>
              </Typography>
              <Typography variant="body1" paragraph>
                <Email sx={{ mr: 1, verticalAlign: "middle" }} />
                Email: {artist.user.email}
              </Typography>
              <Typography variant="body1" paragraph>
                Bio: {artist.bio || "No bio available"}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Social Links:
              </Typography>
              <Box>
                {artist.socialLinks?.instagram && (
                  <IconButton
                    href={artist.socialLinks.instagram}
                    target="_blank">
                    <Instagram />
                  </IconButton>
                )}
                {artist.socialLinks?.facebook && (
                  <IconButton
                    href={artist.socialLinks.facebook}
                    target="_blank">
                    <Facebook />
                  </IconButton>
                )}
                {artist.socialLinks?.twitter && (
                  <IconButton href={artist.socialLinks.twitter} target="_blank">
                    <Twitter />
                  </IconButton>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArtistCard;
