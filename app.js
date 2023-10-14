const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const limiter = require("./models/middlewares/rateLimiter");

const app = express();

const { PORT = 3001 } = process.env;
const { handleNonExistentRoute } = require("./utils/errors");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "65270624aa75c0ab8f56c13a",
  };
  next();
});

app.use("/users", require("./routes/user"));
app.use("/items", require("./routes/clothingItem"));

app.use(handleNonExistentRoute);

app.use(limiter);

app.listen(PORT, () => {
  console.log("Port is running");
});
