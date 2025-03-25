import Boom from "@hapi/boom";
import type { Request, Response } from "express";

type RawError = {
  isBoom: boolean;
  name: string;
  status: number;
  details: any;
  message: string;
};

export default () => {
  // eslint-disable-next-line no-unused-vars
  return (rawError: RawError, req: Request, res: Response) => {
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
