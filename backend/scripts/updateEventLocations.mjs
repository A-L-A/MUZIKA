import axios from "axios";
import { Event } from "../models/Event.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY; // You'll need to sign up for a free API key

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const getCoordinatesNominatim = async (address) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          format: "json",
          q: address,
          limit: 1,
        },
      }
    );

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return [parseFloat(lon), parseFloat(lat)];
    }
  } catch (error) {
    console.error("Error getting coordinates from Nominatim:", error);
  }
  return null;
};

const getCoordinatesOpenCage = async (address) => {
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json`,
      {
        params: {
          q: address,
          key: OPENCAGE_API_KEY,
          limit: 1,
        },
      }
    );

    if (
      response.data &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      const { lng, lat } = response.data.results[0].geometry;
      return [lng, lat];
    }
  } catch (error) {
    console.error("Error getting coordinates from OpenCage:", error);
  }
  return null;
};

const getCoordinates = async (address) => {
  // Try Nominatim first
  let coordinates = await getCoordinatesNominatim(address);

  // If Nominatim fails, try OpenCage
  if (!coordinates) {
    coordinates = await getCoordinatesOpenCage(address);
  }

  return coordinates;
};

const updateEventLocations = async () => {
  try {
    const events = await Event.find({});

    for (const event of events) {
      if (event.address && (!event.location || !event.location.coordinates)) {
        // Improve address formatting
        const formattedAddress = `${event.address}, ${
          event.country || "East Africa"
        }`;
        let coordinates = await getCoordinates(formattedAddress);

        if (!coordinates) {
          // Try without specific formatting
          coordinates = await getCoordinates(event.address);
        }

        if (coordinates) {
          event.location = {
            type: "Point",
            coordinates: coordinates,
          };
          await event.save();
          console.log(`Updated location for event: ${event.title}`);
        } else {
          console.log(`Could not find coordinates for event: ${event.title}`);
        }
      }
    }

    console.log("Finished updating event locations");
  } catch (error) {
    console.error("Error updating event locations:", error);
  } finally {
    await mongoose.connection.close();
  }
};

updateEventLocations();
