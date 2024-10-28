import express from "express";
import passport from "passport";

import {
  confirmUser,
  createUser,
  forgotPassword,
  getCurrentUser,
  getUsers,
  loginUser,
  logoutUser,
  refreshTokenUser,
  resetPassword,
  sudo,
  supportUser,
  supportUserPublic,
  updateUser,
} from "../controllers/users.controller";
import { hasPermissionToEditUser } from "../middlewares/hasPermissionToEditUser";
import { isAdmin } from "../middlewares/isAdmin";
import { rateLimiter } from "../middlewares/rateLimiter";
import { validator } from "../middlewares/validatorMiddleware";
import { verifyUser } from "../middlewares/verifyUserMiddleware";
import {
  confirmSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  subscribeSchema,
  supportPublicSchema,
  supportSchema,
  updateSchema,
} from "../validators/users.validators";

export const users = () => {
  const router = express.Router();

  router.post("/api/users/", rateLimiter, validator(subscribeSchema), async (req, res, next) =>
    createUser(req, res, next)
  );

  router.post(
    "/api/users/login/",
    rateLimiter,
    validator(loginSchema),
    passport.authenticate("local", { session: false }),
    async (req, res, next) => loginUser(req, res, next)
  );

  router.get("/api/users/sudo/:id", rateLimiter, verifyUser, isAdmin, async (req, res, next) => sudo(req, res, next));

  router.post("/api/users/refreshToken/", async (req, res, next) => refreshTokenUser(req, res, next));

  router.get("/api/users/me/", verifyUser, async (req, res, next) => getCurrentUser(req, res, next));

  router.get("/api/users/logout/", verifyUser, async (req, res, next) => logoutUser(req, res, next));

  router.get("/api/users/", verifyUser, isAdmin, async (req, res, next) => getUsers(req, res, next));

  router.put("/api/users/:id", verifyUser, hasPermissionToEditUser, validator(updateSchema), async (req, res, next) =>
    updateUser(req, res, next)
  );

  router.post("/api/users/forgot-password/", rateLimiter, validator(forgotPasswordSchema), async (req, res, next) =>
    forgotPassword(req, res, next)
  );

  router.post("/api/users/reset-password/", rateLimiter, validator(resetPasswordSchema), async (req, res, next) =>
    resetPassword(req, res, next)
  );

  router.post("/api/users/confirm/", rateLimiter, validator(confirmSchema), async (req, res, next) =>
    confirmUser(req, res, next)
  );

  router.post("/api/users/support/public", rateLimiter, validator(supportPublicSchema), async (req, res, next) =>
    supportUserPublic(req, res, next)
  );

  router.post("/api/users/support/", verifyUser, rateLimiter, validator(supportSchema), async (req, res, next) =>
    supportUser(req, res, next)
  );

  return router;
};
