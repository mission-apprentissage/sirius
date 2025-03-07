import jwt from "jsonwebtoken";

import config from "../config";
import * as usersDao from "../dao/users.dao";
import { ErrorMessage } from "../errors";
import { generateSalt, hashPassword } from "../modules/authStrategies/auth.helpers";
import type { User, UserCreation } from "../types";
import { getRefreshToken, getToken } from "../utils/authenticate.utils";

export const createUser = async (user: UserCreation) => {
  try {
    const salt = generateSalt();
    const hash = hashPassword(user.password, salt);

    const newUser = await usersDao.create({ ...user, salt, hash });

    return { success: true, body: newUser };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const loginUser = async (id: string) => {
  try {
    const user = await usersDao.findOneById(id);

    if (!user) {
      return { success: false, body: ErrorMessage.UserNotFound };
    }

    const token = getToken({
      user: {
        id,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        acceptedCgu: user.acceptedCgu,
      },
    });
    const refreshToken = getRefreshToken({
      user: {
        id,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        acceptedCgu: user.acceptedCgu,
      },
    });

    if (Array.isArray(user.refreshToken) && user.refreshToken.length) {
      user.refreshToken.push({ refreshToken: refreshToken });
      user.refreshToken = JSON.stringify(user.refreshToken);
    } else {
      user.refreshToken = JSON.stringify([{ refreshToken }]);
    }

    await usersDao.update(id, user);

    return { success: true, body: { token, refreshToken } };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const sudo = async (id: string) => {
  try {
    const user = await usersDao.findOneById(id);

    if (!user) {
      return { success: false, body: ErrorMessage.UserNotFound };
    }

    const token = getToken({
      user: {
        id,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        acceptedCgu: user.acceptedCgu,
        isSudo: true,
      },
    });
    const refreshToken = getRefreshToken({
      user: {
        id,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        acceptedCgu: user.acceptedCgu,
        isSudo: true,
      },
    });

    if (Array.isArray(user.refreshToken) && user.refreshToken.length) {
      user.refreshToken.push({ refreshToken: refreshToken });
      user.refreshToken = JSON.stringify(user.refreshToken);
    } else {
      user.refreshToken = JSON.stringify([{ refreshToken }]);
    }

    await usersDao.update(id, user);

    return { success: true, body: { token, refreshToken } };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const refreshTokenUser = async (refreshToken: string) => {
  try {
    const payload = jwt.verify(refreshToken, config.auth.refreshTokenSecret);

    if (typeof payload === "string") {
      throw new Error("Invalid token payload");
    }

    const userId = payload.user.id;

    const user = await usersDao.findOneById(userId);

    if (!user) {
      return { success: false, body: ErrorMessage.UserNotFound };
    }

    const tokenIndex = Array.isArray(user.refreshToken)
      ? user.refreshToken?.findIndex((item) => item === refreshToken)
      : -1;

    const token = getToken({
      user: {
        id: userId,
        role: user?.role,
        status: user?.status,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        acceptedCgu: user?.acceptedCgu,
      },
    });
    const newRefreshToken = getRefreshToken({
      user: {
        id: userId,
        role: user?.role,
        status: user?.status,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        acceptedCgu: user?.acceptedCgu,
      },
    });
    (user.refreshToken as { _id?: string; refreshToken: string }[])[tokenIndex] = { refreshToken: newRefreshToken };
    user.refreshToken = JSON.stringify(user.refreshToken);

    await usersDao.update(user.id, user);

    return { success: true, body: { token, newRefreshToken } };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const logoutUser = async (id: string, refreshToken: string) => {
  try {
    const user = await usersDao.findOneById(id);

    if (!user) {
      return { success: false, body: ErrorMessage.UserNotFound };
    }

    const tokenIndex = (user.refreshToken as { _id?: string; refreshToken: string }[])?.findIndex(
      (item) => item.refreshToken === refreshToken
    );

    if (tokenIndex !== -1) {
      (user.refreshToken as { _id?: string; refreshToken: string }[]).splice(tokenIndex, 1);
    }

    user.refreshToken = JSON.stringify(user.refreshToken);

    await usersDao.update(id, user);

    return { success: true, body: {} };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getUsers = async () => {
  try {
    const users = await usersDao.findAllWithEtablissement();
    return { success: true, body: users };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const updateUser = async (id: string, user: Partial<Omit<User, "id" | "email" | "createdAt">>) => {
  try {
    const updatedUser = await usersDao.update(id, user);
    return { success: true, body: updatedUser };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const user = await usersDao.findOneByEmail(email);

    if (!user) {
      return { success: false, body: ErrorMessage.UserNotFound };
    }
    return { success: true, body: user };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const decryptedToken = jwt.verify(token, config.auth.jwtSecret);

    if (typeof decryptedToken === "string") {
      throw new Error("Invalid token payload");
    }

    const user = await usersDao.findOneByEmail(decryptedToken.email);

    if (!user) {
      return { success: false, body: ErrorMessage.UserNotFound };
    }

    const newHashedPassword = await hashPassword(password, user.salt);

    const updatedUser = await usersDao.update(user.id, { hash: newHashedPassword });

    return { success: true, body: updatedUser };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const confirmUser = async (token: string) => {
  try {
    const decryptedToken = jwt.verify(token, config.auth.jwtSecret);

    if (typeof decryptedToken === "string") {
      throw new Error("Invalid token payload");
    }

    const user = await usersDao.findOneByEmail(decryptedToken.email);

    if (!user) {
      return { success: false, body: ErrorMessage.UserNotFound };
    }

    user.refreshToken = JSON.stringify(user.refreshToken);
    user.emailConfirmed = true;

    const updatedUser = await usersDao.update(user.id, user);

    return { success: true, body: updatedUser };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await usersDao.findOneById(id);
    return { success: true, body: user };
  } catch (error) {
    return { success: false, body: error };
  }
};
