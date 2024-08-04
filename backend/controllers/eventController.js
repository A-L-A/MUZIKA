import { Event } from "../models/Event.js"; 

export const createEvent = async (req, res) => {
  const {
    title,
    description,
    date,
    address,
    artist,
    eventType,
    musicGenre,
    otherMusicGenre,
    ticketPrice,
    currency,
    image,
  } = req.body;

  try {
    // Validate required fields
    if (
      !title ||
      !date ||
      !address ||
      !artist ||
      !eventType ||
      !musicGenre ||
      !ticketPrice ||
      !currency ||
      !image
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      address,
      artist,
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
      await Event.findById(event._id).populate("artist").populate("eventHost")
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: -1 })
      .populate("artist")
      .populate("eventHost");
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
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
    const events = await Event.find({ createdBy: req.user.id }).sort({
      date: -1,
    });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const updateEvent = async (req, res) => {
  const { title, description, date, location, genre, ticketPrice } = req.body;
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    if (
      event.createdBy.toString() !== req.user.id &&
      req.user.userType !== "admin"
    ) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, date, location, genre, ticketPrice } },
      { new: true }
    );
    res.json(event);
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
      event.createdBy.toString() !== req.user.id &&
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
