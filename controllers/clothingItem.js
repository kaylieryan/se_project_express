const ClothingItem = require("../models/clothingItem");
const {
  serverError,
  invalidData,
  notFound,
  forbiddenError,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  console.log("Getting clothing items.");
  ClothingItem.find({})
    .populate("owner")
    .then((clothingItem) => {
      console.log("Got clothing item.");
      console.log(clothingItem);
      res.send({ data: clothingItem });
    })
    .catch(() =>
      res.status(serverError).send({ message: `There has been a server error` })
    );
};

const createClothingItem = (req, res) => {
  console.log("creating clothing item.");
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(invalidData)
          .send({ message: `this data is not valid` });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID format" });
      }
      return res
        .status(serverError)
        .send({ message: `There has been a server error` });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  const { _id } = req.user;

  ClothingItem.findById(itemId)
    .orFail()
    .then((clothingItem) => {
      if (clothingItem.owner.toString() !== _id.toString()) {
        return res.status(forbiddenError).send({ message: "permission error" });
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.send({ message: "item was deleted successfully" })
      );
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Document not found" });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }
      return res
        .status(serverError)
        .send({ message: `There has been a server error ` });
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
