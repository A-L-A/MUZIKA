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

// Define Routes
app.use("/auth", require("./routes/auth"));
app.use("/artists", require("./routes/artists"));
app.use("/events", require("./routes/events"));
app.use("/admin", require("./routes/admin"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
