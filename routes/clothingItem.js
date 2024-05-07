const router = require("express").Router();
const userAuth = require("../middlewares/auth");

const {
  validateClothingItem,
  validateLikeItem,
  validateDeleteItem,
  validateDislikeItem,
} = require("../middlewares/validation");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItem");

router.get("/", getClothingItems);
router.post("/", userAuth, validateClothingItem, createClothingItem);
router.put("/:itemId/likes", userAuth, validateLikeItem, likeClothingItem);
router.delete("/:itemId", userAuth, validateDeleteItem, deleteClothingItem);
router.delete("/:itemId/likes", userAuth, validateDislikeItem, unlikeClothingItem);

module.exports = router;
