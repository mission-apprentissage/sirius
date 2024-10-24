const { cleanAll, getComponents } = require("./testUtils.js");

const runTest = (name, cb, options = {}) => {
  let run = options.only ? describe.only : describe;
  run(name, function () {
    cb({ getComponents });
    afterEach(cleanAll);
  });
};

module.exports = (name, cb) => runTest(name, cb);
module.exports.only = (name, cb) => runTest(name, cb, { only: true });
