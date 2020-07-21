const connectToMongoDB = require("../../../src/common/connectToMongoDB");
const config = require("../../../src/config");

let clientHolder = null;
let connectToMongoForTests = async () => {
  if (!clientHolder) {
    clientHolder = await connectToMongoDB(config.mongodb.uri.split("sirius").join("sirius_test"));
  }
  return clientHolder;
};

module.exports = {
  connectToMongoForTests,
  cleanAll: () => {
    return clientHolder.db().dropDatabase();
  },
  randomize: (value) => `${value}-${Math.random().toString(36).substring(7)}`,
};
