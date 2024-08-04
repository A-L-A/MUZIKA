import EventHost from "../models/EventHost.js";
import User from "../models/User.js";


export const createOrUpdateEventHost = async (req, res) => {
  try {
    let eventHost = await EventHost.findOne({ user: req.user._id });
    if (eventHost) {
      eventHost = await EventHost.findOneAndUpdate(
        { user: req.user._id },
        req.body,
        { new: true }
      );
    } else {
      eventHost = new EventHost({
        ...req.body,
        user: req.user._id,
      });
      await eventHost.save();
      await User.findByIdAndUpdate(req.user._id, { userType: "eventHost" });
    }
    res.json(eventHost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllEventHosts = async (req, res) => {
  try {
    const eventHosts = await EventHost.find().populate("user", "name email");
    res.json(eventHosts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEventHostById = async (req, res) => {
  try {
    const eventHost = await EventHost.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!eventHost) {
      return res.status(404).json({ message: "Event host not found" });
    }
    res.json(eventHost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEventHostProfile = async (req, res) => {
  try {
    const eventHost = await EventHost.findOne({ user: req.user._id }).populate(
      "user",
      "name email"
    );
    if (!eventHost) {
      return res.status(404).json({ message: "Event host profile not found" });
    }
    res.json(eventHost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEventHostProfile = async (req, res) => {
  try {
    const eventHost = await EventHost.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true }
    );
    if (!eventHost) {
      return res.status(404).json({ message: "Event host profile not found" });
    }
    res.json(eventHost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEventHostProfile = async (req, res) => {
  try {
    const eventHost = await EventHost.findOneAndDelete({ user: req.user._id });
    if (!eventHost) {
      return res.status(404).json({ message: "Event host profile not found" });
    }
    await User.findByIdAndUpdate(req.user._id, { userType: "user" });
    res.json({ message: "Event host profile deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEventHost = async (req, res) => {
  try {
    const eventHost = await EventHost.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!eventHost) {
      return res.status(404).json({ message: "Event host not found" });
    }
    res.json(eventHost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEventHost = async (req, res) => {
  try {
    const eventHost = await EventHost.findByIdAndDelete(req.params.id);
    if (!eventHost) {
      return res.status(404).json({ message: "Event host not found" });
    }
    await User.findByIdAndUpdate(eventHost.user, { userType: "user" });
    res.json({ message: "Event host deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
