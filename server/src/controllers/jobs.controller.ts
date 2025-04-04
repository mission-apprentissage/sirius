import type { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Worker } from "worker_threads";

import { JOB_STATUS, JOB_TYPES } from "../constants";
import * as jobsService from "../services/jobs.service";
import type { AuthedRequest } from "../types";
import tryCatch from "../utils/tryCatch.utils";

const getType = (
  jobOnlyAnonymized: boolean,
  jobForceGem: boolean,
  notCorrectedAndNotAnonymized: boolean
): string | null => {
  if (jobOnlyAnonymized) {
    return "onlyAnonymized";
  } else if (jobForceGem) {
    return "forceGem";
  } else if (notCorrectedAndNotAnonymized) {
    return "notCorrectedAndNotAnonymized";
  } else {
    return null;
  }
};

export const startJob = tryCatch(async (req: AuthedRequest, res: Response) => {
  const jobId = uuidv4();
  const jobType = req.body.jobType;
  const jobOnlyAnonymized = req.body.onlyAnonymized;
  const jobForceGem = req.body.forceGem;
  const notCorrectedAndNotAnonymized = req.body.notCorrectedAndNotAnonymized;
  const status = JOB_STATUS.IN_PROGRESS;
  let worker;

  if (jobType === JOB_TYPES.VERBATIMS_CLASSIFICATION) {
    worker = new Worker("./dist/workers/classifyVerbatims.js", {
      workerData: { jobId, processAll: true },
    });
  } else if (jobType === JOB_TYPES.VERBATIMS_THEMES_EXTRACTION) {
    worker = new Worker("./dist/workers/verbatimsExpositionPreparation.js", {
      workerData: {
        jobId,
        processAll: jobOnlyAnonymized || jobForceGem || notCorrectedAndNotAnonymized ? false : true,
        type: getType(jobOnlyAnonymized, jobForceGem, notCorrectedAndNotAnonymized),
      },
    });
  }

  if (!worker) {
    return res.status(400).json({ success: false, error: "Invalid job type" });
  }

  const { success, body } = await jobsService.startJob({
    id: jobId,
    type: jobType,
    status,
    progress: 0,
    total: 0,
  });

  if (!success) {
    return res.status(500).json({ error: body });
  }

  worker.on("message", async (message) => {
    if (message.type === "progress") {
      await jobsService.updateJobProgress(jobId, message.progress, message.total);
    } else if (message.type === "done") {
      await jobsService.completeJob(jobId, JOB_STATUS.COMPLETED);
    } else if (message.type === "error") {
      await jobsService.completeJob(jobId, JOB_STATUS.FAILED, message.error);
    }
  });

  worker.on("exit", async (code) => {
    if (code !== 0) {
      await jobsService.completeJob(jobId, JOB_STATUS.FAILED, `Worker exited with code ${code}`);
    }
  });

  return res.status(200).json({ success, jobId });
});

export const stopJob = tryCatch(async (req: AuthedRequest, res: Response) => {
  const { jobId } = req.params;

  const { success, body } = await jobsService.getJobById(jobId);

  if (!body || !success) {
    return res.status(404).json({ success: false, error: "Job not found" });
  }

  if (body.status === JOB_STATUS.COMPLETED || body.status === JOB_STATUS.CANCELLED) {
    return res.status(400).json({ success: false, error: `Job is already ${body.status.toLowerCase()}.` });
  }

  await jobsService.completeJob(jobId, JOB_STATUS.CANCELLED);

  return res.status(200).json({ success: true, jobId });
});

export const getJob = tryCatch(async (req: AuthedRequest, res: Response) => {
  const { jobId } = req.params;
  const job = await jobsService.getJobById(jobId);

  if (!job) {
    return res.status(404).json({ success: false, error: "Job not found" });
  }
  return res.status(200).json(job);
});

export const getAllJobs = tryCatch(async (_req: AuthedRequest, res: Response) => {
  const jobs = await jobsService.getAllJobs();
  return res.status(200).json(jobs);
});
