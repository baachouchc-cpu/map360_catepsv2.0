const db = require("../services/db");

const getUserByName = async (name) => {
  const { rows } = await db.query(
    "SELECT * FROM users WHERE name_user = $1",
    [name]
  );
  return rows[0];
};

module.exports = {
  getUserByName
};
