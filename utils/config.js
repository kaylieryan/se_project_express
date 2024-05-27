// const JWT_SECRET = "SecretPassword123";

// module.exports = { JWT_SECRET };

const { JWT_SECRET = "SecretPassword123" } = process.env;

module.exports = { JWT_SECRET, };