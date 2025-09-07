import { Event } from "../models/Event.js";
import User from "../models/User.js";
import axios from "axios";

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

// Get coordinates from OpenCage API
const getCoordinates = async (address) => {
  try {
    const response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: { q: address, key: OPENCAGE_API_KEY, limit: 1 },
      }
    );
    if (response.data?.results?.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      return [lng, lat];
    }
  } catch (error) {
    console.error("Error getting coordinates from OpenCage:", error);
  }
  return null;
};

// Default image selection based on event type
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

// Create event
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
    } = req.body;

    if (
      !title ||
      !date ||
      !address ||
      !eventType ||
      !musicGenre ||
      !ticketPrice ||
      !currency
    )
      return res
        .status(400)
        .json({ msg: "All required fields must be provided" });

    const coordinates = await getCoordinates(address);
    if (!coordinates)
      return res
        .status(400)
        .json({ msg: "Unable to geocode the provided address" });

    let artistsInDb = [];
    if (artistsNames?.length > 0)
      artistsInDb = await User.find({
        name: { $in: artistsNames },
        userType: "artist",
      });

    const imagePath = req.file
      ? `/images/eventz/${req.file.filename}`
      : getEventImageFilename(eventType);

    const newEvent = new Event({
      title,
      description,
      date,
      address,
      coordinates: { type: "Point", coordinates },
      artists: artistsInDb.map((a) => a._id),
      artistsNames: artistsNames || [],
      eventHost: req.user.id,
      eventType,
      musicGenre,
      otherMusicGenre,
      ticketPrice: parseFloat(ticketPrice),
      currency,
      image: imagePath,
    });

    const event = await newEvent.save();
    const populatedEvent = await Event.findById(event._id)
      .populate("artists", "name email")
      .populate("eventHost", "name email");

    res.status(201).json(populatedEvent);
  } catch (err) {
    console.error("Error creating event:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Update event
export const updateEvent = async (req, res) => {
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
    } = req.body;

    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (
      event.eventHost.toString() !== req.user.id &&
      req.user.userType !== "admin"
    )
      return res
        .status(403)
        .json({ msg: "Not authorized to update this event" });

    let coordinates = event.coordinates;
    if (address && address !== event.address) {
      const newCoordinates = await getCoordinates(address);
      if (!newCoordinates)
        return res
          .status(400)
          .json({ msg: "Unable to geocode the provided address" });
      coordinates = { type: "Point", coordinates: newCoordinates };
    }

    let artistIds = event.artists;
    if (artistsNames?.length > 0) {
      const artistsInDb = await User.find({
        name: { $in: artistsNames },
        userType: "artist",
      });
      artistIds = artistsInDb.map((a) => a._id);
    }

    const updatedEventType = eventType || event.eventType;
    const eventImage = req.file
      ? `/images/eventz/${req.file.filename}`
      : event.image || getEventImageFilename(updatedEventType);

    const updatedEvent = await Event.findByIdAndUpdate(
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
      { new: true, runValidators: true }
    )
      .populate("artists", "name email")
      .populate("eventHost", "name email");

    res.json(updatedEvent);
  } catch (err) {
    console.error("Error updating event:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: -1 })
      .populate("artists", "name email")
      .populate("eventHost", "name email");
    res.json(events);
  } catch (err) {
    console.error("Error getting events:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("artists", "name email")
      .populate("eventHost", "name email");
    if (!event) return res.status(404).json({ msg: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error("Error getting event by ID:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Get events by current user
export const getEventsByUser = async (req, res) => {
  try {
    const events = await Event.find({ eventHost: req.user.id })
      .sort({ date: -1 })
      .populate("artists", "name email");
    res.json(events);
  } catch (err) {
    console.error("Error getting user events:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (
      event.eventHost.toString() !== req.user.id &&
      req.user.userType !== "admin"
    )
      return res
        .status(403)
        .json({ msg: "Not authorized to delete this event" });

    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: "Event removed successfully" });
  } catch (err) {
    console.error("Error deleting event:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};
