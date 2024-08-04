import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MicExternalOnIcon from "@mui/icons-material/MicExternalOn";
import ThemeToggleButton from "./ThemeToggleButton"; 

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" sx={{ backgroundColor: "#8B4513", opacity: 0.9 }}>
      <Toolbar>
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
          }}>
          <MicExternalOnIcon sx={{ mr: 1 }} />
          <Typography variant="h5">Muzika</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <ThemeToggleButton />
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
              {user.userType === "admin" && (
                <Button color="inherit" component={Link} to="/admin/dashboard">
                  Admin Dashboard
                </Button>
              )}
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/auth"
              sx={{
                border: "1px solid",
                borderColor: "inherit",
                textTransform: "none",
              }}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
