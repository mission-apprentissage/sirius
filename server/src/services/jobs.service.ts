import * as jobsDao from "../dao/jobs.dao";

export const startJob = async (job: { id: string; type: string; status: string; progress: number; total: number }) => {
  try {
    const createdJob = await jobsDao.createJob(job);

    return { success: true, body: createdJob };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const updateJobProgress = async (jobId: string, progress: number, total: number) => {
  try {
    const updatedJob = await jobsDao.updateJob(jobId, { progress, total });

    return { success: true, body: updatedJob };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const completeJob = async (jobId: string, status: string, error?: string) => {
  try {
    const updatedJob = await jobsDao.updateJob(jobId, { status, error });

    return { success: true, body: updatedJob };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getJobById = async (jobId: string) => {
  try {
    const job = await jobsDao.getJobById(jobId);

    return { success: true, body: job };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getAllJobs = async () => {
  try {
    const jobs = await jobsDao.getAllJobs();

    return { success: true, body: jobs };
  } catch (error) {
    return { success: false, body: error };
  }
};
