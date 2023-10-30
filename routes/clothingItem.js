const router = require("express").Router();

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItem");

const auth = require("../middlewares/auth");

router.post("/", auth, createClothingItem);
router.get("/", getClothingItems);
router.put("/:itemId/likes", auth, likeClothingItem);
router.delete("/:itemId", auth, deleteClothingItem);
router.delete("/:itemId/likes", auth, unlikeClothingItem);

module.exports = router;
