const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  serverError,
  invalidData,
  notFound,
  authError,
  conflictError,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() =>
      res
        .status(serverError)
        .send({ message: `There has been a server error ` })
    );
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
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

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return Promise.reject(new Error("email already exists"));
      }
      return bcrypt.hash(password, 10);
    })
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

      return res.send({ data: updatedUser });
    })

    .catch((err) => {
      if (err.code === 11000 || err.message === "email already exists") {
        return res
          .status(conflictError)
          .send({ message: "email already exists" });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }

      if (err.name === "ValidationError" || err.message === "data not valid") {
        return res.status(invalidData).send({ message: `data not valid` });
      }
      return res
        .status(serverError)
        .send({ message: `There has been a server error ` });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "incorrect email or password") {
        return res
          .status(authError)
          .send({ message: "incorrect email or password" });
      }
      return res
        .status(serverError)
        .send({ message: `There has been a server error ` });
    });
};

module.exports.getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findOne({ _id })
    .then((user) => {
      if (!user) {
        return res.status(notFound).send({ message: "user not found" });
      }
      return res.send({ data: user });
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
        .send({ message: `There has been a server error ` });
    });
};

module.exports.editCurrentUser = (req, res) => {
  const { avatar, name } = req.body;
  const { _id } = req.user;

  User.findOneAndUpdate(
    { _id },
    { avatar, name },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(notFound).send({ message: "user not found" });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: `data not valid` });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Document not found" });
      }
      return res.status(serverError).send({ message: "server error" });
    });
};
// const createUser = async (req, res) => {
//   const { name, email, password, avatar } = req.body;

//   // Check if user with email already exists
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return res.status(400).json({ message: "Email already in use" });
//   }

//   // Hash password
//   const salt = await bcrypt.genSalt();
//   const hashedPassword = await bcrypt.hash(password, salt);

//   const user = new User({
//     name,
//     email,
//     password: hashedPassword,
//     avatar,
//   });

//   try {
//     const newUser = await user.save();
//     res.status(201).json(newUser);
//   } catch (err) {
//     if (err.code === 11000) {
//       res.status(400).json({ message: "Email already in use" });
//     } else {
//       res.status(500).json({ message: `There has been a server error` });
//     }
//   }
// };

// const getUsers = (req, res) => {
//   User.find({})
//     .then((user) => res.send({ data: user }))
//     .catch(() =>
//       res
//         .status(serverError)
//         .send({ message: `There has been a server error ` })
//     );
// };

// const getUserById = (req, res) => {
//   User.findById(req.params.userId)
//     .orFail()
//     .then((user) => res.send({ data: user }))
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         return res.status(invalidData).send({ message: `data not valid` });
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

// const getCurrentUser = (req, res) => {
//   const { _id } = req.user;

//   User.findOne({ _id })
//     .then((user) => {
//       if (!user) {
//         return res.status(notFound).send({ message: "user not found" });
//       }
//       return res.send({ data: user });
//     })
//     .catch((err) => {
//       if (err.name === "CastError") {
//         return res.status(invalidData).send({ message: "Invalid ID" });
//       }
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(notFound).send({ message: "Document not found" });
//       }
//       return res
//         .status(serverError)
//         .send({ message: `There has been a server error ` });
//     });
// };

// const updateProfile = (req, res) => {
//   const { avatar, name } = req.body;
//   const { _id } = req.user;

//   User.findOneAndUpdate(
//     { _id },
//     { avatar, name },
//     { new: true, runValidators: true }
//   )
//     .then((user) => {
//       if (!user) {
//         return res.status(notFound).send({ message: "user not found" });
//       }
//       return res.send({ data: user });
//     })
//     .catch((err) => {
//       if (err.name === "ValidationError") {
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

// const login = (req, res) => {
//   const { email, password } = req.body;

//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
//         expiresIn: "7d",
//       });
//       res.send({ token });
//     })
//     .catch((err) => {
//       if (err.message === "incorrect email or password") {
//         return res
//           .status(authError)
//           .send({ message: "incorrect email or password" });
//       }
//       return res
//         .status(serverError)
//         .send({ message: `There has been a server error ` });
//     });
// };

// // const login = async (req, res) => {
// //   const { email, password } = req.body;

// //   // Find user by email
// //   const user = await User.findUserByCredentials(email, password);

// //   if (!user) {
// //     return res.status(401).json({ message: "Invalid credentials" });
// //   }

//   // Create JWT
// //   const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
// //     expiresIn: "7d",
// //   });

// //   res.json({ token });
// // };

// // const updateProfile = (req, res) => {
// //   const { name, avatar } = req.body;
// //   const { _id } = req.user._id;

// //   User.findByIdAndUpdate(
// //     { _id },
// //     { $set: { name, avatar } },
// //     { new: true, runValidators: true }
// //   )
// //   .orFail()
// //   .then((user) => res.send({ data: user }))
// //   .catch((err) => {
// //     console.error(err);
// //     if (err.name === "ValidationError") {
// //       return res.status(invalidData).send({ message: `data not valid` });
// //     }

// module.exports = {
//   createUser,
//   getUsers,
//   getUserById,
//   login,
//   getCurrentUser,
//   updateProfile
// };
