const { connectToMongoForTests, cleanAll } = require("./testUtils.js");
const logger = require("./fakeLogger.js");
const createIndexes = require("../../../src/misc/indexes/createIndexes");

module.exports = (desc, cb) => {
  describe(desc, function () {
    let context;

    beforeEach(async () => {
      let client = await connectToMongoForTests();
      let db = client.db();
      await createIndexes(db);
      context = { db, logger };
    });

    cb({ getContext: () => context });

    afterEach(cleanAll);
  });
};
