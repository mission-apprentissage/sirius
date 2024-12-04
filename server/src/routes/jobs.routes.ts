import express from "express";

import { getAllJobs, getJob, startJob, stopJob } from "../controllers/jobs.controller";
import { isAdmin } from "../middlewares/isAdmin";
import { validator } from "../middlewares/validatorMiddleware";
import { verifyUser } from "../middlewares/verifyUserMiddleware";
import { startJobSchema } from "../validators/jobs.validators";

export const jobs = () => {
  const router = express.Router();

  router.post("/api/jobs/:jobId/stop", verifyUser, isAdmin, (req, res, next) => {
    stopJob(req, res, next);
  });

  router.post("/api/jobs/start", verifyUser, isAdmin, validator(startJobSchema), (req, res, next) => {
    startJob(req, res, next);
  });

  router.get("/api/jobs", verifyUser, isAdmin, (req, res, next) => {
    getAllJobs(req, res, next);
  });

  router.get("/api/jobs/:jobId", verifyUser, isAdmin, (req, res, next) => {
    getJob(req, res, next);
  });

  return router;
};
