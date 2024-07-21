const express = require("express");
const app = express();
var cookieParser = require("cookie-parser");

require("dotenv").config();

const authRoutes = require("./routes/userRoutes");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
