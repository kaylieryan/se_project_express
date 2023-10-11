// const router = require("express").Router();

// const {
//   createItem,
//   getItems,
//   updateItem,
//   deleteItem
// } = require("../controllers/clothingItem");

// //CRUD

// //CREATE
// router.post("/", createItem);

// //READ
// router.get("/", getItems);

// //UPDATE

// router.put("/:itemId", updateItem);

// //DELETE

// router.delete("/:itemId", deleteItem);

// module.exports = router;

const router = require("express").Router();

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItem");

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.delete("/:itemId", deleteClothingItem);
router.put("/:itemId/likes", likeClothingItem);
router.delete("/:itemId/likes", unlikeClothingItem);

module.exports = router;
