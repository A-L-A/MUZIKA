import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField, Box } from "@mui/material";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", userType: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await axios.get("/api/admin/users");
      setUsers(usersRes.data);

      const artistsRes = await axios.get("/api/admin/artists");
      setArtists(artistsRes.data);

      const eventsRes = await axios.get("/api/admin/events");
      setEvents(eventsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/users", newUser);
      setNewUser({ name: "", email: "", userType: "" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/api/admin/users/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Create New User</h2>
      <Box
        component="form"
        onSubmit={handleCreateUser}
        noValidate
        sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          value={newUser.name}
          onChange={handleNewUserChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          value={newUser.email}
          onChange={handleNewUserChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="userType"
          label="User Type"
          name="userType"
          value={newUser.userType}
          onChange={handleNewUserChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}>
          Create User
        </Button>
      </Box>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email} - {user.userType}
            <Button onClick={() => handleDeleteUser(user._id)}>Delete</Button>
          </li>
        ))}
      </ul>
      <h2>Artists</h2>
      <ul>
        {artists.map((artist) => (
          <li key={artist._id}>
            {artist.user.name} - {artist.genre}
          </li>
        ))}
      </ul>
      <h2>Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            {event.title} - {event.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
