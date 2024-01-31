const router = require("express").Router();
const userAuth = require("../middlewares/auth");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItem");

router.get("/", getClothingItems);

router.use(userAuth);

router.post("/", userAuth, createClothingItem);
router.put("/:itemId/likes", userAuth, likeClothingItem);
router.delete("/:itemId", userAuth, deleteClothingItem);
router.delete("/:itemId/likes", userAuth, unlikeClothingItem);

module.exports = router;
