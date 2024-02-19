const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/UnauthorizedError");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError("authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError("authorization required"));
  }
  req.user = payload;
  return next();
};

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;
//   if (!authorization || !authorization.startsWith("Bearer ")) {
//     return res.status(authError).send({ message: "authorization required" });
//   }

//   const token = authorization.replace("Bearer ", "");
//   let payload;
//   try {
//     payload = jwt.verify(token, JWT_SECRET);
//   } catch (err) {
//     return res.status(authError).send({ message: "authorization required" });
//   }

//   req.user = payload;

//   return next();
// };
