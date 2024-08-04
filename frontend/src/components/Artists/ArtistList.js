import React, { useState, useEffect } from "react";
import { Grid, TextField, Box } from "@mui/material";
import ArtistCard from "./ArtistCard";
import { getArtists } from "../../services/api";

const ArtistList = () => {
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchArtists = async () => {
      const data = await getArtists();
      setArtists(data);
    };
    fetchArtists();
  }, []);

  const filteredArtists = artists.filter((artist) =>
    artist.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
