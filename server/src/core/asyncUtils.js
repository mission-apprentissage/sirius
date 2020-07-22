const _ = require("lodash");

module.exports = {
  promiseAll: async (promises, callback, options = { batchSize: 25 }) => {
    let chunks = _.chunk(promises, options.batchSize);
    for (let chunk of chunks) {
      await Promise.all(chunk.map((data) => callback(data)));
    }
  },
  batchCursor: async (cursor, callback, options = { batchSize: 25 }) => {
    let promises = [];

    while (await cursor.hasNext()) {
      if (promises.length >= options.batchSize) {
        await Promise.all(promises);
        promises = [];
      }

      promises.push(callback(() => cursor.next()));
    }

    return Promise.all(promises);
  },
  batchArray: async (array, callback, options = { batchSize: 25 }) => {
    let promises = [];

    for (let element of array) {
      if (promises.length >= options.batchSize) {
        await Promise.all(promises);
        promises = [];
      }

      promises.push(callback(element));
    }

    return Promise.all(promises);
  },
};
