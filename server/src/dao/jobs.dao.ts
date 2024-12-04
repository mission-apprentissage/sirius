import { getKbdClient } from "../db/db";

export const createJob = async (job: { id: string; type: string; status: string; progress: number; total: number }) => {
  await getKbdClient()
    .insertInto("jobs")
    .values({ ...job })
    .execute();
};

export const updateJob = async (jobId: string, updates: any) => {
  await getKbdClient()
    .updateTable("jobs")
    .set({ ...updates, updatedAt: new Date().toISOString() })
    .where("id", "=", jobId)
    .execute();
};

export const getJobById = async (jobId: string) => {
  return getKbdClient().selectFrom("jobs").selectAll().where("id", "=", jobId).executeTakeFirst();
};

export const getAllJobs = async () => {
  return getKbdClient().selectFrom("jobs").selectAll().orderBy("created_at", "desc").execute();
};
