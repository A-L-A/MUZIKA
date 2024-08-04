import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Tabs, Tab, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
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
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, artistsRes, eventsRes, eventHostsRes] = await Promise.all([
        api.getAllUsers(),
        api.getAllArtists(),
        api.getAllEvents(),
        api.getEventHosts(),
      ]);

      setUsers(usersRes.data);
      setArtists(artistsRes.data);
      setEvents(eventsRes.data);
      setEventHosts(eventHostsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDelete = (item, type) => {
    setItemToDelete({ item, type });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const { item, type } = itemToDelete;
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
          await api.deleteEventHost(item._id);
          setEventHosts(eventHosts.filter((host) => host._id !== item._id));
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin dashboard tabs">
          <Tab label="Users" />
          <Tab label="Artists" />
          <Tab label="Events" />
          <Tab label="Event Hosts" />
        </Tabs>
      </Box>
      {tabValue === 0 && <UserManagement users={users} onDelete={handleDelete} />}
      {tabValue === 1 && <ArtistManagement artists={artists} onDelete={handleDelete} />}
      {tabValue === 2 && <EventManagement events={events} onDelete={handleDelete} />}
      {tabValue === 3 && <EventHostManagement eventHosts={eventHosts} onDelete={handleDelete} />}

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
