const mailer = require("../../../src/core/mailer");
const config = require("../../../src/config");

module.exports = (options = {}) => {
  let calls = options.calls || [];
  let registerCall = (parameters) => {
    if (options.fail) {
      let err = new Error("Unable to send email");
      return Promise.reject(err);
    } else {
      calls.push(parameters[0]);
      return Promise.resolve();
    }
  };

  return mailer(config, {
    sendMail: (...args) => {
      return registerCall(args);
    },
  });
};
