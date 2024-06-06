const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../utils/UnauthorizedError");
const { JWT_SECRET } = require("../utils/config");


module.exports = (req, res, next) => {
  console.log("auth middleware");
  // log the endpoint being called
  console.log(req.originalUrl);
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("auth error due to no auth");
    throw new UnauthorizedError("authorization required");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    console.log("verifying token");
    payload = jwt.verify(token, JWT_SECRET);
    console.log("verified token");
  } catch (err) {
    console.log("auth error due to invalid token");

    throw new UnauthorizedError("authorization required");
  }

  req.user = payload;
  return next();
};
