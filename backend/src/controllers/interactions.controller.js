const Interactions = require("../models/interactions.model");
const db = require("../services/db");

// CREATE + UPDATE (UPSERT)
const upsertInteraction = async (req, res) => {
  try {
    const {
      scene_id,
      title,
      yaw,
      pitch,
      rotation,
      icon_id,
      type_id      
    } = req.body;

    // Validación mínima
    if (
      !scene_id ||
      !title ||
      yaw === undefined ||
      pitch === undefined ||
      rotation === undefined ||
      !icon_id ||
      !type_id      
    ) {
      return res.status(400).json({
        error: "Faltan campos obligatorios"
      });
    }

    const interaction = await Interactions.upsert(req.body);

    res.status(200).json({
      message: "Interacción creada o actualizada correctamente",
      interaction
    });

  } catch (error) {
    console.error("UPSERT interaction error:", error);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
};


// GET BY ID
const getInteractionById = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await db.query(
      "SELECT * FROM interactions WHERE id_interactions = $1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Interacción no encontrada" });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error("GET interaction error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


module.exports = {
  upsertInteraction,
  getInteractionById
};
