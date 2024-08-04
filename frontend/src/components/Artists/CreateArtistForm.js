import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import * as api from "../../services/api";

const CreateArtistForm = ({ onArtistCreated }) => {
  const [formData, setFormData] = useState({
    genre: "",
    bio: "",
    socialLinks: { instagram: "", facebook: "", twitter: "" },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSocialLinkChange = (e) => {
    setFormData({
      ...formData,
      socialLinks: { ...formData.socialLinks, [e.target.name]: e.target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createArtist(formData);
      onArtistCreated(response.data);
    } catch (error) {
      console.error("Error creating artist:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="genre"
        label="Genre"
        name="genre"
        value={formData.genre}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="bio"
        label="Bio"
        name="bio"
        multiline
        rows={4}
        value={formData.bio}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        id="instagram"
        label="Instagram"
        name="instagram"
        value={formData.socialLinks.instagram}
        onChange={handleSocialLinkChange}
      />
      <TextField
        margin="normal"
        fullWidth
        id="facebook"
        label="Facebook"
        name="facebook"
        value={formData.socialLinks.facebook}
        onChange={handleSocialLinkChange}
      />
      <TextField
        margin="normal"
        fullWidth
        id="twitter"
        label="Twitter"
        name="twitter"
        value={formData.socialLinks.twitter}
        onChange={handleSocialLinkChange}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Create Artist Profile
      </Button>
    </Box>
  );
};

export default CreateArtistForm;
