const express = require("express");
const router = express.Router();
const { addVisitor, updateVisitorLocation } = require("../controllers/visitorController");

router.post("/visitors", addVisitor);
router.post("/update-visitor-location", updateVisitorLocation);

module.exports = router;
