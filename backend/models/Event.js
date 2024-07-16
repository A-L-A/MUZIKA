const mongoose = require("mongoose");

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
  eventType: {
    type: String,
    enum: [
      "Open Mic",
      "Karaoke",
      "Concert",
      "Festival",
      "Party",
      "Live Music",
      "Other",
    ],
    required: true,
  },
  ticketPrice: Number,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

EventSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Event", EventSchema);
