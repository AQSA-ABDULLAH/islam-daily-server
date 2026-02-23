//api/index
const express = require("express");
const cors = require("cors");
const connectDB = require("../config/db");
const visitorRoutes = require("../routes/visitorRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/api", visitorRoutes);

module.exports = app;