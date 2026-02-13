const path = require("path");

// Página LOGIN
exports.loginPage = (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../marzipano/admin/pages/login.html")
  );
};

// Página ADMIN (protegida)
exports.adminPage = (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../marzipano/admin/pages/index.html")
  );
};

// Página ADMIN (protegida)
exports.tecniPage = (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../marzipano/admin/pages/tecnic.html")
  );
};
