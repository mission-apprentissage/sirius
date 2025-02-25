// @ts-nocheck -- TODO
import Boom from "@hapi/boom";

export default () => {
  // eslint-disable-next-line no-unused-vars
  return (rawError, req, res, _next) => {
    req.err = rawError;

    let error;
    if (rawError.isBoom) {
      error = rawError;
    } else if (rawError.name === "ValidationError") {
      //This is a joi validation error
      error = Boom.badRequest("Erreur de validation");
      error.output.payload.details = rawError.details;
    } else {
      error = Boom.boomify(rawError, {
        statusCode: rawError.status || 500,
      });
      error.reformat(true);
    }

    return res.status(error.output.statusCode).send(error.output.payload);
  };
};
