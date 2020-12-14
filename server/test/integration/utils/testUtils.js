const { Readable } = require("stream");
const createIndexes = require("../../../src/db/migration/createIndexes");
const connectToMongoDB = require("../../../src/core/connectToMongoDB");
const config = require("../../../src/config");
const createComponents = require("../../../src/components");
const logger = require("./fakeLogger.js");
const createFakeMailer = require("./fakeMailer.js");

let clientHolder = null;
let connectToMongoForTests = async () => {
  if (!clientHolder) {
    let uri = config.mongodb.uri.split("sirius").join("sirius_test");
    clientHolder = await connectToMongoDB({ uri });
  }
  await createIndexes(clientHolder.db());
  return clientHolder;
};

module.exports = {
  connectToMongoForTests,
  getComponents: async (options = {}) => {
    let client = await connectToMongoForTests();
    return createComponents({
      client,
      logger,
      mailer: createFakeMailer(),
      ...options,
    });
  },
  cleanAll: () => {
    return clientHolder.db().dropDatabase();
  },
  randomize: (value) => `${value}-${Math.random().toString(36).substring(7)}`,
  createStream: (content) => {
    let stream = new Readable({
      objectMode: true,
      read() {},
    });

    stream.push(content);
    stream.push(null);

    return stream;
  },
};
