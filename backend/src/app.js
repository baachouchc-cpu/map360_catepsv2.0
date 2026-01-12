// Cargar variables de entorno primero
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const { PORT } = require('./config/server');

// Rutas API
const scenesRoutes = require('./routes/scenes.routes');
const routesRoutes = require("./routes/routes.routes");
const searchRoutes = require("./routes/search.routes");
const interactionsRoutes = require("./routes/interactions.routes");
const authRoutes = require("./routes/auth.routes");

// Middleware auth
const authMiddleware = require("./middlewares/authMiddleware");

// Middlewares globales
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Auth API
app.use("/api/auth", authRoutes);
app.use('/api/scenes', scenesRoutes);
app.use('/api', routesRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/interactions", interactionsRoutes);

// FRONTEND STATIC
const frontendPath = path.join(__dirname, "../../marzipano");

// Viewer (Marzipano)
app.use(
  "/viewer",
  express.static(path.join(frontendPath, "viewer"))
);

// Sirve viewer como raíz
app.use(
  "/",
  express.static(path.join(frontendPath, "viewer"))
);

// Admin estáticos
const adminPath = path.join(frontendPath, "admin");

// LOGIN (SIN protección)
app.get("/admin/login", (req, res) => {
  res.sendFile(path.join(adminPath, "login.html"));
});

// PANEL ADMIN (PROTEGIDO)
app.get("/admin", authMiddleware, (req, res) => {
  res.sendFile(path.join(adminPath, "index.html"));
});

// Archivos estáticos admin (css/js)
app.use("/admin", express.static(adminPath));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
