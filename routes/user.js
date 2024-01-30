const router = require("express").Router();
const {
  getCurrentUser,
  editCurrentUser,
  createUser,
} = require("../controllers/user");
const userAuth = require("../middlewares/auth");

router.get("/me", userAuth, getCurrentUser);

router.patch("/me", userAuth, editCurrentUser);

router.post("/", userAuth, createUser);

module.exports = router;
