const _ = require("lodash");

module.exports = {
  promiseAll: async (data) => {
    if (_.isPlainObject(data)) {
      return _.zipObject(_.keys(data), await Promise.all(_.values(data)));
    }
    return Promise.all(data);
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
  delay: (milliseconds) => {
    return new Promise((resolve) => setTimeout(() => resolve(), milliseconds));
  },
};
