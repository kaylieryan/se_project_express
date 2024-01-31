const router = require("express").Router();
const userAuth = require("../middlewares/auth");

const {
  getCurrentUser,
  editCurrentUser,
  createUser,
} = require("../controllers/user");

router.get("/me", userAuth, getCurrentUser);

router.patch("/me", userAuth, editCurrentUser);

router.post("/", userAuth, createUser);

module.exports = router;
