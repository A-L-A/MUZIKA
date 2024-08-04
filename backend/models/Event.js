import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  address: { type: String, required: true },
  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  artists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  artistsNames: [String],
  eventHost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

EventSchema.index({ coordinates: "2dsphere" });

export const Event = mongoose.model("Event", EventSchema);
