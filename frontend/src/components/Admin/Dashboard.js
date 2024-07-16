// src/components/admin/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
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

    fetchData();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email} - {user.userType}
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
