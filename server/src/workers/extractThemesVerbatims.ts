// @ts-nocheck -- TODO
import { parentPort, workerData } from "worker_threads";

import config from "../config";
import { JOB_STATUS, VERBATIM_THEMES, VERBATIM_THEMES_LABELS } from "../constants";
import { connectToPgDb, getKbdClient } from "../db/db";
import logger from "../modules/logger";
import { sleep } from "../utils/asyncUtils";

const THEME_EXTRACTION_API = "https://2b1d0760-a1f7-485d-8b69-2ecdf299615a.app.gra.ai.cloud.ovh.net/expose";

let isCancelled = false;

const extractThemesVerbatims = async (verbatim) => {
  const MAX_RETRIES = 5;
  const INITIAL_DELAY = 500;

  const fetchWithRetry = async (url, options, retries = MAX_RETRIES, delay = INITIAL_DELAY) => {
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
    const data = await fetchWithRetry(THEME_EXTRACTION_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: verbatim.content }),
    });

    logger.info("Themes API response:", data);
    if (data?.exposition) {
      const booleanizedThemes = Object.keys(VERBATIM_THEMES).map((theme) => ({
        [theme]: data?.exposition[VERBATIM_THEMES_LABELS[theme]] === "oui",
      }));

      const formattedThemes = booleanizedThemes.reduce((acc, curr) => {
        const key = Object.keys(curr)[0];
        acc[key] = curr[key];
        return acc;
      }, {});

      await updateVerbatimThemes(verbatim, formattedThemes);
    }
    console.log("----------------");
  } catch (err) {
    logger.error("Failed to classify verbatim:", verbatim.id, err);
  }
};

const updateVerbatimThemes = async (verbatim, formattedThemes) => {
  const updateResult = await getKbdClient()
    .updateTable("verbatims")
    .set("themes", formattedThemes)
    .where("id", "=", verbatim.id)
    .returning("id")
    .executeTakeFirst();

  if (updateResult.id) {
    console.log("Verbatim updated successfully:", verbatim.id);
  } else {
    console.error("Failed to update verbatim:", verbatim.id);
  }
};

const cancellationMonitor = async (jobId) => {
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

    const verbatimsQuery = getKbdClient().selectFrom("verbatims").selectAll();

    if (!processAll) {
      verbatimsQuery.where("deleted_at", "is", null).where("themes", "is", null);
    }

    const verbatims = await verbatimsQuery.execute();
    const totalVerbatims = verbatims.length;

    logger.info(`Found ${verbatimsQuery.length} unthemed verbatims`);

    let processed = 0;

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

      await extractThemesVerbatims(verbatim);
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
    parentPort.postMessage({ type: "error", jobId, error: err.message });
  }
})();
