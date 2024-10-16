const jwt = require("jsonwebtoken");
const usersService = require("../services/users.service");
const etablissementsService = require("../services/etablissements.service");
const { BasicError, UnauthorizedError, ErrorMessage } = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");
const { COOKIE_OPTIONS } = require("../utils/authenticate.utils");
const mailer = require("../modules/mailer");
const config = require("../config");
const { USER_STATUS, USER_ROLES } = require("../constants");
const slack = require("../modules/slack");

const createUser = tryCatch(async (req, res) => {
  const confirmationToken = jwt.sign({ email: req.body.email }, config.auth.jwtSecret, {
    expiresIn: "1y",
  });

  const { success: successUser, body: bodyUser } = await usersService.createUser({ ...req.body, confirmationToken });
  const { success: successEtablissements } = await etablissementsService.createEtablissements(
    req.body.etablissements,
    bodyUser.id
  );

  if (!successUser && !successEtablissements) throw new BasicError();

  await mailer.shootTemplate({
    template: "confirm_user",
    subject: "Sirius : activation de votre compte",
    to: req.body.email,
    data: {
      confirmationToken,
      recipient: {
        email: req.body.email,
        firstname: req.body.firstName,
        lastname: req.body.lastName,
      },
    },
  });

  const etablissementsDisplay = req.body.etablissements
    .map((etablissement) => {
      return `• ${etablissement.siret} - ${
        etablissement.onisep_nom || etablissement.enseigne || etablissement.entreprise_raison_sociale
      }`;
    })
    .join("\n");

  await slack.sendToSlack([
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `:bell: *Nouvelle inscription en ${config.env.toUpperCase()}!* :bell:`,
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:star2: *Nom:* ${req.body.firstName} ${req.body.lastName}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:email: *Email:* ${req.body.email}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:school: *Établissements:*\n${etablissementsDisplay}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:memo: *Commentaire:* \n${req.body.comment}`,
      },
    },
    {
      type: "divider",
    },
  ]);

  res.status(201).json(bodyUser);
});

const loginUser = tryCatch(async (req, res) => {
  const { success, body } = await usersService.loginUser(req.user.id);

  if (!success) throw new BasicError();

  res.cookie("refreshToken", body.refreshToken, COOKIE_OPTIONS);
  res.status(200).json({ success: true, token: body.token });
});

const sudo = tryCatch(async (req, res) => {
  const { id } = req.params;
  const { success, body } = await usersService.sudo(id);

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

  const { success } = await usersService.logoutUser(req.user.id, refreshToken);

  if (!success) throw new BasicError();

  res.clearCookie("refreshToken", COOKIE_OPTIONS);
  res.status(200).json({ success: true });
});

const getUsers = tryCatch(async (req, res) => {
  const { success, body } = await usersService.getUsers();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const updateUser = tryCatch(async (req, res) => {
  const { id } = req.params;

  const { success: successOldUser, body: oldUser } = await usersService.getUserById(id);

  if (!successOldUser) throw new BasicError();

  let newUser = { ...oldUser, ...req.body };

  if (oldUser.role === USER_ROLES.ETABLISSEMENT && req.body.role === USER_ROLES.OBSERVER) {
    newUser = {
      ...oldUser,
      role: USER_ROLES.OBSERVER,
    };
  } else if (oldUser.role === USER_ROLES.OBSERVER && req.body.role === USER_ROLES.ETABLISSEMENT) {
    newUser = {
      ...oldUser,
      role: USER_ROLES.ETABLISSEMENT,
      scope: null,
    };
  }

  const formattedUser = { ...newUser, refreshToken: JSON.stringify(newUser.refreshToken) };

  const { success: successUpdatedUser, body: updatedUser } = await usersService.updateUser(id, formattedUser);

  if (
    successOldUser &&
    successUpdatedUser &&
    oldUser.status !== USER_STATUS.ACTIVE &&
    req.body.status === USER_STATUS.ACTIVE
  ) {
    await mailer.shootTemplate({
      template: "account_activated",
      subject: "Sirius : votre inscription est validée",
      to: oldUser.email,
      data: {
        recipient: {
          email: oldUser.email,
          firstname: oldUser.firstName,
          lastname: oldUser.lastName,
        },
      },
    });
  }

  if (!successUpdatedUser) throw new BasicError();

  return res.status(200).json(updatedUser);
});

const forgotPassword = tryCatch(async (req, res) => {
  const { success, body } = await usersService.forgotPassword(req.body.email);

  if (!success && body === ErrorMessage.UserNotFound) return res.status(200).json({ success: true });
  if (!success) throw new BasicError();

  const resetPasswordToken = jwt.sign({ email: body.email }, config.auth.jwtSecret, {
    expiresIn: "24h",
  });

  await mailer.shootTemplate({
    template: "reset_password",
    subject: "Sirius : réinitialisation du mot de passe",
    to: body.email,
    data: {
      resetPasswordToken,
      recipient: {
        email: body.email,
        firstname: body.firstName,
        lastname: body.lastName,
      },
    },
  });

  return res.status(200).json({ success: true });
});

const resetPassword = tryCatch(async (req, res) => {
  const { success, body } = await usersService.resetPassword(req.body.token, req.body.password);

  if (!success && body === ErrorMessage.UserNotFound) throw new UnauthorizedError();
  if (!success) throw new BasicError();

  return res.status(200).json({ success: true });
});

const confirmUser = tryCatch(async (req, res) => {
  const { success, body } = await usersService.confirmUser(req.body.token);

  if (!success && body === ErrorMessage.UserNotFound) throw new UnauthorizedError();
  if (!success) throw new BasicError();

  return res.status(200).json({ success: true });
});

const supportUser = tryCatch(async (req, res) => {
  const { title, message } = req.body;
  const { email, firstName, lastName } = req.user;

  const slackResponse = await slack.sendToSlack([
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `Demande d'aide en ${config.env.toUpperCase()}!`,
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:raising_hand: *${firstName} ${lastName}* a besoin d'aide!`,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:label: *Titre:*\n${title}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:envelope: *Email:*\n${email}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:pencil: *Message:*\n${message}`,
      },
    },
    {
      type: "divider",
    },
  ]);

  return res.status(200).json({ success: slackResponse.ok });
});

const supportUserPublic = tryCatch(async (req, res) => {
  const { email, message } = req.body;

  const slackResponse = await slack.sendToSlack([
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `Demande d'aide depuis la landing en ${config.env.toUpperCase()}!`,
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:raising_hand: *${email}* a besoin d'aide!`,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:envelope: *Email:*\n${email}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:pencil: *Message:*\n${message}`,
      },
    },
    {
      type: "divider",
    },
  ]);

  return res.status(200).json({ success: slackResponse.ok });
});

module.exports = {
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
  sudo,
};
