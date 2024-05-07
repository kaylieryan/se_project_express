const router = require("express").Router();
const clothingItemRoutes = require("./clothingItem");
const userRoutes = require("./user");
const { login, createUser } = require("../controllers/user");
const { validateNewUser, validateLogin } = require("../middlewares/validation");
const NotFoundError = require("../utils/NotFoundError");

router.use("/items", clothingItemRoutes);
router.use("/users", userRoutes);

router.post("/signin", validateLogin, login);
router.post("/signup", validateNewUser, createUser);

router.use((req, res, next) => {
  console.log(res);

  return next(
    new NotFoundError("The request was sent to a non-existent address")
  );
});

module.exports = router;
