const express = require("express");
const router = express.Router();
const { findQiblah } = require("../controllers/qiblahController");

router.post("/find", findQiblah); // fixed typo here

module.exports = router;