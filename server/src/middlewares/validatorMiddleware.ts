import createHttpError from "http-errors";

export const validator = (schema: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(createHttpError(400, error));
    }
    next();
  };
};
