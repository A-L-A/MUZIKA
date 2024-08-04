import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Box, TextField, Button, Autocomplete } from "@mui/material";
import { styled } from "@mui/material/styles";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { renderToStaticMarkup } from "react-dom/server";

const MapContainer = styled("div")({
  height: "600px",
  width: "100%",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
});

const EventMap = ({ events, userLocation, onLocationSelect }) => {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([0, 35], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    events.forEach((event) => {
      if (event.coordinates && event.coordinates.coordinates) {
        const [longitude, latitude] = event.coordinates.coordinates;

        const iconHtml = renderToStaticMarkup(
          <MusicNoteIcon style={{ color: "#8B4513", fontSize: "36px" }} />
        );
        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-icon",
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });

        const popupContent = `
          <div style="font-family: Arial, sans-serif; max-width: 200px;">
            <h3 style="margin-bottom: 10px;">${event.title}</h3>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(
              event.date
            ).toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>Type:</strong> ${
              event.eventType
            }</p>
            <p style="margin: 5px 0;"><strong>Artists:</strong> ${
              event.artistsNames
                ? event.artistsNames.join(", ")
                : "Not specified"
            }</p>
            <p style="margin: 5px 0;"><strong>Address:</strong> ${
              event.address
            }</p>
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
              <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                event.address
              )}', '_blank')" style="padding: 5px 10px; background-color: #4285F4; color: white; border: none; border-radius: 4px; cursor: pointer;">Google Maps</button>
              <button onclick="window.open('https://www.openstreetmap.org/directions?engine=osrm_car&route=;${latitude},${longitude}', '_blank')" style="padding: 5px 10px; background-color: #7EBC6F; color: white; border: none; border-radius: 4px; cursor: pointer;">OpenStreetMap</button>
            </div>
          </div>
        `;

        L.marker([latitude, longitude], { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(popupContent);
      }
    });

    if (userLocation) {
      L.marker([userLocation.lat, userLocation.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup("You are here")
        .openPopup();

      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 10);
    }
  }, [events, userLocation]);

  const handleAddressSearch = async () => {
    if (!mapInstanceRef.current) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        mapInstanceRef.current.setView([lat, lon], 13);
        L.marker([lat, lon])
          .addTo(mapInstanceRef.current)
          .bindPopup("Selected location")
          .openPopup();
        onLocationSelect({ lat, lng: lon });
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Error searching for address:", error);
      alert("Error searching for address");
    }
  };

  const handleAddressChange = async (event, newValue) => {
    setAddress(newValue);
    if (newValue.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            newValue
          )}`
        );
        const data = await response.json();
        setSuggestions(data.map((item) => item.display_name));
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    }
  };

  const handleRecenterMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([0, 35], 5);
    }
  };

  return (
    <Box>
      <Box mb={2}>
        <Autocomplete
          freeSolo
          options={suggestions}
          onInputChange={handleAddressChange}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="Search address"
              variant="outlined"
            />
          )}
        />
        <Button
          variant="contained"
          onClick={handleAddressSearch}
          sx={{ mt: 1, mr: 1 }}>
          Search
        </Button>
        <Button variant="outlined" onClick={handleRecenterMap} sx={{ mt: 1 }}>
          Recenter Map
        </Button>
      </Box>
      <MapContainer ref={mapRef} />
    </Box>
  );
};

export default EventMap;
