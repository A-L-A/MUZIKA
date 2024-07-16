import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <MusicNoteIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}>
          Muzika
        </Typography>
        <Button color="inherit" component={Link} to="/artists">
          Artists
        </Button>
        <Button color="inherit" component={Link} to="/events">
          Events
        </Button>
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
        <Button
          color="primary"
          variant="contained"
          component={Link}
          to="/register">
          Register
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
