// src/components/Layout/Navbar.js
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          style={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}>
          Muzika
        </Typography>
        <Button color="inherit" component={Link} to="/events">
          Events
        </Button>
        <Button color="inherit" component={Link} to="/artists">
          Artists
        </Button>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/profile">
              {user.name}
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/auth">
            Login / Signup
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
