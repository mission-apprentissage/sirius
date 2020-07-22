const axiosist = require("axiosist"); // eslint-disable-line node/no-unpublished-require
const { connectToMongoForTests, cleanAll } = require("./testUtils.js");
const createComponents = require("../../../src/components");
const server = require("../../../src/httpServer");

let startServer = async (options = {}) => {
  let client = await connectToMongoForTests();

  let components = await createComponents({
    client,
    ...options,
  });

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
