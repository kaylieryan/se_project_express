const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { ConflictError } = require("../utils/ConflictError");
const { BadRequestError } = require("../utils/BadRequestError");
const { NotFoundError } = require("../utils/NotFoundError");
const { UnauthorizedError } = require("../utils/UnauthorizedError");

// const {
//   serverError,
//   invalidData,
//   notFound,
//   authError,
//   conflictError,
// } = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
        avatar,
      })
    )
    .then((user) => {
      const updatedUser = user.toObject();
      delete updatedUser.password;
      res.status(200).send({ data: updatedUser });
      // return res.send({ data: updatedUser });
    })

    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError("email already exists"));
      } else {
        next(err);
      }
    });
};

//     .catch((err) => {
//       if (err.code === 11000 || err.message === "email already exists") {
//         return res
//           .status(conflictError)
//           .send({ message: "email already exists" });
//       }
//       if (err.name === "CastError") {
//         return res.status(invalidData).send({ message: "Invalid ID" });
//       }

//       if (err.name === "ValidationError" || err.message === "data not valid") {
//         return res.status(invalidData).send({ message: `data not valid` });
//       }
//       return res
//         .status(serverError)
//         .send({ message: `There has been a server error ` });
//     });
// };

const login = (req, res, next) => {
  console.log("Calling login");
  console.log(req.body);
  User.findUserByCredentials(req.body.email, req.body.password)
    .then((data) => {
      const token = jwt.sign({ _id: data._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === "Incorrect email or password") {
        next(new UnauthorizedError("Invalid login"));
      } else {
        next(err);
      }
    });
};
//     .catch((error) => {
//       if (error.message === "incorrect email or password") {
//         console.log(error);
//         return res.status(authError).send({ message: "Invalid login" });
//       }
//       console.log(error);
//       return res.status(serverError).send({ message: "server error" });
//     });
// };

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findOne({ _id })
    .then((user) => {
      res.send ({ data: user });
    })
    //   if (!user) {
    //     return res.status(notFound).send({ message: "user not found" });
    //   }
    //   return res.send({ data: user });
    // })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      } else {
        next(err);
      }
    });
};
//     .catch((err) => {
//       if (err.name === "DocumentNotFoundError") {
//         return next({ status: notFound, message: "Document not found" });
//       }
//       return next({ status: serverError, message: "server error" });
//     });
// };
// return res.status(notFound).send({ message: "Document not found" });
//       }
//       return res
//         .status(serverError)
//         .send({ message: `There has been a server error ` });
//     });
// };

const editCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;
  console.log("editCurrentUser controller", _id, avatar, name);

  User.findOneAndUpdate(
    { _id },
    { avatar, name },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.send({ message: "user not found" });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      } else {
        next(err);
      }
    });
};
//     .catch((err) => {
//       console.log(err);
//       if (err.name === "ValidationError") {
//         return next({ status: invalidData, message: "data not valid" });
//       }
//       if (err.name === "CastError") {
//         return next({ status: invalidData, message: "Invalid ID" });
//       }
//       if (err.name === "DocumentNotFoundError") {
//         return next({ status: notFound, message: "Document not found" });
//       }
//       return next({ status: serverError, message: "server error" });
//     });
// };
//         return res.status(invalidData).send({ message: `data not valid` });
//       }
//       if (err.name === "CastError") {
//         return res.status(invalidData).send({ message: "Invalid ID" });
//       }
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(notFound).send({ message: "Document not found" });
//       }
//       return res.status(serverError).send({ message: "server error" });
//     });
// };

module.exports = {
  createUser,
  login,
  getCurrentUser,
  editCurrentUser,
};
