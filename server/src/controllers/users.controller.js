const usersService = require("../services/users.service");
const { BasicError, UnauthorizedError } = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");
const { COOKIE_OPTIONS } = require("../utils/authenticate.utils");

const loginUser = tryCatch(async (req, res) => {
  const { success, body } = await usersService.loginUser(req.user._id);

  if (!success) throw new BasicError();

  res.cookie("refreshToken", body.refreshToken, COOKIE_OPTIONS);
  res.json({ success: true, token: body.token });
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
  res.json({ success: true, token: body.token });
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
  res.send({ success: true });
});

module.exports = { loginUser, refreshTokenUser, getCurrentUser, logoutUser };
