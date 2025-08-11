import { useState, useEffect } from "react";
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
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import ReactCountryFlag from "react-country-flag";

const ArtistCard = ({ artist }) => {
  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!artist) return;

    const getUserFirstName = () => {
      const userName = artist?.user?.name || artist?.name || "";
      return userName.split(" ")[0].toLowerCase().replace(/[-\s]/g, "");
    };

    const firstName = getUserFirstName();
    let imgUrl = '';

    if (firstName) {
      imgUrl = `${process.env.PUBLIC_URL}/images/artistz/${firstName}.webp`;
    } else if (artist.image) {
      imgUrl = artist.image.startsWith('/')
        ? `${process.env.PUBLIC_URL}${artist.image}`
        : `${process.env.PUBLIC_URL}/${artist.image}`;
    }

    setImageUrl(imgUrl);
  }, [artist]);

  const getCountryCode = (countryName) => {
    if (!countryName) return "XX";
    const countryCodes = {
      Burundi: "BI",
      Kenya: "KE",
      Rwanda: "RW",
      Uganda: "UG",
      Tanzania: "TZ",
      Somalia: "SO",
      "South Sudan": "SS",
      "Democratic Republic of the Congo": "CD",
      "DRC": "CD",
      "Congo": "CD",
    };
    return countryCodes[countryName] || countryName.slice(0, 2).toUpperCase();
  };

  const getUserName = () => {
    if (artist?.user?.name) return artist.user.name;
    if (artist?.name) return artist.name;
    return "Unknown Artist";
  };

  const getUserCountry = () => {
    if (artist?.user?.country) return artist.user.country;
    if (artist?.country) return artist.country;
    return "Unknown";
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      <Card sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 5
        }
      }}>
        {!imageLoaded && (
          <Skeleton variant="rectangular" height={200} animation="wave" />
        )}
        {imageUrl && (
          <CardMedia
            component="img"
            height="200"
            image={imageUrl}
            alt={getUserName()}
            sx={{ display: imageLoaded ? "block" : "none" }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.style.display = 'none';
              setImageLoaded(false);
            }}
            loading="eager"
          />
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {getUserName()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {artist.genre || "Various Genres"}
          </Typography>
          <Box display="flex" alignItems="center" mt={1} mb={1}>
            <ReactCountryFlag
              countryCode={getCountryCode(getUserCountry())}
              svg
              style={{ marginRight: "8px" }}
            />
            <Typography variant="body2" color="text.secondary">
              {getUserCountry()}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {truncateText(artist.bio)}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setOpen(true)}
          >
            More Info
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {getUserName()}
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {imageUrl && (
              <Grid item xs={12} md={4}>
                <Box
                  component="img"
                  src={imageUrl}
                  alt={getUserName()}
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "300px",
                    objectFit: "cover",
                    borderRadius: 1
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12} md={imageUrl ? 8 : 12}>
              <Typography gutterBottom variant="h6">
                <MusicNote sx={{ mr: 1, verticalAlign: "middle" }} />
                Genre: {artist.genre || "Not specified"}
              </Typography>
              <Typography gutterBottom>
                <LocationOn sx={{ mr: 1, verticalAlign: "middle" }} />
                Country: {getUserCountry()}
              </Typography>
              <Typography gutterBottom>
                <Email sx={{ mr: 1, verticalAlign: "middle" }} />
                Email: {artist.user?.email || "Not available"}
              </Typography>
              <Typography paragraph>
                <strong>Bio:</strong> {artist.bio || "No bio available"}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArtistCard;