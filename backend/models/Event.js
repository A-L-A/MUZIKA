import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  address: { type: String, required: true },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    required: true,
  },
  eventHost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EventHost",
    required: true,
  },
  eventType: {
    type: String,
    enum: ["Open Mic", "Karaoke", "Concert", "Festival", "Party", "Live Music"],
    required: true,
  },
  musicGenre: {
    type: String,
    enum: [
      "Afrobeats",
      "Afropop",
      "Afrofusion",
      "Amapiano",
      "Bongo Flava",
      "Classic",
      "Highlife",
      "Hiphop/Rap",
      "Kinyatrap",
      "Reggae",
      "RnB",
      "Sega",
      "Zouk",
      "Other",
    ],
    required: true,
  },
  otherMusicGenre: String,
  ticketPrice: { type: Number, required: true },
  currency: { type: String, required: true },
  image: { type: String, required: true },
});

export const Event = mongoose.model("Event", EventSchema);
