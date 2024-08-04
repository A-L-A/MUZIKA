import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ArtistCard = ({ artist }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: (theme) => theme.shadows[4],
          },
          cursor: "pointer",
        }}
        onClick={handleOpen}>
        <CardMedia
          component="img"
          height="200"
          image={artist.image || "https://source.unsplash.com/random"}
          alt={artist.user?.name || "Artist"}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold", mb: 1 }}>
            {artist.user?.name || "Unknown Artist"}
          </Typography>
          <Box mb={2}>
            <Chip
              label={artist.genre}
              size="small"
              sx={{
                backgroundColor: (theme) => theme.palette.primary.light,
                color: (theme) => theme.palette.primary.contrastText,
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {artist.bio && artist.bio.length > 100
              ? `${artist.bio.substring(0, 100)}...`
              : artist.bio}
          </Typography>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {artist.user?.name || "Unknown Artist"}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <img
              src={artist.image || "https://source.unsplash.com/random"}
              alt={artist.user?.name || "Artist"}
              style={{ width: "100%", borderRadius: "4px" }}
            />
          </Box>
          <Typography variant="h6" gutterBottom>
            Genre: {artist.genre}
          </Typography>
          <Typography variant="body1" paragraph>
            {artist.bio}
          </Typography>
          {artist.socialLinks && (
            <Box mt={2}>
              <Typography variant="h6" gutterBottom>
                Social Links:
              </Typography>
              <ul>
                {Object.entries(artist.socialLinks).map(([platform, link]) => (
                  <li key={platform}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {platform}
                    </a>
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ArtistCard;
