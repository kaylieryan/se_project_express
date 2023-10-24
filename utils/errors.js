const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const DUPLICATE = 409;
const DEFAULT_ERROR = 500;

function handleNonExistentRoute(req, res) {
  res.status(404).send({
    message: "Requested resource not found",
  });
}

module.exports = {
  handleNonExistentRoute,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  DEFAULT_ERROR,
  DUPLICATE,
};
