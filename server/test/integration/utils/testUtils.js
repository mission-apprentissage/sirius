const { Readable } = require("stream");
const mongoose = require("mongoose");
const connectToMongoDB = require("../../../src/modules/connectToMongoDB");
const config = require("../../../src/config");
const createComponents = require("../../../src/components");
const logger = require("./fakeLogger.js");

let clientHolder = null;
let connectToMongoForTests = async () => {
  if (!clientHolder) {
    let uri = config.mongodb.uri.split("sirius").join("sirius_test");
    clientHolder = await connectToMongoDB({ uri });
  }
  return clientHolder;
};

module.exports = {
  connectToMongoForTests,
  getComponents: async (options = {}) => {
    let client = await connectToMongoForTests();
    return createComponents({
      client,
      logger,
      ...options,
    });
  },
  cleanAll: async () => {
    return mongoose.connection.db.dropDatabase();
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
