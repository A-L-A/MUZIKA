import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Avatar,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Edit as EditIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import ThemeToggleButton from "../components/Layout/ThemeToggleButton";
import * as api from "../services/api";
import EventCard from "../components/Eventss/EventCard";

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [userEvents, setUserEvents] = useState([]);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [openImageConfirmDialog, setOpenImageConfirmDialog] = useState(false);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] =
    useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "",
    country: "",
    genre: "",
    bio: "",
    companyName: "",
    description: "",
    contactInfo: {
      phone: "",
      website: "",
    },
    image: "",
    socialLinks: {
      instagram: "",
      facebook: "",
      twitter: "",
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        userType: user.userType || "",
        country: user.country || "",
        genre: user.genre || "",
        bio: user.bio || "",
        companyName: user.companyName || "",
        description: user.description || "",
        contactInfo: {
          phone: user.contactInfo?.phone || "",
          website: user.contactInfo?.website || "",
        },
        image: user.image || "",
        socialLinks: {
          instagram: user.socialLinks?.instagram || "",
          facebook: user.socialLinks?.facebook || "",
          twitter: user.socialLinks?.twitter || "",
        },
      });
      fetchUserEvents();
    }
  }, [user]);

  const fetchUserEvents = async () => {
    try {
      const response = await api.getEventsByUser();
      setUserEvents(response.data || []);
    } catch (error) {
      console.error("Error fetching user events:", error);
      setUserEvents([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
        setOpenImageConfirmDialog(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmImage = () => {
    setFormData((prev) => ({ ...prev, image: tempImage }));
    setOpenImageConfirmDialog(false);
  };

  const cancelImage = () => {
    setTempImage(null);
    setOpenImageConfirmDialog(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await api.updateUserProfile(formData);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data?.msg || error.message
      );
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      console.error("New passwords do not match");
      return;
    }
    try {
      await api.changePassword(passwordData);
      setOpenChangePasswordDialog(false);
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handleLogout = () => {
    setOpenLogoutDialog(true);
  };

  const confirmLogout = () => {
    logout();
    setOpenLogoutDialog(false);
  };

  const cancelLogout = () => {
    setOpenLogoutDialog(false);
  };

  const handleOpenSettings = () => {
    setOpenSettingsDialog(true);
  };

  const handleCloseSettings = () => {
    setOpenSettingsDialog(false);
  };

  const isProfileComplete = () => {
    const requiredFields = ["name", "email", "country"];
    if (formData.userType === "artist") {
      requiredFields.push("genre", "bio");
    } else if (formData.userType === "eventHost") {
      requiredFields.push(
        "companyName",
        "description",
        "contactInfo.phone",
        "contactInfo.website"
      );
    }
    const filledFields = requiredFields.filter((field) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        return formData[parent][child];
      }
      return formData[field];
    });
    return (filledFields.length / requiredFields.length) * 100;
  };

  const profileCompletionPercentage = isProfileComplete();

  if (!user) return null;

  return (
    <Box maxWidth="md" margin="auto" padding={3}>
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}>
            <Avatar
              src={formData.image}
              alt={formData.name}
              sx={{
                width: 100,
                height: 100,
                fontSize: 40,
                bgcolor: theme.palette.primary.main,
              }}>
              {formData.name.charAt(0).toUpperCase()}
            </Avatar>
            <IconButton onClick={handleOpenSettings}>
              <SettingsIcon />
            </IconButton>
          </Box>
          <Typography variant="h4" gutterBottom>
            {formData.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            {formData.email} • {formData.userType}
          </Typography>
          <Box sx={{ width: "100%", mb: 2 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Profile Completion
            </Typography>
            <LinearProgress
              variant="determinate"
              value={profileCompletionPercentage}
              sx={{
                backgroundColor:
                  theme.palette.grey[
                    theme.palette.mode === "light" ? 200 : 700
                  ],
                "& .MuiLinearProgress-bar": {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            />
            <Typography variant="body2" color="textSecondary" align="right">
              {Math.round(profileCompletionPercentage)}%
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          {activeTab === 0 && (
            <Button
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(!isEditing)}
              sx={{ color: theme.palette.primary.main }}>
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </Button>
          )}
        </CardActions>
      </Card>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mt: 2 }}>
        <Tab label="Profile Details" />
        <Tab label="My Events" />
      </Tabs>

      {activeTab === 0 && (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Country *"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </Grid>
            {formData.userType === "artist" && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Genre *"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio *"
                    name="bio"
                    multiline
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Instagram"
                    name="socialLinks.instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Facebook"
                    name="socialLinks.facebook"
                    value={formData.socialLinks.facebook}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Twitter"
                    name="socialLinks.twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    id="image-upload"
                    type="file"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                    disabled={!isEditing}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="contained"
                      component="span"
                      disabled={!isEditing}>
                      Upload Profile Image
                    </Button>
                  </label>
                </Grid>
              </>
            )}
            {formData.userType === "eventHost" && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Name *"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description *"
                    name="description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone *"
                    name="contactInfo.phone"
                    value={formData.contactInfo.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Website *"
                    name="contactInfo.website"
                    value={formData.contactInfo.website}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </Grid>
              </>
            )}
          </Grid>
          {isEditing && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}>
              Save Profile
            </Button>
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {Array.isArray(userEvents) &&
            userEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <EventCard event={event} onDelete={fetchUserEvents} />
              </Grid>
            ))}
        </Grid>
      )}

      <Button
        onClick={handleLogout}
        variant="contained"
        color="secondary"
        sx={{ mt: 2 }}>
        Logout
      </Button>

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

      <Dialog open={openSettingsDialog} onClose={handleCloseSettings}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ mr: 2 }}>Theme:</Typography>
            <ThemeToggleButton />
          </Box>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setOpenChangePasswordDialog(true)}>
            Change Password
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openChangePasswordDialog}
        onClose={() => setOpenChangePasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={passwordData.confirmNewPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmNewPassword: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangePasswordDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleChangePassword}>Change Password</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openImageConfirmDialog} onClose={cancelImage}>
        <DialogTitle>Confirm Profile Image</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to use this image as your profile picture?
          </DialogContentText>
          {tempImage && (
            <img
              src={tempImage}
              alt="New profile"
              style={{ maxWidth: "100%", maxHeight: 200 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelImage}>Cancel</Button>
          <Button onClick={confirmImage} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;