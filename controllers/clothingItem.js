const ClothingItem = require("../models/clothingItem");
const { BadRequestError } = require("../utils/errors");
const { ForbiddenError } = require("../utils/errors");
const { NotFoundError } = require("../utils/errors");

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
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

//   if (!name || !weather || !imageUrl) {
//     return res.status(invalidData).send({ message: "Invalid data" });
//   }

//   if (typeof name !== "string" || typeof weather !== "string") {
//     return res.status(invalidData).send({ message: "Invalid data" });
//   }

//   return ClothingItem.create({ name, weather, imageUrl, owner })
//     .then((item) => {
//       res.status(200).send({ data: item });
//     })
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         next({ status: invalidData, message: "Invalid data" });
//       }
//       next(err);
//     });
// };

const deleteClothingItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== String(userId) && !req.user.isAdmin) {
        throw new ForbiddenError("Forbidden Access");
      }
      ClothingItem.findByIdAndDelete(itemId).then(() => {
        res.status(200).send({ message: "Item deleted" });
      });
    })
    .catch((err) => {
      if (err.name === `DocumentNotFoundError`) {
        next(new NotFoundError("Item not found"));
      }
      if (err.name === `CastError`) {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

//   return ClothingItem.findById(itemId)
//     .then((item) => {
//       if (!item) {
//         return next({ status: notFound, message: "Item not found" });
//       }
//       if (!item.owner.equals(userId)) {
//         return next({ status: forbiddenError, message: "Unauthorized" });
//       }
//       return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
//         res.send({ data: deletedItem });
//       });
//     })
//     .catch((err) => {
//       if (err.name === "CastError") {
//         return next({ status: invalidData, message: "Invalid ID" });
//       }
//       return next({ status: serverError, message: "Server error" });
//     });
// };

const likeClothingItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((clothingItem) => {
      res.status(200).send({ data: clothingItem });
      // res.send({ data: clothingItem });
    })
    .catch((err) => {
      if (err.name === `DocumentNotFoundError`) {
        next(new NotFoundError());
      }
      if (err.name === `CastError`) {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};
//       if (err.name === "ValidationError") {
//         return res
//           .status(invalidData)
//           .send({ message: `this data is not valid` });
//       }
//       if (err.name === "CastError") {
//         return res.status(invalidData).send({ message: "Invalid ID" });
//       }
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(notFound).send({ message: "Document not found" });
//       }
//       return res
//         .status(serverError)
//         .send({ message: `There has been a server error` });
//     });
// };

const unlikeClothingItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((clothingItem) => {
      res.status(200).send({ data: clothingItem });
      // res.send({ data: clothingItem });
    })
    .catch((err) => {
      if (err.name === `DocumentNotFoundError`) {
        next(new NotFoundError());
      }
      if (err.name === `CastError`) {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};
//       if (err.name === "CastError") {
//         return res.status(invalidData).send({ message: "Invalid ID" });
//       }
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(notFound).send({ message: "Document not found" });
//       }
//       return res
//         .status(serverError)
//         .send({ message: `There has been a server error: ${err.message} ` });
//     });
// };

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
};
