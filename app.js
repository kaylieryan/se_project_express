const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
const { errors } = require("celebrate");
const limiter = require("./middlewares/rateLimiter");
const { errorHandler } = require("./middlewares/errorHandler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;
const app = express();

const { handleNonExistentRoute } = require("./utils/errors");

const { login, createUser } = require("./controllers/user");

app.use(cors());

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to db", r);
  },
  (e) => console.log("db error", e)
);
const routes = require("./routes");

app.use(helmet());
app.use(express.json());
app.use(requestLogger);

app.use(limiter);

app.use("/users", require("./routes/user"));

app.use("/items", require("./routes/clothingItem"));

app.post("/signin", login);
app.post("/signup", createUser);

app.use(handleNonExistentRoute);

app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Port is running");
});
