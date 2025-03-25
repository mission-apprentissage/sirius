import type { NextFunction, Request, Response } from "express";

interface AsyncHandler {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

export default (callback: any): AsyncHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await callback(req, res, next);
    } catch (e) {
      // Force the async routes to be handled by the error middleware
      return next(e);
    }
  };
};
