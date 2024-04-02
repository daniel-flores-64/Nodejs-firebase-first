const express = require("express");
const { Router } = require("express");
const {
  loadIndex,
} = require("../controllers/statics.controller.js");

const router = express.Router();

router.get("/", loadIndex);

module.exports = router;
