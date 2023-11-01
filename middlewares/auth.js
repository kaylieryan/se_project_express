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
  } catch {
    return res.status(authError).send({ message: "authorization required" });
  }

  req.user = payload;

  return next();
};

// const jwt = require("jsonwebtoken");

// const { JWT_SECRET } = require("../utils/config");
// const { UNAUTHORIZED } = require("../utils/errors");

// const auth = (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith("Bearer ")) {
//     return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
//   }

//   const token = authorization.replace("Bearer ", "");

//   try {
//     const payload = jwt.verify(token, JWT_SECRET);
//     req.user = payload;
//     next();
//   } catch (err) {
//     return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
//   }
// };

// module.exports = auth;
