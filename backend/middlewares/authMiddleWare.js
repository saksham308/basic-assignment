const { JsonDB, Config } = require("node-json-db");
const db = new JsonDB(new Config("database/new_users", true, false, "/"));
const jwt = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {
  const token = req.headers.cookie;
  console.log(token);
  if (!token) {
    return res
      .status(400)
      .json({ message: "you are not loggedin", success: false });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const users = await db.getData("/");
    const user = Object.values(users).filter(
      (user) => user.id === decodedToken.id
    )[0];
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ message: "invalid token", success: false });
  }
};
module.exports = authMiddleware;
