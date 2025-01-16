import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["regularUser", "artist", "eventHost", "admin"],
    required: true,
  },
  name: String,
  country: String,
  genre: String,
  bio: String,
  companyName: String,
  description: String,
  contactInfo: {
    phone: String,
    website: String,
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("User", UserSchema);
