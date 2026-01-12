// src/routes/interactions.routes.js
const express = require("express"); 
const router = express.Router();
const {
  upsertInteraction,
  getInteractionById
} = require("../controllers/interactions.controller");

// GET → obtener 1 interacción
router.get("/:id", getInteractionById);

// POST → crear
router.post("/", upsertInteraction);

// PUT → actualizar
router.put("/:id", (req, res) => {
  req.body.id_interactions = req.params.id;
  upsertInteraction(req, res);
});

module.exports = router;