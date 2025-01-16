import React, { useState } from "react";
import {
  Grid,
  TextField,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import ArtistCard from "./ArtistCard";

const ArtistList = ({ artists }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  const genres = [...new Set(artists.map((artist) => artist.genre))];
  const countries = [
    ...new Set(artists.map((artist) => artist.user?.country).filter(Boolean)),
  ];

  const filteredArtists = artists.filter((artist) => {
    return (
      artist.user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (genreFilter ? artist.genre === genreFilter : true) &&
      (countryFilter ? artist.user?.country === countryFilter : true)
    );
  });

  return (
    <Box>
      <TextField
        label="Search Artists"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Box display="flex" justifyContent="space-between" mb={2}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Genre</InputLabel>
          <Select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            label="Genre">
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Country</InputLabel>
          <Select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            label="Country">
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredArtists.map((artist) => (
          <Grid item key={artist._id} xs={12} sm={6} md={4}>
            <ArtistCard artist={artist} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ArtistList;
