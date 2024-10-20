// @ts-nocheck -- TODO

import path from "node:path";

import ejs from "ejs";
import { inject } from "injecti";
import _ from "lodash";
import mjml from "mjml";
import nodemailer from "nodemailer";
import { htmlToText } from "nodemailer-html-to-text";

import config from "../config";

const basePath = path.join(__dirname, "../../");

function createTransporter(smtp) {
  const needsAuthentication = !!smtp.auth.user;
  const transporter = nodemailer.createTransport(needsAuthentication ? smtp : _.omit(smtp, ["auth"]));
  transporter.use("compile", htmlToText());
  return transporter;
}

const shootE = inject(
  { transporter: createTransporter({ ...config.smtp, secure: false }) },
  (deps) =>
    async ({ to, subject, html }) => {
      const { messageId } = await deps.transporter.sendMail({
        from: config.smtp.email_from,
        to,
        subject,
        html,
      });

      return messageId;
    }
);
export const shootEmail = shootE[0];

export const shootTemplate = async ({ to, subject, template, data }) => {
  const html = await generateHtml({
    to,
    data,
    subject,
    templateFile: path.join(basePath, `/emails/${template}.mjml.ejs`),
  });

  await shootEmail({ html, subject, to });
};

function getPublicUrl(filepath) {
  return `${config.publicUrl}${filepath}`;
}

async function generateHtml({ to, subject, templateFile, data }) {
  const buffer = await ejs.renderFile(templateFile, {
    to,
    subject,
    data,
    utils: { getPublicUrl },
  });

  const { html } = mjml(buffer.toString(), { minify: true });
  return html;
}
