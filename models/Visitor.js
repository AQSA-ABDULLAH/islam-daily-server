const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  visitor_id: { type: String, required: true, unique: true },
  country_id: { type: Number, default: null },
  coords: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  plus_code: { type: String, default: null },
  ip_address: { type: String, required: true },
  browser: { type: String, default: null },
  browser_version: { type: String, default: null },
  device: { type: String, default: null },
  platform: { type: String, default: null },
  countryName: { type: String, default: null },
  countryCode: { type: String, default: null },
  regionCode: { type: String, default: null },
  regionName: { type: String, default: null },
  cityName: { type: String, default: null },
  zipCode: { type: String, default: null },
  isoCode: { type: String, default: null },
  postalCode: { type: String, default: null },
  areaCode: { type: String, default: null },
  timezone: { type: String, default: null },
  verified: { type: Boolean, default: true },
  access_platform: { type: String, default: "app" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

visitorSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Visitor", visitorSchema);
