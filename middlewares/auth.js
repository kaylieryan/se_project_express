// const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../utils/config");
// const { AUTHORIZATION_ERROR } = require("../utils/errors");

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;
//   if (!authorization || !authorization.startsWith("Bearer ")) {
//     return res
//       .status(AUTHORIZATION_ERROR)
//       .send({ message: "authorization required" });
//   }

//   const token = authorization.replace("Bearer ", "");
//   let payload;
//   try {
//     payload = jwt.verify(token, JWT_SECRET);
//   } catch (err) {
//     return res
//       .status(AUTHORIZATION_ERROR)
//       .send({ message: "authorization required" });
//   }

//   req.user = payload;

//   return next();
// };

const jwt = require("jsonwebtoken");
const { authError } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  console.log("auth middleware");
  // log the endpoint being called
  console.log(req.originalUrl);
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("auth error due to no auth");
    return res.status(authError).send({ message: "authorization required" });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    console.log("verifying token");
    payload = jwt.verify(token, JWT_SECRET);
    console.log("verified token");
  } catch (err) {
    console.log("auth error due to invalid token");
    // console.log(err);
    return res.status(authError).send({ message: "authorization required" });
  }

  req.user = payload;
  return next();
};
