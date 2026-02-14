const express = require('express');
const router = express.Router();
const { getScenes,getNameScenes } = require('../controllers/scenes.controller');

// GET → obtener todas las escenas con hotspots
router.get('/', getScenes);

// GET → obtener solo id y name de las escenas
router.get('/names', getNameScenes);

module.exports = router;
