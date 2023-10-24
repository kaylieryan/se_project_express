const router = require("express").Router();
const auth = require("../middlewares/auth");

router.get("/me", auth);
router.patch("/me", auth);

module.exports = router;
