import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Chip,
} from "@mui/material";

const ArtistCard = ({ artist }) => {
  return (
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
      }}>
      <CardMedia
        component="img"
        height="200"
        image={artist.profilePicture }
        alt={artist.user.name}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold", mb: 1 }}>
          {artist.user.name}
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
          {artist.bio.length > 100
            ? `${artist.bio.substring(0, 100)}...`
            : artist.bio}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ArtistCard;
