const e = require("express");
const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then((r) => {
    console.log("connected to DB");
  })
  .catch((e) => {
    (e) => console.log("DB error", e);
  });

  const routes = require("./routes");
  app.use(routes);
  app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log("This is working");
});

