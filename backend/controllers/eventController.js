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

    if (
      !title ||
      !date ||
      !address ||
      !artistsNames ||
      !eventType ||
      !musicGenre ||
      !ticketPrice ||
      !currency ||
      !image
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const coordinates = await getCoordinates(address);

    if (!coordinates) {
      return res
        .status(400)
        .json({ msg: "Unable to geocode the provided address" });
    }

    const artistsInDb = await User.find({
      name: { $in: artistsNames },
      userType: "artist",
    });

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
      artistsNames,
      eventHost: req.user.id,
      eventType,
      musicGenre,
      otherMusicGenre,
      ticketPrice,
      currency,
      image,
    });

    const event = await newEvent.save();
    res.json(
      await Event.findById(event._id).populate("artists").populate("eventHost")
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

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
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    if (
      event.eventHost.toString() !== req.user.id &&
      req.user.userType !== "admin"
    ) {
      return res.status(401).json({ msg: "Not authorized" });
    }

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

    const artistsInDb = await User.find({
      name: { $in: artistsNames },
      userType: "artist",
    });

    event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title,
          description,
          date,
          address,
          coordinates,
          artists: artistsInDb.map((artist) => artist._id),
          artistsNames,
          eventType,
          musicGenre,
          otherMusicGenre,
          ticketPrice,
          currency,
          image,
        },
      },
      { new: true }
    )
      .populate("artists")
      .populate("eventHost");

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: -1 })
      .populate("artists")
      .populate("eventHost");
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

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
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.status(500).send("Server Error");
  }
};

export const getEventsByUser = async (req, res) => {
  try {
    const events = await Event.find({ eventHost: req.user.id })
      .sort({ date: -1 })
      .populate("artists");
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
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
      return res.status(401).json({ msg: "Not authorized" });
    }
    await event.remove();
    res.json({ msg: "Event removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
