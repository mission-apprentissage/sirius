const usersService = require("../services/users.service");
const { BasicError, UnauthorizedError, UserAlreadyExistsError } = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");
const { COOKIE_OPTIONS } = require("../utils/authenticate.utils");

const createUser = tryCatch(async (req, res) => {
  const { success, body } = await usersService.createUser(req.body);

  if (!success && body.name === "UserExistsError") throw new UserAlreadyExistsError();
  if (!success) throw new BasicError();

  res.status(201).json(body);
});

const loginUser = tryCatch(async (req, res) => {
  const { success, body } = await usersService.loginUser(req.user._id);

  if (!success) throw new BasicError();

  res.cookie("refreshToken", body.refreshToken, COOKIE_OPTIONS);
  res.status(200).json({ success: true, token: body.token });
});

const refreshTokenUser = tryCatch(async (req, res) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (!refreshToken) {
    throw new UnauthorizedError();
  }

  const { success, body } = await usersService.refreshTokenUser(refreshToken);

  if (!success) throw new BasicError();

  res.cookie("refreshToken", body.newRefreshToken, COOKIE_OPTIONS);
  res.status(200).json({ success: true, token: body.token });
});

const getCurrentUser = tryCatch(async (req, res) => {
  res.status(200).json(req.user);
});

const logoutUser = tryCatch(async (req, res) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (!refreshToken) {
    throw new UnauthorizedError();
  }

  const { success } = await usersService.logoutUser(req.user._id, refreshToken);

  if (!success) throw new BasicError();

  res.clearCookie("refreshToken", COOKIE_OPTIONS);
  res.status(200).json({ success: true });
});

const getUsers = tryCatch(async (req, res) => {
  const { success, body } = await usersService.getUsers();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

module.exports = { loginUser, refreshTokenUser, getCurrentUser, logoutUser, createUser, getUsers };
