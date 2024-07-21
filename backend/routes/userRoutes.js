const express = require("express");
const { login, signup, private } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleWare");
const router = express.Router();
router
  .post("/login", login)
  .post("/signup", signup)
  .get("/private", authMiddleware, private);

module.exports = router;
