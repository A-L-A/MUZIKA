import mongoose from "mongoose";

const EventHostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["eventHost"],
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  contactInfo: {
    phone: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
  },
});

export default mongoose.model("EventHost", EventHostSchema);
