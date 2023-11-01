const router = require("express").Router();

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItem");

const userAuth = require("../middlewares/auth");

router.post("/", userAuth, createClothingItem);
router.get("/", getClothingItems);
router.put("/:itemId/likes", userAuth, likeClothingItem);
router.delete("/:itemId", userAuth, deleteClothingItem);
router.delete("/:itemId/likes", userAuth, unlikeClothingItem);

module.exports = router;
