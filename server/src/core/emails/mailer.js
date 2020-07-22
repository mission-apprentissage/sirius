const nodemailer = require("nodemailer");
const _ = require("lodash");
const htmlToText = require("nodemailer-html-to-text").htmlToText;
const mjml = require("mjml");
const path = require("path");
const { promisify } = require("util");
const ejs = require("ejs");
const renderFile = promisify(ejs.renderFile);

module.exports = (config) => {
  let { smtp, publicUrl } = config;
  let transporter = nodemailer.createTransport({
    ..._.omit(smtp, ["auth"]),
    ...(smtp.auth.user ? smtp.auth : {}),
  });
  transporter.use("compile", htmlToText({ ignoreImage: true }));

  let renderEmail = async (templateName, data = {}) => {
    let buffer = await renderFile(path.join(__dirname, `${templateName}.mjml.ejs`), {
      utils: { getPublicUrl: (path) => `${publicUrl}${path}` },
      data,
    });
    let { html } = mjml(buffer.toString(), { minify: true });
    console.log(html);
    return html;
  };

  return {
    renderEmail,
    sendEmail: async (to, subject, templateName, data) => {
      return transporter.sendMail({
        from: "sirius@apprentissage.beta.gouv.fr",
        to,
        subject,
        html: await renderEmail(templateName, data),
        list: {
          //help: getPublicUrl("/faq"),
          //unsubscribe: utils.getUnsubscribeLink(stagiaire.token),
        },
      });
    },
  };
};
