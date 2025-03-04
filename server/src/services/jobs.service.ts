import * as jobsDao from "../dao/jobs.dao";
import { JobNotFound } from "../errors";
import type { Job } from "../types";

export const startJob = async (job: {
  id: string;
  type: string;
  status: string;
  progress: number;
  total: number;
}): Promise<
  | {
      success: true;
      body: void;
    }
  | { success: false; body: Error }
> => {
  try {
    const createdJob = await jobsDao.createJob(job);

    return { success: true, body: createdJob };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const updateJobProgress = async (
  jobId: string,
  progress: number,
  total: number
): Promise<
  | {
      success: true;
      body: void;
    }
  | { success: false; body: Error }
> => {
  try {
    const updatedJob = await jobsDao.updateJob(jobId, { progress, total });

    return { success: true, body: updatedJob };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const completeJob = async (
  jobId: string,
  status: string,
  error?: string
): Promise<
  | {
      success: true;
      body: void;
    }
  | { success: false; body: Error }
> => {
  try {
    const updatedJob = await jobsDao.updateJob(jobId, { status, error });

    return { success: true, body: updatedJob };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getJobById = async (
  jobId: string
): Promise<
  | {
      success: true;
      body: Job;
    }
  | { success: false; body: Error }
> => {
  try {
    const job = await jobsDao.getJobById(jobId);

    if (!job) {
      return { success: false, body: new JobNotFound() };
    }

    return { success: true, body: job };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getAllJobs = async (): Promise<
  | {
      success: true;
      body: Job[];
    }
  | { success: false; body: Error }
> => {
  try {
    const jobs = await jobsDao.getAllJobs();

    if (!jobs) {
      return { success: false, body: new JobNotFound() };
    }

    return { success: true, body: jobs };
  } catch (error) {
    return { success: false, body: error };
  }
};
