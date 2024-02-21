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
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(authError).send({ message: "authorization required" });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(authError).send({ message: "authorization required" });
  }

  req.user = payload;
  return next();
};
