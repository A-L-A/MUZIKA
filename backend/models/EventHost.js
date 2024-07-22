import mongoose from "mongoose";

const EventHostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
    phone: String,
    website: String,
  },
});

export default mongoose.model("EventHost", EventHostSchema);
