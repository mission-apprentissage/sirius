const nodemailer = require("nodemailer");
const { omit } = require("lodash");
const htmlToText = require("nodemailer-html-to-text").htmlToText;
const mjml = require("mjml");
const { promisify } = require("util");
const ejs = require("ejs");
const renderFile = promisify(ejs.renderFile);

module.exports = (config) => {
  let { smtp, publicUrl } = config;
  let needsAuthentication = !!smtp.auth.user;
  let utils = { getPublicUrl: (path) => `${publicUrl}${path}` };
  let transporter = nodemailer.createTransport(needsAuthentication ? smtp : omit(smtp, ["auth"]));
  transporter.use("compile", htmlToText({ ignoreImage: true }));

  let renderEmail = async (template, data = {}) => {
    let buffer = await renderFile(template, {
      utils,
      data,
    });
    let { html } = mjml(buffer.toString(), { minify: true });
    return html;
  };

  return {
    renderEmail,
    sendEmail: async (to, subject, template, data) => {
      return transporter.sendMail({
        from: "sirius@apprentissage.beta.gouv.fr",
        to,
        subject,
        html: await renderEmail(template, data),
        list: {
          help: "https://app.gitbook.com/@mission-apprentissage/s/general/les-nouveaux-services/anotea-apprentissage",
          unsubscribe: utils.getPublicUrl(`/api/contrats/${data.contrat._id}/unsubscribe`),
        },
      });
    },
  };
};
