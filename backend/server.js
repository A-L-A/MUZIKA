const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB and create collections
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB Atlas");

    // Create collections
    const collections = ["users", "artists", "events"];
    collections.forEach(async (collectionName) => {
      try {
        if (
          !(await mongoose.connection.db
            .listCollections({ name: collectionName })
            .next())
        ) {
          await mongoose.connection.db.createCollection(collectionName);
          console.log(`Collection created: ${collectionName}`);
        } else {
          console.log(`Collection already exists: ${collectionName}`);
        }
      } catch (err) {
        console.error(`Error handling collection ${collectionName}:`, err);
      }
    });
  })
  .catch((err) => console.error("Could not connect to MongoDB Atlas", err));

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Muzika Genesis API" });
});

// AdminSetup route
const adminSetup = require("./routes/adminSetup");
app.use("/api/admin-setup", adminSetup);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/artists", require("./routes/artistRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
