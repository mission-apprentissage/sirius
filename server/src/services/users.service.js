// eslint-disable-next-line n/no-missing-require
const { generateSalt, hashPassword } = require("../modules/authStrategies/auth.helpers");

const jwt = require("jsonwebtoken");
const config = require("../config");
// eslint-disable-next-line n/no-missing-require
const usersDao = require("../dao/users.dao");
const { getToken, getRefreshToken } = require("../utils/authenticate.utils");
const { ErrorMessage } = require("../errors");

const createUser = async (user) => {
  try {
    const salt = generateSalt();
    const hash = hashPassword(user.password, salt);

    const newUser = await usersDao.create({ ...user, salt, hash });

    return { success: true, body: newUser };
  } catch (error) {
    return { success: false, body: error };
  }
};

const loginUser = async (id) => {
  try {
    const user = await usersDao.findOneById(id);

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

    if (user.refreshToken.length) {
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

const sudo = async (id) => {
  try {
    const user = await usersDao.findOneById(id);

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

    if (user.refreshToken.length) {
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

const refreshTokenUser = async (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, config.auth.refreshTokenSecret);
    const userId = payload.user.id;

    const user = await usersDao.findOneById(userId);

    const tokenIndex = user.refreshToken.findIndex((item) => item.refreshToken === refreshToken);

    const token = getToken({
      user: {
        id: userId,
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
        id: userId,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        acceptedCgu: user.acceptedCgu,
      },
    });
    user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
    user.refreshToken = JSON.stringify(user.refreshToken);

    await usersDao.update(user.id, user);

    return { success: true, body: { token, newRefreshToken } };
  } catch (error) {
    return { success: false, body: error };
  }
};

const logoutUser = async (id, refreshToken) => {
  try {
    const user = await usersDao.findOneById(id);
    const tokenIndex = user.refreshToken.findIndex((item) => item.refreshToken === refreshToken);

    if (tokenIndex !== -1) {
      user.refreshToken.splice(tokenIndex, 1);
    }

    user.refreshToken = JSON.stringify(user.refreshToken);

    await usersDao.update(id, user);

    return { success: true, body: {} };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getUsers = async () => {
  try {
    const users = await usersDao.findAllWithEtablissement();
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
    const user = await usersDao.findOneByEmail(email);

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

const confirmUser = async (token) => {
  try {
    const decryptedToken = jwt.verify(token, config.auth.jwtSecret);

    const user = await usersDao.findOneByEmail(decryptedToken.email);

    user.emailConfirmed = true;

    const updatedUser = await usersDao.update(user.id, user);

    return { success: true, body: updatedUser };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getUserById = async (id) => {
  try {
    const user = await usersDao.findOneById(id);
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
