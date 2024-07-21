const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JsonDB, Config } = require("node-json-db");
const db = new JsonDB(new Config("database/new_users", true, false, "/"));
const { v4: uuidv4 } = require("uuid");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }
  const users = await db.getData("/");
  // console.log(users);
  const user = Object.values(users).filter((user) => user.email === email)[0];
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User doesnot exists" });
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Check your credentials" });
  }
  const token = generateToken(user.id);
  res.status(200).json({
    ...user,
    password: undefined,
    token,
  });
  res.cookies("token", token, {
    httpOnly: true, //only server can manipulate the token
  });
};

const signup = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }
  const users = await db.getData("/");
  const userExists = Object.values(users).some((user) => user.email === email);
  console.log(users);
  console.log("-------");

  if (userExists) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = { id: uuidv4(), email, password: hashedPassword };
  db.push("/", { ...users, [email]: newUser });
  res
    .status(201)
    .json({ success: true, message: "User registered successfully" });
};

const private = (req, res) => {
  console.log(req.user);
  res.status(200).json(req.user);
};
module.exports = { private, login, signup };
