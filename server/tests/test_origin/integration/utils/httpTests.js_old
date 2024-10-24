const request = require("supertest");

const { cleanAll, getComponents } = require("./testUtils.js");
const server = require("../../../src/httpServer");

let startServer = async (options) => {
  let components = await getComponents(options);
  let app = await server(components);
  return {
    httpClient: request(app),
    components,
  };
};

const runTest = (name, cb, options = {}) => {
  let run = options.only ? describe.only : describe;
  run(name, function () {
    cb({ startServer });
    afterEach(cleanAll);
  });
};

module.exports = (name, cb) => runTest(name, cb);
module.exports.only = (name, cb) => runTest(name, cb, { only: true });
