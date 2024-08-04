import axios from "axios";
import { Event } from "./models/Event.js"; // Note the .js extension
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const MONGO_URL = process.env.MONGO_URL; // Make sure this is set in your .env file

// Connect to your MongoDB database
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const getCoordinates = async (address) => {
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
    console.error("Error getting coordinates:", error);
  }
  return null;
};

const updateEventLocations = async () => {
  try {
    const events = await Event.find({});

    for (const event of events) {
      if (event.address && (!event.location || !event.location.coordinates)) {
        const coordinates = await getCoordinates(event.address);
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
