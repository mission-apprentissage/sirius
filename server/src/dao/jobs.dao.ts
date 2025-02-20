import camelcaseKeys from "camelcase-keys";

import { getKbdClient } from "../db/db";
import type { Job, JobCreation, JobUpdate } from "../types";

export const createJob = async (job: JobCreation): Promise<void> => {
  await getKbdClient()
    .insertInto("jobs")
    .values({ ...job })
    .execute();
};

export const updateJob = async (jobId: string, updates: JobUpdate) => {
  await getKbdClient()
    .updateTable("jobs")
    .set({ ...updates, updated_at: new Date().toISOString() })
    .where("id", "=", jobId)
    .execute();
};

export const getJobById = async (jobId: string): Promise<Job | undefined> => {
  const baseQuery = getKbdClient().selectFrom("jobs").selectAll().where("id", "=", jobId);

  const result = await baseQuery.executeTakeFirst();

  return result ? camelcaseKeys(result) : undefined;
};

export const getAllJobs = async (): Promise<Job[] | undefined> => {
  const baseQuery = getKbdClient().selectFrom("jobs").selectAll().orderBy("created_at", "desc");

  const result = await baseQuery.execute();

  return camelcaseKeys(result);
};
