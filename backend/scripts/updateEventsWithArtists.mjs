// updateEventsWithArtists.js
import mongoose from "mongoose";
import { Event } from "../models/Event.js";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateEventsWithArtists = async () => {
  try {
    const events = await Event.find({});
    const artists = await User.find({ userType: "artist" });

    for (const event of events) {
      const numArtists = Math.floor(Math.random() * 3) + 1;
      const selectedArtists = artists
        .sort(() => 0.5 - Math.random())
        .slice(0, numArtists);

      event.artists = selectedArtists.map((artist) => artist._id);
      event.artistsNames = selectedArtists.map((artist) => artist.name);

      await event.save();
      console.log(`Updated event: ${event.title}`);
    }

    console.log("Finished updating events with artists");
  } catch (error) {
    console.error("Error updating events:", error);
  } finally {
    mongoose.connection.close();
  }
};

updateEventsWithArtists();
