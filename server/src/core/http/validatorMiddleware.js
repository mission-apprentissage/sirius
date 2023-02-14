const createHttpError = require("http-errors");

const validator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(createHttpError(400, error));
    }
    next();
  };
};

module.exports = validator;
