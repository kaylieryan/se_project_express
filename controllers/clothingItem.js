// const ClothingItem = require("../models/clothingItem");

// const createItem = (req, res) => {
//   console.log(req);
//   console.log(req.body);

//   const { name, weather, imageURL } = req.body;

//   ClothingItem.create({ name, weather, imageURL })
//     .then((item) => {
//       console.log(item);
//       res.send({ data: item });
//     })
//     .catch((e) => {
//       res.status(500).send({ message: "Error from createItem", e });
//     });
// };
// const getItems = (req, res) => {
//   ClothingItem.find({})
//     .then((items) => res.status(200).send(items))
//     .catch((e) => {
//       res.status(500).send({ message: "Error From Get Items", e });
//     });
// };

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageURL } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((e) => {
//       res.status(500).send({ message: "Error from updateItem", e });
//     });
// };

// const deleteItem = (req, res) => {
//   const { itemId } = req.params;
//   console.log(itemId);

//   ClothingItem.findByIdAndDelete(itemId)
//     .orFail()
//     .then((item) => res.status(204).send({}))
//     .catch((e) => {
//       res.status(500).send({ message: "Error from deleteItem", e });
//     });
// };
// module.exports = { createItem, getItems, updateItem, deleteItem };

const ClothingItem = require("../models/clothingItem");
const { serverError, invalidData, notFound } = require("../utils/errors");

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .populate("owner")
    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch(() =>
      res.status(serverError).send({ message: `There has been a server error` })
    );
};

module.exports.createClothingItem = (req, res) => {
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

module.exports.deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.send({ message: `item was deleted successfully` }))
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

module.exports.likeClothingItem = (req, res) => {
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

module.exports.unlikeClothingItem = (req, res) => {
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
