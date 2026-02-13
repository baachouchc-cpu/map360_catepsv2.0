const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/users.model");

const login = async (req, res) => {
  const { name, password } = req.body;

  const user = await Users.getUserByName(name);
  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  const ok = await bcrypt.compare(password, user.pass_user);
  if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

  const token = jwt.sign(
    { id: user.id_user, role: user.rol_id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax"
  });

  res.json({ message: "Login correcto", user: {
      username: user.name_user,
      role: user.rol_id
    } });
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout OK" });
};

module.exports = { login, logout };
