const express = require("express");
const validator = require("../middlewares/validatorMiddleware");
const { verifyUser } = require("../middlewares/verifyUserMiddleware");
const { hasPermissionToEditUser } = require("../middlewares/hasPermissionToEditUser");
const { loginSchema, subscribeSchema, updateSchema } = require("../validators/users.validators");
const {
  loginUser,
  refreshTokenUser,
  getCurrentUser,
  logoutUser,
  createUser,
  getUsers,
  updateUser,
} = require("../controllers/users.controller");

const users = () => {
  const router = express.Router();

  router.post("/api/users/", validator(subscribeSchema), (req, res, next) => createUser(req, res, next));

  router.post("/api/users/login/", validator(loginSchema), verifyUser, (req, res, next) => loginUser(req, res, next));

  router.post("/api/users/refreshToken/", (req, res, next) => refreshTokenUser(req, res, next));

  router.get("/api/users/me/", verifyUser, (req, res, next) => getCurrentUser(req, res, next));

  router.get("/api/users/logout/", verifyUser, (req, res, next) => logoutUser(req, res, next));

  router.get("/api/users/", verifyUser, (req, res, next) => getUsers(req, res, next));

  router.put("/api/users/:id", verifyUser, hasPermissionToEditUser, validator(updateSchema), (req, res, next) =>
    updateUser(req, res, next)
  );

  return router;
};

module.exports = users;
