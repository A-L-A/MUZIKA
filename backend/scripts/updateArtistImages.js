import mongoose from "mongoose";
import dotenv from "dotenv";
import Artist from "../models/Artist.js"; // Adjust path as needed

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateArtistImages = async () => {
  try {
    const artists = await Artist.find({});

    for (const artist of artists) {
      if (!artist.image) {
        // Set a default image URL if no image is found
        artist.image = "https://source.unsplash.com/random"; // Replace with your default image URL
        await artist.save();
        console.log(`Updated image for artist: ${artist.name}`);
      }
    }

    console.log("Finished updating artist images");
  } catch (error) {
    console.error("Error updating artist images:", error);
  } finally {
    await mongoose.connection.close();
  }
};

updateArtistImages();
