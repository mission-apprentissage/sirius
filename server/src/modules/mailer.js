const ejs = require("ejs");
const { inject } = require("injecti");
const _ = require("lodash");
const mjml = require("mjml");
const nodemailer = require("nodemailer");
const { htmlToText } = require("nodemailer-html-to-text");
const path = require("path");
const config = require("../config");

const basePath = path.join(__dirname, "../../");

function createTransporter(smtp) {
  const needsAuthentication = !!smtp.auth.user;
  const transporter = nodemailer.createTransport(needsAuthentication ? smtp : _.omit(smtp, ["auth"]));
  transporter.use("compile", htmlToText());
  return transporter;
}

const [shootEmail] = inject(
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

const shootTemplate = async ({ to, subject, template, data }) => {
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

module.exports = {
  shootEmail,
  shootTemplate,
};
