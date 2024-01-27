const router = require("express").Router();
//const userAuth = require("../middlewares/auth");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItem");

router.post("/", createClothingItem);
router.get("/", getClothingItems);
router.put("/:itemId/likes", likeClothingItem);
router.delete("/:itemId", deleteClothingItem);
router.delete("/:itemId/likes", unlikeClothingItem);

module.exports = router;
