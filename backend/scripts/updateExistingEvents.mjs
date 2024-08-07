import mongoose from "mongoose";
import dotenv from "dotenv";
import { Event } from "../models/Event.js";
import axios from "axios";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const getCoordinates = async (address) => {
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

const updateEvents = async () => {
  try {
    const events = await Event.find({});

    for (const event of events) {
      if (
        event.address &&
        (!event.coordinates || !event.coordinates.coordinates)
      ) {
        const coordinates = await getCoordinates(event.address);
        if (coordinates) {
          event.coordinates = {
            type: "Point",
            coordinates: coordinates,
          };
          await event.save();
          console.log(`Updated coordinates for event: ${event.title}`);
        } else {
          console.log(`Could not find coordinates for event: ${event.title}`);
        }
      }
    }

    console.log("Finished updating event coordinates");
  } catch (error) {
    console.error("Error updating event coordinates:", error);
  } finally {
    await mongoose.connection.close();
  }
};

updateEvents();
