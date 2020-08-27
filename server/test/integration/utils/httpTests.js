const axiosist = require("axiosist"); // eslint-disable-line node/no-unpublished-require
const { cleanAll, getComponents } = require("./testUtils.js");
const server = require("../../../src/core/http/httpServer");

let startServer = async (options) => {
  let components = await getComponents(options);
  let app = await server(components);
  let httpClient = axiosist(app);

  return {
    httpClient,
    components,
  };
};

module.exports = (desc, cb) => {
  describe(desc, function () {
    cb({ startServer });
    afterEach(cleanAll);
  });
};
