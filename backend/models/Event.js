import mongoose from "mongoose";

/**
 * Event Schema
 * Defines data structure for music events
 */
const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    date: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
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
      enum: [
        "Open Mic",
        "Karaoke",
        "Concert",
        "Festival",
        "Party",
        "Live Music",
      ],
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
    ticketPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "/images/eventz/default-event.jpg",
    },
  },
  { timestamps: true }
); // Add timestamps for createdAt and updatedAt

// Add geospatial index for location-based queries
EventSchema.index({ coordinates: "2dsphere" });

// Virtual for event URL
EventSchema.virtual("url").get(function () {
  return `/events/${this._id}`;
});

// Method to check if event has already occurred
EventSchema.methods.hasOccurred = function () {
  return this.date < new Date();
};

// Method to get formatted date string
EventSchema.methods.getFormattedDate = function () {
  return this.date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const Event = mongoose.model("Event", EventSchema);
