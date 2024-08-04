import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToStaticMarkup } from "react-dom/server";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { styled } from "@mui/material/styles";
import { TextField, Button, Box, Autocomplete } from "@mui/material";

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
      console.log("Initializing map");
      mapInstanceRef.current = L.map(mapRef.current).setView([0, 35], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      fetch("/eac-countries.json")
        .then((response) => response.json())
        .then((data) => {
          L.geoJSON(data, {
            style: (feature) => ({
              color: "#000",
              weight: 3,
              fillOpacity: 0.1,
              fillColor: getCountryColor(feature.properties.name),
            }),
            onEachFeature: (feature, layer) => {
              layer.bindPopup(feature.properties.name);
            },
          }).addTo(mapInstanceRef.current);
        });
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

   const createEventIcon = (eventType) => {
     const color = getEventTypeColor(eventType);
     console.log(
       "Creating icon for event type:",
       eventType,
       "with color:",
       color
     );
     const iconHtml = renderToStaticMarkup(
       <MusicNoteIcon style={{ color, fontSize: "36px" }} />
     );
     return L.divIcon({
       html: iconHtml,
       className: "custom-icon",
       iconSize: [36, 36],
       iconAnchor: [18, 36],
       popupAnchor: [0, -36],
     });
   };

    // Clear existing event markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker && !layer._isUserLocation) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    events.forEach((event) => {
      const {
        location,
        title,
        eventType,
        description,
        date,
        ticketPrice,
        currency,
        artist,
        address,
      } = event;

      console.log("Processing event:", title, location);

      if (
        location &&
        location.coordinates &&
        location.coordinates.length === 2
      ) {
        const [longitude, latitude] = location.coordinates;
        console.log("Coordinates:", latitude, longitude);

        if (latitude !== undefined && longitude !== undefined) {
          const icon = createEventIcon(eventType);

          L.marker([latitude, longitude], { icon }).addTo(
            mapInstanceRef.current
          ).bindPopup(`
          <h3>${title}</h3>
          <p><strong>Type:</strong> ${eventType}</p>
          <p><strong>Date:</strong> ${new Date(date).toLocaleString()}</p>
          <p><strong>Artist:</strong> ${artist?.name || "Unknown"}</p>
          <p><strong>Price:</strong> ${ticketPrice} ${currency}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p>${description}</p>
        `);
        }
      } else {
        console.warn("Invalid location data for event:", title);
      }
    });

    // Add or update user location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        html: renderToStaticMarkup(
          <LocationOnIcon style={{ color: "#1976D2", fontSize: "36px" }} />
        ),
        className: "custom-icon",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      })
        .addTo(mapInstanceRef.current)
        .bindPopup("You are here")
        .openPopup();

      userMarker._isUserLocation = true;

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

  const getCountryColor = (countryName) => {
    const colors = {
      Burundi: "#FFC300",
      "Democratic Republic of the Congo": "#DAF7A6",
      Kenya: "#FF5733",
      Rwanda: "#C70039",
      Somalia: "#900C3F",
      "South Sudan": "#581845",
      Tanzania: "#FFC300",
      Uganda: "#DAF7A6",
      Ethiopia: "#FF5733",
      Eritrea: "#C70039",
      Djibouti: "#900C3F",
    };
    return colors[countryName] || "#CCCCCC";
  };

  const getEventTypeColor = (eventType) => {
    const colors = {
      Concert: "#4CAF50",
      Festival: "#F44336",
      Karaoke: "#FF9800",
      "Live Music": "#2196F3",
      "Open Mic": "#9C27B0",
      Party: "#E91E63",
    };
    return colors[eventType] || "#757575";
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
          sx={{ mt: 1 }}>
          Search
        </Button>
      </Box>
      <MapContainer ref={mapRef} />
    </Box>
  );
};

export default EventMap;
