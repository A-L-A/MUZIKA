import axios from "axios";
import { Event } from "../models/Event.js";
import User from "../models/User.js";

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

/**
 * Get coordinates from address using OpenCage API
 *
 * @param {string} address - Address to geocode
 * @returns {Array|null} - [longitude, latitude] or null if not found
 */
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

/**
 * Maps event types to image filenames
 * @param {string} eventType - Type of event
 * @returns {string} - Filename for the event type
 */
const getEventImageFilename = (eventType) => {
  if (!eventType) return "default-event.jpg";

  const type = eventType.toLowerCase().replace(/\s+/g, "-");
  const validTypes = [
    "concert",
    "festival",
    "karaoke",
    "live-music",
    "open-mic",
    "party",
  ];

  return validTypes.includes(type) ? `${type}.jpg` : "default-event.jpg";
};

/**
 * Create new event
 * POST /api/events
 */
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      address,
      artistsNames,
      eventType,
      musicGenre,
      otherMusicGenre,
      ticketPrice,
      currency,
      image,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !date ||
      !address ||
      !eventType ||
      !musicGenre ||
      !ticketPrice ||
      !currency
    ) {
      return res
        .status(400)
        .json({ msg: "All required fields must be provided" });
    }

    // Get coordinates for the address
    const coordinates = await getCoordinates(address);
    if (!coordinates) {
      return res
        .status(400)
        .json({ msg: "Unable to geocode the provided address" });
    }

    // Find artists in database if artistsNames provided
    let artistsInDb = [];
    if (artistsNames && artistsNames.length > 0) {
      artistsInDb = await User.find({
        name: { $in: artistsNames },
        userType: "artist",
      });
    }

    // Set image path based on event type if not provided
    // For frontend: prepend with `/images/eventz/`
    // We store just the filename in the database
    const defaultImageName = getEventImageFilename(eventType);
    const eventImage = image || defaultImageName;

    // Create new event
    const newEvent = new Event({
      title,
      description,
      date,
      address,
      coordinates: {
        type: "Point",
        coordinates: coordinates,
      },
      artists: artistsInDb.map((artist) => artist._id),
      artistsNames: artistsNames || [],
      eventHost: req.user.id,
      eventType,
      musicGenre,
      otherMusicGenre,
      ticketPrice: parseFloat(ticketPrice),
      currency,
      image: eventImage,
    });

    // Save event to database
    const event = await newEvent.save();

    // Return newly created event with populated fields
    res
      .status(201)
      .json(
        await Event.findById(event._id)
          .populate("artists")
          .populate("eventHost")
      );
  } catch (err) {
    console.error("Error creating event:", err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * Update existing event
 * PUT /api/events/:id
 */
export const updateEvent = async (req, res) => {
  const {
    title,
    description,
    date,
    address,
    artistsNames,
    eventType,
    musicGenre,
    otherMusicGenre,
    ticketPrice,
    currency,
    image,
  } = req.body;

  try {
    // Find event by ID
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // Check authorization - only event host or admin can update
    if (
      event.eventHost.toString() !== req.user.id &&
      req.user.userType !== "admin"
    ) {
      return res
        .status(401)
        .json({ msg: "Not authorized to update this event" });
    }

    // Update coordinates if address changed
    let coordinates = event.coordinates;
    if (address && address !== event.address) {
      const newCoordinates = await getCoordinates(address);
      if (newCoordinates) {
        coordinates = {
          type: "Point",
          coordinates: newCoordinates,
        };
      } else {
        return res
          .status(400)
          .json({ msg: "Unable to geocode the provided address" });
      }
    }

    // Find artists in database if artistsNames provided
    let artistIds = event.artists;
    if (artistsNames && artistsNames.length > 0) {
      const artistsInDb = await User.find({
        name: { $in: artistsNames },
        userType: "artist",
      });
      artistIds = artistsInDb.map((artist) => artist._id);
    }

    // Set image path based on event type if not provided
    const updatedEventType = eventType || event.eventType;
    const defaultImageName = getEventImageFilename(updatedEventType);
    const eventImage = image || event.image || defaultImageName;

    // Update event
    event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: title || event.title,
          description: description || event.description,
          date: date || event.date,
          address: address || event.address,
          coordinates,
          artists: artistIds,
          artistsNames: artistsNames || event.artistsNames,
          eventType: eventType || event.eventType,
          musicGenre: musicGenre || event.musicGenre,
          otherMusicGenre: otherMusicGenre || event.otherMusicGenre,
          ticketPrice: ticketPrice
            ? parseFloat(ticketPrice)
            : event.ticketPrice,
          currency: currency || event.currency,
          image: eventImage,
        },
      },
      { new: true }
    )
      .populate("artists")
      .populate("eventHost");

    res.json(event);
  } catch (err) {
    console.error("Error updating event:", err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * Get all events
 * GET /api/events
 */
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: -1 })
      .populate("artists")
      .populate("eventHost");
    res.json(events);
  } catch (err) {
    console.error("Error getting events:", err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * Get event by ID
 * GET /api/events/:id
 */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("artists")
      .populate("eventHost");

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("Error getting event by ID:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.status(500).send("Server Error");
  }
};

/**
 * Get events by current user
 * GET /api/events/user
 */
export const getEventsByUser = async (req, res) => {
  try {
    const events = await Event.find({ eventHost: req.user.id })
      .sort({ date: -1 })
      .populate("artists");
    res.json(events);
  } catch (err) {
    console.error("Error getting user events:", err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * Delete event
 * DELETE /api/events/:id
 */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // Check authorization - only event host or admin can delete
    if (
      event.eventHost.toString() !== req.user.id &&
      req.user.userType !== "admin"
    ) {
      return res
        .status(401)
        .json({ msg: "Not authorized to delete this event" });
    }

    // Delete event
    await Event.findByIdAndDelete(event._id);
    res.json({ msg: "Event removed successfully" });
  } catch (err) {
    console.error("Error deleting event:", err.message);
    res.status(500).send("Server Error");
  }
};
