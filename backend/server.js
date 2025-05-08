import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { corsMiddleware } from "./middleware/corsMiddleware.js"; // Import the custom CORS middleware
import adminSetupRouter from "./controllers/adminController.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import eventHostRoutes from "./routes/eventHostRoutes.js";

// Initialisation and setup

dotenv.config();

const app = express();
app.use(corsMiddleware);
app.use(express.json());

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Could not connect to MongoDB Atlas", err);
    process.exit(1); // Exit the process if unable to connect to the database
  }
}

connectToDatabase();

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to MUZIKA API" });
});

// Routes 
app.use("/api/admin-setup", adminSetupRouter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/event-hosts", eventHostRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack); 
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS configuration: Using custom middleware`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});
