const router = require("express").Router();
const userAuth = require("../middlewares/auth");
const { validateUpdateUser } = require("../middlewares/validation");

const { getCurrentUser, editCurrentUser } = require("../controllers/user");

router.get("/me", userAuth, getCurrentUser);

router.patch("/me", userAuth, validateUpdateUser, editCurrentUser);

module.exports = router;
