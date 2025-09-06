import axios from "axios";
import { Event } from "../models/Event.js";
import User from "../models/User.js";

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

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

    if (response.data?.results?.length > 0) {
      const { lng, lat } = response.data.results[0].geometry;
      return [lng, lat];
    }
  } catch (error) {
    console.error("Error getting coordinates from OpenCage:", error);
  }
  return null;
};

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

    // Get coordinates
    const coordinates = await getCoordinates(address);
    if (!coordinates) {
      return res
        .status(400)
        .json({ msg: "Unable to geocode the provided address" });
    }

    // Find artists
    let artistsInDb = [];
    if (artistsNames?.length > 0) {
      artistsInDb = await User.find({
        name: { $in: artistsNames },
        userType: "artist",
      });
    }

    // Set image
    const defaultImageName = getEventImageFilename(eventType);
    const eventImage = image || defaultImageName;

    // Create event
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
      image,
    } = req.body;

    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // Check authorization
    if (
      event.eventHost.toString() !== req.user.id &&
      req.user.userType !== "admin"
    ) {
      return res
        .status(403)
        .json({ msg: "Not authorized to update this event" });
    }

    // Update coordinates if address changed
    let coordinates = event.coordinates;
    if (address && address !== event.address) {
      const newCoordinates = await getCoordinates(address);
      if (newCoordinates) {
        coordinates = { type: "Point", coordinates: newCoordinates };
      } else {
        return res
          .status(400)
          .json({ msg: "Unable to geocode the provided address" });
      }
    }

    // Update artists
    let artistIds = event.artists;
    if (artistsNames?.length > 0) {
      const artistsInDb = await User.find({
        name: { $in: artistsNames },
        userType: "artist",
      });
      artistIds = artistsInDb.map((artist) => artist._id);
    }

    // Update image
    const updatedEventType = eventType || event.eventType;
    const defaultImageName = getEventImageFilename(updatedEventType);
    const eventImage = image || event.image || defaultImageName;

    // Update event
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

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("artists", "name email")
      .populate("eventHost", "name email");

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("Error getting event by ID:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

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

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    if (
      event.eventHost.toString() !== req.user.id &&
      req.user.userType !== "admin"
    ) {
      return res
        .status(403)
        .json({ msg: "Not authorized to delete this event" });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: "Event removed successfully" });
  } catch (err) {
    console.error("Error deleting event:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};
