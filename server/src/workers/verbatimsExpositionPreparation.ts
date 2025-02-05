import { sql } from "kysely";
import { parentPort, workerData } from "worker_threads";

import config from "../config";
import { JOB_STATUS, VERBATIM_STATUS, VERBATIM_THEMES, VERBATIM_THEMES_LABELS } from "../constants";
import { connectToPgDb, getKbdClient } from "../db/db";
import logger from "../modules/logger";
import type { ExpositionApiResponse, FetchOptions, Verbatim } from "../types";
import { sleep } from "../utils/asyncUtils";

const VERBATIMS_EXPOSITION_PREPARATION_API =
  "https://8e9588b0-49d3-489e-a3ee-d67e5a9c1d02.app.gra.ai.cloud.ovh.net/expose";

let isCancelled = false;

const verbatimsExpositionPreparation = async (verbatim: Verbatim) => {
  const MAX_RETRIES = 5;
  const INITIAL_DELAY = 500;

  const fetchWithRetry = async (
    url: string,
    options: FetchOptions,
    retries: number = MAX_RETRIES,
    delay: number = INITIAL_DELAY
  ): Promise<ExpositionApiResponse> => {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return response.json() as Promise<ExpositionApiResponse>;
    } catch (error) {
      if (retries === 0) {
        throw error;
      }

      console.info(`Retrying in ${delay}ms... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await sleep(delay);
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
  };

  try {
    const data = await fetchWithRetry(VERBATIMS_EXPOSITION_PREPARATION_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: verbatim.content }),
    });

    console.info("Themes API response:", data);
    if (data?.exposition) {
      const booleanizedThemes = Object.keys(VERBATIM_THEMES).map((theme) => ({
        [theme]: data?.exposition[VERBATIM_THEMES_LABELS[theme]] === "oui",
      }));

      const formattedThemes = booleanizedThemes.reduce((acc, curr) => {
        const key = Object.keys(curr)[0];
        acc[key] = curr[key];
        return acc;
      }, {});

      await updateVerbatimThemes(verbatim, formattedThemes, {
        correction: data.correction,
        anonymisation: data.anonymisation,
      });
    }
    console.log("----------------");
  } catch (err) {
    console.error("Failed to classify verbatim:", verbatim.id, err);
  }
};

const updateVerbatimThemes = async (
  verbatim: Verbatim,
  formattedThemes: { [key: string]: boolean },
  correctionAndAnonymizationData: Pick<ExpositionApiResponse, "correction" | "anonymisation">
): Promise<void> => {
  const updateResult = await getKbdClient()
    .updateTable("verbatims")
    .set("themes", formattedThemes)
    .set("correction_justification", correctionAndAnonymizationData.correction.justification)
    .set("content_corrected", correctionAndAnonymizationData.correction.correction)
    .set("is_corrected", correctionAndAnonymizationData.correction.modification === "oui")
    .set("anonymization_justification", correctionAndAnonymizationData.anonymisation.justification)
    .set("content_corrected_anonymized", correctionAndAnonymizationData.anonymisation.anonymisation)
    .set("is_anonymized", correctionAndAnonymizationData.anonymisation.modification === "oui")
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
  const { jobId, processAll, type } = workerData;

  try {
    await connectToPgDb(config.psql.uri);

    cancellationMonitor(jobId);

    let verbatimsQuery = getKbdClient().selectFrom("verbatims").selectAll();

    if (!processAll && !type) {
      verbatimsQuery = verbatimsQuery.where("deleted_at", "is", null).where("themes", "is", null);
    } else if (!processAll && type === "onlyAnonymized") {
      verbatimsQuery = verbatimsQuery.where("deleted_at", "is", null).where("is_anonymized", "=", true);
    } else if (!processAll && type === "forceGem") {
      verbatimsQuery = verbatimsQuery.where("deleted_at", "is", null).where("status", "=", VERBATIM_STATUS.GEM);
    } else if (!processAll && type === "notCorrectedAndNotAnonymized") {
      verbatimsQuery = verbatimsQuery
        .where("deleted_at", "is", null)
        .where((qb) => qb.or([qb("content_corrected", "is", null), qb("content_corrected_anonymized", "is", null)]))
        .orderBy(sql`CASE WHEN "status" = 'GEM' THEN 0 ELSE 1 END`, "asc")
        .orderBy("status", "asc");
    }

    const verbatims = await verbatimsQuery.execute();
    const totalVerbatims = verbatims.length;

    console.info(`Found ${verbatims.length} unthemed verbatims`);

    let processed = 0;

    if (!parentPort) return console.error("No parent port found");

    parentPort.postMessage({ type: "start", jobId, total: totalVerbatims });

    for (const verbatim of verbatims) {
      if (isCancelled) {
        console.log("Job cancelled. Exiting worker...");
        parentPort.postMessage({
          type: "cancelled",
          jobId,
          progress: processed,
          total: totalVerbatims,
        });
        return;
      }

      await verbatimsExpositionPreparation(verbatim);
      processed++;

      parentPort.postMessage({
        type: "progress",
        jobId,
        progress: processed,
        total: totalVerbatims,
      });
    }

    if (!isCancelled) {
      logger.info(`[Job ${jobId}] Theme extraction completed successfully.`);
    } else {
      logger.info(`[Job ${jobId}] Theme extraction cancelled.`);
    }

    parentPort.postMessage({ type: "done", jobId, status: JOB_STATUS.COMPLETED });
  } catch (err) {
    logger.error(`[Job ${jobId}] Theme extraction failed: ${err}`);
    parentPort?.postMessage({ type: "error", jobId, error: err.message });
  }
})();
