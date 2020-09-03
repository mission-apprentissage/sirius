const axios = require("axios");

module.exports = (logger) => {
  let instance = axios.create();
  instance.interceptors.request.use((request) => {
    let { method, url, params, data } = request;
    logger.debug("Sending request", `[${method.toUpperCase()}] ${url}`, {
      ...(params ? { params: JSON.stringify(params) } : {}),
      ...(data ? { data: JSON.stringify(data) } : {}),
    });
    return request;
  });
  return instance;
};
