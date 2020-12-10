const nodemailer = require("nodemailer");
const { omit } = require("lodash");
const htmlToText = require("nodemailer-html-to-text").htmlToText;
const mjml = require("mjml");
const { promisify } = require("util");
const ejs = require("ejs");
const renderFile = promisify(ejs.renderFile);

const createTransporter = (smtp) => {
  let needsAuthentication = !!smtp.auth.user;

  let transporter = nodemailer.createTransport(needsAuthentication ? smtp : omit(smtp, ["auth"]));
  transporter.use("compile", htmlToText({ ignoreImage: true }));
  return transporter;
};

module.exports = (config, transporter = createTransporter(config.smtp)) => {
  let utils = { getPublicUrl: (path) => `${config.publicUrl}${path}` };

  let renderEmail = async (email, data = {}) => {
    let buffer = await renderFile(email.template, {
      email,
      data,
      utils,
    });
    let { html } = mjml(buffer.toString(), { minify: true });
    return html;
  };

  return {
    renderEmail,
    sendEmail: async (email, data) => {
      return transporter.sendMail({
        from: "sirius@apprentissage.beta.gouv.fr",
        to: email.to,
        subject: email.subject,
        html: await renderEmail(email, data),
        list: {
          help: "https://app.gitbook.com/@mission-apprentissage/s/general/les-nouveaux-services/anotea-apprentissage",
          unsubscribe: utils.getPublicUrl(`/api/unsubscribe/${email.to}`),
        },
      });
    },
  };
};
