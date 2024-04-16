// module.exports = {
//   env: {
//     browser: true,
//     commonjs: true,
//     es2021: true,
//   },
//   extends: ["airbnb-base", "eslint:recommended", "prettier"],
//   overrides: [
//     {
//       env: {
//         node: true,
//       },
//       files: [".eslintrc.{js,cjs}"],
//       parserOptions: {
//         sourceType: "script",
//       },
//     },
//   ],
//   parserOptions: {
//     ecmaVersion: "latest",
//   },
//   rules: {
//     "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
//     "no-underscore-dangle": ["error", { allow: ["_id"] }],
//     "import/no-extraneous-dependencies": [
//       "error",
//       {
//         devDependencies: true,
//         optionalDependencies: false,
//         peerDependencies: false,
//       },
//     ],
//   },
// };
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
  },
};