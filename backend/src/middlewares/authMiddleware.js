module.exports = (req, res, next) => {
  if (!req.cookies || !req.cookies.adminAuth) {
    return res.redirect("/admin/login");
  }
  next();
};
