const Visitor = require("../models/Visitor");
const axios = require("axios");

// Helper to extract real IP
const getClientIP = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    null
  );
};

// Basic user agent parser (simple & lightweight)
const parseUserAgent = (userAgent) => {
  let browser = null;
  let browser_version = null;
  let device = "desktop";

  if (!userAgent) return { browser, browser_version, device };

  if (userAgent.includes("Chrome")) browser = "Chrome";
  if (userAgent.includes("Firefox")) browser = "Firefox";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    browser = "Safari";

  const versionMatch = userAgent.match(/(Chrome|Firefox|Safari)\/([\d.]+)/);
  if (versionMatch) browser_version = versionMatch[2];

  if (/Mobi|Android/i.test(userAgent)) device = "mobile";
  if (/Tablet/i.test(userAgent)) device = "tablet";

  return { browser, browser_version, device };
};

exports.addVisitor = async (req, res) => {
  try {
    const {
      visitor_id,
      latitude = null,
      longitude = null,
      platform = "unknown",
    } = req.body;

    if (!visitor_id) {
      return res.status(400).json({
        success: false,
        error: "visitor_id is required",
      });
    }

    // 🔥 Extract IP from request
    const ip_address = getClientIP(req);

    // 🔥 Extract browser/device from headers
    const userAgent = req.headers["user-agent"];
    const { browser, browser_version, device } =
      parseUserAgent(userAgent);

    // 🔥 Reverse Geocoding (if lat/lng provided)
    let cityName = null;
    let regionName = null;
    let countryName = null;
    let countryCode = null;
    let zipCode = null;

    if (latitude && longitude) {
      try {
        const geoRes = await axios.get(
          "https://nominatim.openstreetmap.org/reverse",
          {
            params: {
              lat: latitude,
              lon: longitude,
              format: "json",
            },
            headers: {
              "User-Agent": "visitor-tracking-app",
              "Accept-Language": "en",
            },
          }
        );

        const address = geoRes.data.address || {};

        cityName =
          address.city ||
          address.town ||
          address.village ||
          null;

        regionName = address.state || null;
        countryName = address.country || null;
        countryCode =
          address.country_code?.toUpperCase() || null;

        zipCode = address.postcode || null;
      } catch (geoError) {
        console.log("Reverse geocode failed:", geoError.message);
      }
    }

    // 🔥 Timezone (from server)
    const timezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    const visitorData = {
      visitor_id,
      ip_address,
      browser,
      browser_version,
      device,
      platform,

      coords: {
        latitude,
        longitude,
      },

      cityName,
      regionName,
      countryName,
      countryCode,
      zipCode,
      timezone,

      updated_at: Date.now(),
    };

    // 🔥 Upsert (insert or update)
    const visitor = await Visitor.findOneAndUpdate(
      { visitor_id },
      visitorData,
      { new: true, upsert: true }
    );

    console.log("Visitor saved:", visitor_id);

    res.json({
      success: true,
      visitor_data: visitor,
    });

  } catch (error) {
    console.error("Visitor save error:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


exports.updateVisitorLocation = async (req, res) => {
  try {
    const { visitor_id, latitude, longitude } = req.body;

    if (!visitor_id) {
      return res.status(400).json({
        success: false,
        error: "visitor_id is required",
      });
    }

    const visitor = await Visitor.findOneAndUpdate(
      { visitor_id },
      {
        coords: { latitude, longitude },
        updated_at: Date.now(),
      },
      { returnDocument: "after" } // ✅ fixed mongoose warning
    );

    if (!visitor) {
      return res.status(404).json({
        success: false,
        error: "Visitor not found",
      });
    }

    res.json({
      success: true,
      visitor_data: visitor,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

