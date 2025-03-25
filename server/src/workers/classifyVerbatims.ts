import camelcaseKeys from "camelcase-keys";
import { sql } from "kysely";
import { parentPort, workerData } from "worker_threads";

import config from "../config";
import { JOB_STATUS } from "../constants";
import { connectToPgDb, getKbdClient } from "../db/db";
import logger from "../modules/logger";
import type {
  FetchOptions,
  Verbatim,
  VerbatimClassificationApiResponse,
  VerbatimScore,
  VerbatimThemes,
} from "../types";
import { sleep } from "../utils/asyncUtils";

const CLASSIFICATION_API = "https://2b1d0760-a1f7-485d-8b69-2ecdf299615a.app.gra.ai.cloud.ovh.net/score";

let isCancelled = false;

const classifyVerbatim = async (verbatim: Verbatim) => {
  const MAX_RETRIES = 5;
  const INITIAL_DELAY = 500;

  const fetchWithRetry = async (url: string, options: FetchOptions, retries = MAX_RETRIES, delay = INITIAL_DELAY) => {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (retries === 0) {
        throw error;
      }

      logger.info(`Retrying in ${delay}ms... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await sleep(delay);
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
  };

  try {
    const data = (await fetchWithRetry(CLASSIFICATION_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: verbatim.content }),
    })) as VerbatimClassificationApiResponse;

    console.log("Classification API response:", data);

    await updateVerbatimScores(verbatim, data.scores);

    console.log("----------------");
  } catch (err) {
    console.error("Failed to classify verbatim:", verbatim.id, err);
  }
};

const updateVerbatimScores = async (verbatim: Verbatim, scores: VerbatimScore) => {
  const updateResult = await getKbdClient()
    .updateTable("verbatims")
    .set("scores", scores)
    .where("id", "=", verbatim.id)
    .returning("id")
    .executeTakeFirst();

  if (updateResult?.id) {
    console.log("Verbatim updated successfully:", verbatim.id);
  } else {
    console.error("Failed to update verbatim:", verbatim.id);
  }
};

const cancellationMonitor = async (jobId: string) => {
  while (!isCancelled) {
    const job = await getKbdClient().selectFrom("jobs").select("status").where("id", "=", jobId).executeTakeFirst();

    if (!job) {
      console.error(`Job ${jobId} not found. Exiting worker...`);
      isCancelled = true;
      break;
    }

    if (job.status === JOB_STATUS.CANCELLED) {
      console.log(`Job ${jobId} is cancelled. Exiting worker...`);
      isCancelled = true;
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};

(async () => {
  const { jobId, processAll } = workerData;

  try {
    await connectToPgDb(config.psql.uri);

    cancellationMonitor(jobId);

    const verbatimsQuery = getKbdClient()
      .selectFrom("verbatims")
      .select([
        "verbatims.id",
        "verbatims.temoignage_id",
        "verbatims.question_key",
        "verbatims.content",
        "verbatims.content_corrected",
        "verbatims.correction_justification",
        "verbatims.anonymization_justification",
        "verbatims.content_corrected_anonymized",
        "verbatims.status",
        sql<VerbatimScore | null>`verbatims.scores`.as("scores"),
        sql<VerbatimThemes | null>`verbatims.themes`.as("themes"),
        "verbatims.feedback_count",
        "verbatims.is_corrected",
        "verbatims.is_anonymized",
        "verbatims.created_at",
        "verbatims.updated_at",
        "verbatims.deleted_at",
      ]);

    if (!processAll) {
      verbatimsQuery.where("deleted_at", "is", null).where("scores", "is", null);
    }

    const result = await verbatimsQuery.execute();

    const verbatims = camelcaseKeys(result);

    const totalVerbatims = verbatims.length;

    logger.info(`Found ${totalVerbatims} verbatims to classify`);

    let processed = 0;

    parentPort?.postMessage({ type: "start", jobId, total: totalVerbatims });

    for (const verbatim of verbatims) {
      if (isCancelled) {
        console.log("Job cancelled. Exiting worker...");
        parentPort?.postMessage({
          type: "cancelled",
          jobId,
          progress: processed,
          total: totalVerbatims,
        });
        return;
      }

      await classifyVerbatim(verbatim);
      processed++;

      parentPort?.postMessage({
        type: "progress",
        jobId,
        progress: processed,
        total: totalVerbatims,
      });
    }

    if (!isCancelled) {
      logger.info(`[Job ${jobId}] Classification completed successfully`);
    } else {
      logger.info(`[Job ${jobId}] Classification cancelled.`);
    }

    parentPort?.postMessage({ type: "done", jobId, status: JOB_STATUS.COMPLETED });
  } catch (err) {
    logger.error(`[Job ${jobId}] Classification failed: ${err}`);
    parentPort?.postMessage({ type: "error", jobId, error: err.message });
  }
})();
