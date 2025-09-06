import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import UserManagement from "./UserManagement";
import ArtistManagement from "./ArtistManagement";
import EventManagement from "./EventManagement";
import EventHostManagement from "./EventHostManagement";
import * as api from "../../services/api";

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventHosts, setEventHosts] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, artistsRes, eventsRes, eventHostsRes] =
        await Promise.all([
          api.getAllUsers(),
          api.getAllArtists(),
          api.getAllEvents(),
          api.getEventHosts(),
        ]);

      setUsers(usersRes || []);
      setArtists(artistsRes || []);
      setEvents(eventsRes || []);
      setEventHosts(eventHostsRes || []);

      showSnackbar("Data refreshed successfully");
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      showSnackbar("Error refreshing data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDelete = (item, type) => {
    if (type === "user" && item.userType === "admin") {
      showSnackbar("Admin accounts cannot be deleted", "warning");
      return;
    }

    setItemToDelete({ item, type });
    setDeleteConfirmOpen(true);
  };

  const handleUpdate = (item, type) => {
    setItemToUpdate({ item, type });
    setUpdateFormData(item); // Pre-populate form with current data
    setUpdateDialogOpen(true);
  };

  const handleUpdateFormChange = (field, value) => {
    setUpdateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateConfirm = async () => {
    if (!itemToUpdate || !updateFormData) return;

    try {
      const { item, type } = itemToUpdate;

      switch (type) {
        case "user":
          await api.updateUser(item._id, updateFormData);
          setUsers(
            users.map((user) =>
              user._id === item._id ? { ...user, ...updateFormData } : user
            )
          );
          break;
        case "artist":
          await api.adminUpdateArtist(item._id, updateFormData);
          setArtists(
            artists.map((artist) =>
              artist._id === item._id
                ? { ...artist, ...updateFormData }
                : artist
            )
          );
          break;
        case "event":
          await api.adminUpdateEvent(item._id, updateFormData);
          setEvents(
            events.map((event) =>
              event._id === item._id ? { ...event, ...updateFormData } : event
            )
          );
          break;
        case "eventHost":
          await api.adminUpdateEventHost(item._id, updateFormData);
          setEventHosts(
            eventHosts.map((host) =>
              host._id === item._id ? { ...host, ...updateFormData } : host
            )
          );
          break;
        default:
          break;
      }

      showSnackbar(
        `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`
      );
      setUpdateDialogOpen(false);
      setItemToUpdate(null);
      setUpdateFormData({});
    } catch (err) {
      console.error("Error updating item:", err);
      showSnackbar("Error updating item", "error");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const { item, type } = itemToDelete;

      if (type === "user" || type === "eventHost") {
        const confirmed = window.confirm(
          `WARNING: This will permanently delete this ${type}. Are you absolutely sure?`
        );
        if (!confirmed) return;
      }

      switch (type) {
        case "user":
          await api.deleteUser(item._id);
          setUsers(users.filter((user) => user._id !== item._id));
          break;
        case "artist":
          await api.adminDeleteArtist(item._id);
          setArtists(artists.filter((artist) => artist._id !== item._id));
          break;
        case "event":
          await api.adminDeleteEvent(item._id);
          setEvents(events.filter((event) => event._id !== item._id));
          break;
        case "eventHost":
          await api.adminDeleteEventHost(item._id);
          setEventHosts(eventHosts.filter((host) => host._id !== item._id));
          break;
        default:
          break;
      }

      showSnackbar(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`
      );
    } catch (err) {
      console.error("Error deleting item:", err);
      showSnackbar("Error deleting item", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const renderUpdateForm = () => {
    if (!itemToUpdate) return null;

    const { type } = itemToUpdate;

    switch (type) {
      case "user":
        return (
          <>
            <TextField
              fullWidth
              label="Name"
              value={updateFormData.name || ""}
              onChange={(e) => handleUpdateFormChange("name", e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              value={updateFormData.email || ""}
              onChange={(e) => handleUpdateFormChange("email", e.target.value)}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>User Type</InputLabel>
              <Select
                value={updateFormData.userType || ""}
                onChange={(e) =>
                  handleUpdateFormChange("userType", e.target.value)
                }
                label="User Type">
                <MenuItem value="regularUser">Regular User</MenuItem>
                <MenuItem value="artist">Artist</MenuItem>
                <MenuItem value="eventHost">Event Host</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Country"
              value={updateFormData.country || ""}
              onChange={(e) =>
                handleUpdateFormChange("country", e.target.value)
              }
              margin="normal"
            />
          </>
        );

      case "artist":
        return (
          <>
            <TextField
              fullWidth
              label="Genre"
              value={updateFormData.genre || ""}
              onChange={(e) => handleUpdateFormChange("genre", e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={3}
              value={updateFormData.bio || ""}
              onChange={(e) => handleUpdateFormChange("bio", e.target.value)}
              margin="normal"
            />
          </>
        );

      case "event":
        return (
          <>
            <TextField
              fullWidth
              label="Title"
              value={updateFormData.title || ""}
              onChange={(e) => handleUpdateFormChange("title", e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={updateFormData.description || ""}
              onChange={(e) =>
                handleUpdateFormChange("description", e.target.value)
              }
              margin="normal"
            />
          </>
        );

      case "eventHost":
        return (
          <>
            <TextField
              fullWidth
              label="Company Name"
              value={updateFormData.companyName || ""}
              onChange={(e) =>
                handleUpdateFormChange("companyName", e.target.value)
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={updateFormData.description || ""}
              onChange={(e) =>
                handleUpdateFormChange("description", e.target.value)
              }
              margin="normal"
            />
          </>
        );

      default:
        return (
          <Typography>Update form for {type} not implemented yet.</Typography>
        );
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Box>Loading data...</Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="admin dashboard tabs">
          <Tab label="Users" />
          <Tab label="Artists" />
          <Tab label="Events" />
          <Tab label="Event Hosts" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <UserManagement
          users={users}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onRefresh={fetchData}
        />
      )}
      {tabValue === 1 && (
        <ArtistManagement
          artists={artists}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onRefresh={fetchData}
        />
      )}
      {tabValue === 2 && (
        <EventManagement
          events={events}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onRefresh={fetchData}
        />
      )}
      {tabValue === 3 && (
        <EventHostManagement
          eventHosts={eventHosts}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onRefresh={fetchData}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          {itemToDelete && (
            <>
              <Typography gutterBottom>
                Are you sure you want to delete this {itemToDelete.type}?
              </Typography>
              <Typography variant="body2" color="error">
                This action cannot be undone and may affect related data.
              </Typography>
              {itemToDelete.type === "user" && (
                <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                  ⚠️ User accounts and their associated data will be permanently
                  removed.
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        maxWidth="md"
        fullWidth>
        <DialogTitle>
          Update{" "}
          {itemToUpdate?.type?.charAt(0).toUpperCase() +
            itemToUpdate?.type?.slice(1)}
        </DialogTitle>
        <DialogContent>{renderUpdateForm()}</DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateConfirm}
            variant="contained"
            color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
