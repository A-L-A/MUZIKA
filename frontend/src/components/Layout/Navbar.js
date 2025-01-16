import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MicExternalOnIcon from "@mui/icons-material/MicExternalOn";
import ThemeToggleButton from "./ThemeToggleButton";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setOpenLogoutDialog(true);
  };

  const confirmLogout = () => {
    logout();
    setOpenLogoutDialog(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setOpenLogoutDialog(false);
  };

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
                Profile
              </Button>
              {user.userType === "admin" && (
                <Button color="inherit" component={Link} to="/admin/dashboard">
                  Admin Dashboard
                </Button>
              )}
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
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

      <Dialog open={openLogoutDialog} onClose={cancelLogout}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelLogout}>Cancel</Button>
          <Button onClick={confirmLogout} autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Navbar;
