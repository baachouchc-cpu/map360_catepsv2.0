const Interactions = require("../models/interactions.model");

const upsertInteraction = async (req, res) => {
  try {
    const {
      scene_id,
      title,
      yaw,
      pitch,
      rotation,
      type_id
    } = req.body;

    // Validación mínima
    if (
      !scene_id ||
      !title ||
      yaw === undefined ||
      pitch === undefined ||
      rotation === undefined ||
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

module.exports = {
  upsertInteraction
};