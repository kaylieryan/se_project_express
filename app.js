// const express = require("express");
// const mongoose = require("mongoose");

// const { PORT = 3001 } = process.env;
// const { handleNonExistentRoute } = require("./utils/errors");

// mongoose
//   .connect("mongodb://127.0.0.1:27017/wtwr_db")
//   .then((r) => {
//     console.log("connected to DB");
//   })
//   .catch((e) => {
//     (e) => console.log("DB error", e);
//   });

// const app = express();
// app.use(express.json());

// app.use(handleNonExistentRoute);

// const routes = require("./routes");

// app.use(routes);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });

const express = require("express");

const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const { handleNonExistentRoute } = require("./utils/errors");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const app = express();
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

app.listen(PORT, () => {
  console.log("Port is running");
});
