import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    required: true,
  },
  location: {
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
  ticketPrice: Number,
});

EventSchema.index({ location: "2dsphere" });

export default mongoose.model("Event", EventSchema);
