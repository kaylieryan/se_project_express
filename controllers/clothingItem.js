const ClothingItem = require("../models/clothingItem");
const {
  serverError,
  invalidData,
  notFound,
  forbiddenError,
} = require("../utils/errors");

function getClothingItems(req, res, next) {
  console.log("getting clothing items.");
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      next(err);
    });
}

const createClothingItem = (req, res, next) => {
  console.log("creating clothing item.");
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(invalidData("Invalid data"));
      }
      next(err);
    });
};

//   if (err.name === "ValidationError") {
//     return res
//       .status(invalidData)
//       .send({ message: `this data is not valid` });
//   }
//   if (err.name === "CastError") {
//     return res.status(invalidData).send({ message: "Invalid ID format" });
//   }
//   return res
//     .status(serverError)
//     .send({ message: `There has been a server error` });
// });

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((clothingItem) => {
      if (String(clothingItem.owner) !== req.user._id) {
        return res.status(forbiddenError).send({ message: "Forbidden" });
      }
      ClothingItem.findByIdAndDelete(clothingItem._id).then(() =>
        res.status(200).send({ message: "item was deleted successfully" })
      );
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Document not found" });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }
      next(err);
    });
};

const likeClothingItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((clothingItem) => {
      res.send({ data: clothingItem });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(invalidData)
          .send({ message: `this data is not valid` });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Document not found" });
      }
      return res
        .status(serverError)
        .send({ message: `There has been a server error` });
    });
};

const unlikeClothingItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((clothingItem) => {
      res.send({ data: clothingItem });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Document not found" });
      }
      return res
        .status(serverError)
        .send({ message: `There has been a server error: ${err.message} ` });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
};
