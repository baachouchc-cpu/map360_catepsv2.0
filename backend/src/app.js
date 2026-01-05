// Cargar variables de entorno primero
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require("path");
const app = express();
const { PORT } = require('./config/server');
const scenesRoutes = require('./routes/scenes.routes');
const routesRoutes = require("./routes/routes.routes");
const searchRoutes = require("./routes/search.routes");
const interactionsRoutes = require("./routes/interactions.routes");

app.use(cors());
app.use(express.json());

app.use('/api/scenes', scenesRoutes);
app.use('/api', routesRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/interactions", interactionsRoutes);

// === FRONTEND STATIC FILES ===
const frontendPath = path.join(__dirname, "../../marzipano");

// Viewer (Marzipano)
app.use(
  "/viewer",
  express.static(path.join(frontendPath, "viewer"))
);

// Admin
app.use(
  "/admin",
  express.static(path.join(frontendPath, "admin"))
);

// Sirve viewer como raíz
app.use(
  "/",
  express.static(path.join(frontendPath, "viewer"))
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
