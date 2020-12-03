const _ = require("lodash");

module.exports = {
  promiseAllProps: async (data) => {
    if (_.isPlainObject(data)) {
      return _.zipObject(_.keys(data), await Promise.all(_.values(data)));
    }
    return Promise.all(data);
  },
  delay: (milliseconds) => {
    return new Promise((resolve) => setTimeout(() => resolve(), milliseconds));
  },
};
