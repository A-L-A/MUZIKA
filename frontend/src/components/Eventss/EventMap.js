import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const EventMap = ({ events }) => {
  return (
    <MapContainer
      center={[0, 35]}
      zoom={4}
      style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {events.map((event) => (
        <Marker key={event.id} position={event.venue.coordinates}>
          <Popup>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>Date: {event.date}</p>
            <p>Time: {event.time}</p>
            <p>Venue: {event.venue.name}</p>
            <p>Genre: {event.genre}</p>
            <p>Artist: {event.artist}</p>
            <p>Ticket Price: {event.ticketPrice}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default EventMap;
