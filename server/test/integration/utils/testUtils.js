const { Readable } = require("stream");
const connectToMongoDB = require("../../../src/core/connectToMongoDB");
const config = require("../../../src/config");

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
