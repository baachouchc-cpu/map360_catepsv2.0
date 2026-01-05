const express = require("express");
const router = express.Router();
const {
  upsertInteraction
} = require("../controllers/interactions.controller");

// POST o PUT → UPSERT
router.post("/", upsertInteraction);
// opcional REST puro
router.put("/", upsertInteraction);

module.exports = router;
