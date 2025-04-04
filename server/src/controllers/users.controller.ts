import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import config from "../config";
import { EMAIL_BREVO_TEMPLATES, USER_ROLES, USER_STATUS } from "../constants";
import { BasicError, ErrorMessage, UnauthorizedError } from "../errors";
import { sendBrevoEmail } from "../modules/brevo";
import { sendToSlack } from "../modules/slack";
import * as etablissementsService from "../services/etablissements.service";
import * as usersService from "../services/users.service";
import type { AuthedRequest } from "../types";
import { COOKIE_OPTIONS } from "../utils/authenticate.utils";
import tryCatch from "../utils/tryCatch.utils";

export const createUser = tryCatch(async (req: Request, res: Response) => {
  const confirmationToken = jwt.sign({ email: req.body.email }, config.auth.jwtSecret, {
    expiresIn: "1y",
  });

  const { success: successUser, body: bodyUser } = await usersService.createUser({ ...req.body, confirmationToken });
  const { success: successEtablissements } = await etablissementsService.createEtablissements(
    req.body.etablissements,
    bodyUser.id
  );

  if (!successUser && !successEtablissements) throw new BasicError();

  await sendBrevoEmail({
    templateId: EMAIL_BREVO_TEMPLATES.CONFIRM_EMAIL,
    recipients: [{ email: req.body.email, name: `${req.body.firstName} ${req.body.lastName}` }],
    params: {
      activationLink: `${config.publicUrl}/confirmer-utilisateur?token=${confirmationToken}`,
      firstname: req.body.firstName,
      lastname: req.body.lastName,
    },
  });

  const etablissementsDisplay = req.body.etablissements
    .map(
      (etablissement: {
        _id: string;
        siret: string;
        onisep_nom: string;
        enseigne: string;
        entreprise_raison_sociale: string;
      }) => {
        return `• ${etablissement.siret} - ${
          etablissement.onisep_nom || etablissement.enseigne || etablissement.entreprise_raison_sociale
        }`;
      }
    )
    .join("\n");

  await sendToSlack([
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

export const loginUser = tryCatch(async (req: AuthedRequest, res: Response) => {
  const { success, body } = await usersService.loginUser(req.user.id);

  if (!success) throw new BasicError();

  res.cookie("refreshToken", body.refreshToken, COOKIE_OPTIONS);
  res.status(200).json({ success: true, token: body.token });
});

export const sudo = tryCatch(async (req: AuthedRequest, res: Response) => {
  const { id } = req.params;
  const { success, body } = await usersService.sudo(id);

  if (!success) throw new BasicError();

  res.cookie("refreshToken", body.refreshToken, COOKIE_OPTIONS);
  res.status(200).json({ success: true, token: body.token });
});

export const refreshTokenUser = tryCatch(async (req: Request, res: Response) => {
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

export const getCurrentUser = tryCatch(async (req: AuthedRequest, res: Response) => {
  res.status(200).json(req.user);
});

export const logoutUser = tryCatch(async (req: AuthedRequest, res: Response) => {
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

export const getUsers = tryCatch(async (_req: AuthedRequest, res: Response) => {
  const { success, body } = await usersService.getUsers();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const updateUser = tryCatch(async (req: AuthedRequest, res: Response) => {
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
    await sendBrevoEmail({
      templateId: EMAIL_BREVO_TEMPLATES.ACCOUNT_ACTIVATED,
      recipients: [{ email: oldUser.email, name: `${oldUser.firstName} ${oldUser.lastName}` }],
      params: {
        firstname: oldUser.firstName,
        lastname: oldUser.lastName,
      },
    });
  }

  if (!successUpdatedUser) throw new BasicError();

  return res.status(200).json(updatedUser);
});

export const forgotPassword = tryCatch(async (req: Request, res: Response) => {
  const { success, body } = await usersService.forgotPassword(req.body.email);

  if (!success && body === ErrorMessage.UserNotFound) return res.status(200).json({ success: true });
  if (!success) throw new BasicError();

  const resetPasswordToken = jwt.sign({ email: body.email }, config.auth.jwtSecret, {
    expiresIn: "24h",
  });

  await sendBrevoEmail({
    templateId: EMAIL_BREVO_TEMPLATES.RESET_PASSWORD,
    recipients: [{ email: body.email, name: `${body.firstName} ${body.lastName}` }],
    params: {
      resetPasswordLink: `${config.publicUrl}/modification-mot-de-passe?token=${resetPasswordToken}`,
      firstname: body.firstName,
      lastname: body.lastName,
    },
  });

  return res.status(200).json({ success: true });
});

export const resetPassword = tryCatch(async (req: Request, res: Response) => {
  const { success, body } = await usersService.resetPassword(req.body.token, req.body.password);

  if (!success && body === ErrorMessage.UserNotFound) throw new UnauthorizedError();
  if (!success) throw new BasicError();

  return res.status(200).json({ success: true });
});

export const confirmUser = tryCatch(async (req: Request, res: Response) => {
  const { success, body } = await usersService.confirmUser(req.body.token);

  if (!success && body === ErrorMessage.UserNotFound) throw new UnauthorizedError();
  if (!success) throw new BasicError();

  return res.status(200).json({ success: true });
});

export const supportUser = tryCatch(async (req: AuthedRequest, res: Response) => {
  const { title, message } = req.body;
  const { email, firstName, lastName } = req.user;

  const slackResponse = await sendToSlack([
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

  return res.status(200).json({ success: slackResponse?.ok });
});

export const supportUserPublic = tryCatch(async (req: Request, res: Response) => {
  const { email, message } = req.body;

  const slackResponse = await sendToSlack([
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

  return res.status(200).json({ success: slackResponse?.ok });
});
