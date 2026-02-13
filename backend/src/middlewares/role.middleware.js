module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect("/admin/login");
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).send("Acceso denegado");
    }

    next();
  };
};

// module.exports = (roles = []) => {
//   return (req, res, next) => {

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ error: "Acceso denegado" });
//     }
//     next();
//   };
// };
