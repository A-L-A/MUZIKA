// src/components/Layout/Footer.js
import React from "react";
import { Box, Typography, Container, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        p: 6,
        mt: "auto",
      }}
      component="footer">
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
          Muzika
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p">
          Discover and connect with East African musicians and events.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {"Copyright © "}
          <Link color="inherit" href="https://your-website.com/">
            Muzika
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
