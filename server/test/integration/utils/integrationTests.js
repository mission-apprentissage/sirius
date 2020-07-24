const { cleanAll, getComponents } = require("./testUtils.js");

module.exports = (desc, cb) => {
  describe(desc, function () {
    cb({ getComponents });
    afterEach(cleanAll);
  });
};
