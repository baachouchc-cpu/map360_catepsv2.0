// src/routes/interactions.routes.js
const express = require("express"); 
const router = express.Router();
const {
  upsertInteraction,
  getInteractionById,
  updateInteractionDescription,
  validateInteractionPassword
} = require("../controllers/interactions.controller");

// GET → obtener 1 interacción
router.get("/:id", getInteractionById);

// PUT → actualizar descripción
//router.put("/:id/description", updateInteractionDescription);
router.put("/:id/description", (req, res) => {
  req.body.id_interactions = req.params.id;
  updateInteractionDescription(req, res);
});

// POST → crear
router.post("/", upsertInteraction);

// POST → validar contraseña
router.post("/:id/pass_word", validateInteractionPassword);

// PUT → actualizar
router.put("/:id", (req, res) => {
  req.body.id_interactions = req.params.id;
  upsertInteraction(req, res);
});

module.exports = router;