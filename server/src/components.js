const connectToMongoDB = require("./common/connectToMongoDB");
const config = require("./config");

module.exports = async (options = {}) => {
  let client = await connectToMongoDB();

  return {
    db: options.db || client.db(),
    config: options.config || config,
    close: () => client.close(),
  };
};
