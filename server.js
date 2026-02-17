const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const visitorRoutes = require("./routes/visitorRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api", visitorRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
