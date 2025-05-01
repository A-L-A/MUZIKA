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
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MicExternalOnIcon from "@mui/icons-material/MicExternalOn";
import MenuIcon from "@mui/icons-material/Menu";
import ThemeToggleButton from "./ThemeToggleButton";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setOpenLogoutDialog(true);
    handleMenuClose();
  };

  const confirmLogout = () => {
    logout();
    setOpenLogoutDialog(false);
    navigate("/auth");
  };

  const cancelLogout = () => {
    setOpenLogoutDialog(false);
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: "#8B4513", 
        opacity: 0.9,
        width: '100%',
        maxWidth: '100vw',
        margin: 0,
        padding: 0,
        left: 0,
        right: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}
    >
      <Toolbar sx={{ 
        width: '100%',
        maxWidth: '100%',
        margin: 0,
        padding: '0 16px',
      }}>
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
        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/events" onClick={handleMenuClose}>
                Events
              </MenuItem>
              <MenuItem component={Link} to="/artists" onClick={handleMenuClose}>
                Artists
              </MenuItem>
              {user && (
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                  Profile
                </MenuItem>
              )}
              {user?.userType === "admin" && (
                <MenuItem component={Link} to="/admin/dashboard" onClick={handleMenuClose}>
                  Admin Dashboard
                </MenuItem>
              )}
              {user ? (
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              ) : (
                <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                  Login
                </MenuItem>
              )}
              <MenuItem>
                <ThemeToggleButton />
              </MenuItem>
            </Menu>
          </>
        ) : (
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
        )}
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