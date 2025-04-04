/* eslint-disable n/no-process-exit */
/* eslint-disable no-process-exit */

import camelcaseKeys from "camelcase-keys";
import { sql } from "kysely";

import { VERBATIM_STATUS, VERBATIM_STATUS_EMOJIS, VERBATIM_STATUS_LABELS } from "../constants";
import logger from "../modules/logger";
import { sendToSlack } from "../modules/slack";
import type {
  FetchOptions,
  Verbatim,
  VerbatimClassificationApiResponse,
  VerbatimScore,
  VerbatimThemes,
} from "../types";
import { sleep } from "../utils/asyncUtils";
import { getKbdClient } from "./db";

const CLASSIFICATION_API = "https://2b1d0760-a1f7-485d-8b69-2ecdf299615a.app.gra.ai.cloud.ovh.net/score";

const classifyVerbatim = async (
  verbatim: Verbatim,
  classificationCount: Record<string, number>,
  gemVerbatims: string[]
) => {
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

    const highestScore = getHighestScore(data.scores);
    const isGem = data.scores.GEM?.avis === "oui";
    const status = isGem ? VERBATIM_STATUS.GEM : highestScore;

    classificationCount[status]++;
    await updateVerbatimScores(verbatim, data.scores);

    if (verbatim.content && isGem) {
      gemVerbatims.push(verbatim.content);
    }

    console.log("----------------");
    await sleep(500);
  } catch (err) {
    console.error("Failed to classify verbatim:", verbatim.id, err);
  }
};

const getHighestScore = (scores: VerbatimScore) => {
  return Object.entries(scores)
    .filter(([key]) => key !== "NOT_VALIDATED")
    .sort(([, scoreA], [, scoreB]) => (scoreB as number) - (scoreA as number))[0][0];
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

const sendSummaryToSlack = async (totalClassifiedVerbatims: number, gemVerbatims: string[]) => {
  const statusMessages = Object.entries(totalClassifiedVerbatims).map(([status, count]) => ({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `${VERBATIM_STATUS_EMOJIS[status as keyof typeof VERBATIM_STATUS_EMOJIS]} *${VERBATIM_STATUS_LABELS[status as keyof typeof VERBATIM_STATUS_LABELS]}:* ${count}`,
    },
  }));

  const summaryMessage = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `:timer_clock: Classification des verbatims terminée!`,
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:star2: *${totalClassifiedVerbatims}* verbatims ont été classifiés!`,
      },
    },
    {
      type: "divider",
    },
    ...statusMessages,
    {
      type: "divider",
    },
  ];

  const summaryResponse = await sendToSlack(summaryMessage);

  if (!summaryResponse?.ok) {
    throw new Error("Failed to send the summary message");
  }

  const thread_ts = summaryResponse.ts;

  for (const gem of gemVerbatims) {
    const gemMessage = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `:gem: ${gem}`,
        },
      },
      {
        type: "divider",
      },
    ];

    await sendToSlack(gemMessage, thread_ts);
  }
};

export default async () => {
  try {
    const baseQuery = getKbdClient()
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
      ])
      .where("deleted_at", "is", null)
      .where("scores", "is", null);

    const result = await baseQuery.execute();

    const unclassifiedVerbatims = camelcaseKeys(result);

    const classificationCount = Object.keys(VERBATIM_STATUS).reduce(
      (acc: Record<string, number>, status: (typeof VERBATIM_STATUS)[keyof typeof VERBATIM_STATUS]) => {
        if (status !== VERBATIM_STATUS.PENDING) {
          acc[status] = 0;
        }
        return acc;
      },
      {}
    );

    logger.info(`Found ${unclassifiedVerbatims.length} unclassified verbatims`);

    const gemVerbatims: string[] = [];

    for (const verbatim of unclassifiedVerbatims) {
      await classifyVerbatim(verbatim, classificationCount, gemVerbatims);
    }

    const totalClassifiedVerbatims = Object.values(classificationCount).reduce((acc, count) => acc + count, 0);

    if (totalClassifiedVerbatims) {
      await sendSummaryToSlack(totalClassifiedVerbatims, gemVerbatims);
    }

    logger.info("Classification completed successfully.");
    process.exit(0);
  } catch (err) {
    logger.error("Classification failed:", err);
    process.exit(1);
  }
};
