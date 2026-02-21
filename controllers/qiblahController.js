const QiblahHistory = require("../models/QiblahHistory");
const { calculateQiblahDirection } = require("../services/qiblahService");

const findQiblah = async (req, res) => {
  try {
    const { lat, lng, city } = req.body;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude required",
      });
    }

    const qiblahDirection = calculateQiblahDirection(lat, lng);

    // Save to DB
    await QiblahHistory.create({
      latitude: lat,
      longitude: lng,
      qiblahDirection,
      city,
    });

    res.json({
      success: true,
      qiblahDirection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { findQiblah };