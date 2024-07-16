const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  const { title, description, date, location, genre, ticketPrice } = req.body;
  try {
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      genre,
      ticketPrice,
      createdBy: req.user.id,
    });
    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getEventById = async (req, res) => {
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

exports.getEventsByUser = async (req, res) => {
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

exports.updateEvent = async (req, res) => {
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

exports.deleteEvent = async (req, res) => {
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
