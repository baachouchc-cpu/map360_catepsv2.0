const Scenes = require('../models/scenes.model');
const db = require("../services/db");

// Controlador para obtener todas las escenas con sus hotspots
async function getScenes(req, res) {
  try {
    const scenes = await Scenes.getAllScenesWithHotspots();
    res.json(scenes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving scenes' });
  }
}

// Controlador para obtener solo id y name de las escenas
const getNameScenes = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id_scene, description AS name FROM scenes ORDER BY name"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo escenas" });
  }
};

module.exports = { getScenes, getNameScenes };
