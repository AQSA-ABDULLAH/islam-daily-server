const mongoose = require("mongoose");

const qiblahSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    qiblahDirection: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QiblahHistory", qiblahSchema);