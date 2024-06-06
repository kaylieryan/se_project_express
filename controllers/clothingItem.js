const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../utils/BadRequestError");
const ForbiddenError = require("../utils/ForbiddenError");
const NotFoundError = require("../utils/NotFoundError");

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

const deleteClothingItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== String(userId)) {
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

const likeClothingItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((clothingItem) => {
      res.status(200).send({ data: clothingItem });
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

const unlikeClothingItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((clothingItem) => {
      res.status(200).send({ data: clothingItem });
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

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
};
