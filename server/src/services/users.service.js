const jwt = require("jsonwebtoken");
const config = require("../config");
const usersDao = require("../dao/users.dao");
const { getToken, getRefreshToken } = require("../utils/authenticate.utils");

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
    const token = getToken({ _id: id });
    const refreshToken = getRefreshToken({ _id: id });

    const user = await usersDao.getOne(id);

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
    const userId = payload._id;

    const user = await usersDao.getOne(userId);

    const tokenIndex = user.refreshToken.findIndex((item) => item.refreshToken === refreshToken);

    const token = getToken({ _id: userId });
    const newRefreshToken = getRefreshToken({ _id: userId });
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

module.exports = { loginUser, refreshTokenUser, logoutUser, createUser };
