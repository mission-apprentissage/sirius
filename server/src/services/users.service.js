const jwt = require("jsonwebtoken");
const config = require("../config");
const usersDao = require("../dao/users.dao");
const { getToken, getRefreshToken } = require("../utils/authenticate.utils");
const { ErrorMessage } = require("../errors");
const User = require("../models/user.model");

const createUser = async (user) => {
  try {
    const newUser = await usersDao.create(user);
    return { success: true, body: newUser };
  } catch (error) {
    return { success: false, body: error };
  }
};

const loginUser = async (id) => {
  try {
    const user = await usersDao.getOne(id);

    const token = getToken({
      user: {
        _id: id,
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
        _id: id,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        acceptedCgu: user.acceptedCgu,
      },
    });

    user.refreshToken.push({ refreshToken });

    await usersDao.update(id, user);

    return { success: true, body: { token, refreshToken } };
  } catch (error) {
    return { success: false, body: error };
  }
};

const sudo = async (id) => {
  try {
    const user = await usersDao.getOne(id);

    const token = getToken({
      user: {
        _id: id,
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
        _id: id,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        acceptedCgu: user.acceptedCgu,
        isSudo: true,
      },
    });

    user.refreshToken.push({ refreshToken });

    await usersDao.update(id, user);

    return { success: true, body: { token, refreshToken } };
  } catch (error) {
    return { success: false, body: error };
  }
};

const refreshTokenUser = async (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, config.auth.refreshTokenSecret);
    const userId = payload.user._id;

    const user = await usersDao.getOne(userId);

    const tokenIndex = user.refreshToken.findIndex((item) => item.refreshToken === refreshToken);

    const token = getToken({
      user: {
        _id: userId,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        acceptedCgu: user.acceptedCgu,
      },
    });
    const newRefreshToken = getRefreshToken({
      user: {
        _id: userId,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        acceptedCgu: user.acceptedCgu,
      },
    });
    user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };

    await usersDao.update(user.id, user);

    return { success: true, body: { token, newRefreshToken } };
  } catch (error) {
    return { success: false, body: error };
  }
};

const logoutUser = async (id, refreshToken) => {
  try {
    const user = await usersDao.getOne(id);
    const tokenIndex = user.refreshToken.findIndex((item) => item.refreshToken === refreshToken);

    if (tokenIndex !== -1) {
      user.refreshToken.splice(tokenIndex, 1);
    }

    await usersDao.update(id, user);

    return { success: true, body: {} };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getUsers = async () => {
  try {
    const users = await usersDao.getAll();
    return { success: true, body: users };
  } catch (error) {
    return { success: false, body: error };
  }
};

const updateUser = async (id, user) => {
  try {
    const updatedUser = await usersDao.update(id, user);
    return { success: true, body: updatedUser };
  } catch (error) {
    return { success: false, body: error };
  }
};

const forgotPassword = async (email) => {
  try {
    const user = await usersDao.getOneByEmail(email);

    if (!user) {
      return { success: false, body: ErrorMessage.UserNotFound };
    }
    return { success: true, body: user };
  } catch (error) {
    return { success: false, body: error };
  }
};

const resetPassword = async (token, password) => {
  try {
    const decryptedToken = jwt.verify(token, config.auth.jwtSecret);

    const user = await User.findByUsername(decryptedToken.email);

    if (!user) {
      return { success: false, body: ErrorMessage.UserNotFound };
    }

    const updatedUser = user?.setPassword(password, async () => {
      return user.save();
    });

    return { success: true, body: updatedUser };
  } catch (error) {
    return { success: false, body: error };
  }
};

const confirmUser = async (token) => {
  try {
    const decryptedToken = jwt.verify(token, config.auth.jwtSecret);

    const user = await User.findByUsername(decryptedToken.email);

    user.emailConfirmed = true;

    const updatedUser = await usersDao.update(user.id, user);

    return { success: true, body: updatedUser };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getUserById = async (id) => {
  try {
    const user = await usersDao.getOne(id);
    return { success: true, body: user };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = {
  loginUser,
  refreshTokenUser,
  logoutUser,
  createUser,
  getUsers,
  updateUser,
  forgotPassword,
  resetPassword,
  confirmUser,
  getUserById,
  sudo,
};
