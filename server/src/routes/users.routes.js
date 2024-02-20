const express = require("express");
const validator = require("../middlewares/validatorMiddleware");
const { verifyUser } = require("../middlewares/verifyUserMiddleware");
const { hasPermissionToEditUser } = require("../middlewares/hasPermissionToEditUser");
const {
  loginSchema,
  subscribeSchema,
  updateSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  confirmSchema,
  supportSchema,
  supportPublicSchema,
} = require("../validators/users.validators");
const {
  loginUser,
  refreshTokenUser,
  getCurrentUser,
  logoutUser,
  createUser,
  getUsers,
  updateUser,
  forgotPassword,
  resetPassword,
  confirmUser,
  supportUser,
  supportUserPublic,
} = require("../controllers/users.controller");
const { isAdmin } = require("../middlewares/isAdmin");
const { rateLimiter } = require("../middlewares/rateLimiter");

const users = () => {
  const router = express.Router();

  router.post("/api/users/", rateLimiter, validator(subscribeSchema), (req, res, next) => createUser(req, res, next));

  router.post("/api/users/login/", rateLimiter, validator(loginSchema), verifyUser, (req, res, next) =>
    loginUser(req, res, next)
  );

  router.post("/api/users/refreshToken/", (req, res, next) => refreshTokenUser(req, res, next));

  router.get("/api/users/me/", verifyUser, (req, res, next) => getCurrentUser(req, res, next));

  router.get("/api/users/logout/", verifyUser, (req, res, next) => logoutUser(req, res, next));

  router.get("/api/users/", verifyUser, isAdmin, (req, res, next) => getUsers(req, res, next));

  router.put("/api/users/:id", verifyUser, hasPermissionToEditUser, validator(updateSchema), (req, res, next) =>
    updateUser(req, res, next)
  );

  router.post("/api/users/forgot-password/", rateLimiter, validator(forgotPasswordSchema), (req, res, next) =>
    forgotPassword(req, res, next)
  );

  router.post("/api/users/reset-password/", rateLimiter, validator(resetPasswordSchema), (req, res, next) =>
    resetPassword(req, res, next)
  );

  router.post("/api/users/confirm/", rateLimiter, validator(confirmSchema), (req, res, next) =>
    confirmUser(req, res, next)
  );

  router.post("/api/users/support/public", rateLimiter, validator(supportPublicSchema), (req, res, next) =>
    supportUserPublic(req, res, next)
  );

  router.post("/api/users/support/", verifyUser, rateLimiter, validator(supportSchema), (req, res, next) =>
    supportUser(req, res, next)
  );

  return router;
};

module.exports = users;
