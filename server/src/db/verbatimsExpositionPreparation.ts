/* eslint-disable n/no-process-exit */
/* eslint-disable no-process-exit */

import camelcaseKeys from "camelcase-keys";
import { sql } from "kysely";

import { VERBATIM_THEMES, VERBATIM_THEMES_EMOJIS, VERBATIM_THEMES_LABELS } from "../constants";
import logger from "../modules/logger";
import { sendToSlack } from "../modules/slack";
import type { ExpositionApiResponse, FetchOptions, Verbatim, VerbatimScore, VerbatimThemes } from "../types";
import { sleep } from "../utils/asyncUtils";
import { getKbdClient } from "./db";

const VERBATIMS_EXPOSITION_PREPARATION_API =
  "https://8e9588b0-49d3-489e-a3ee-d67e5a9c1d02.app.gra.ai.cloud.ovh.net/expose";

const verbatimsExpositionPreparation = async (verbatim: Verbatim, themeCount: Record<string, number>) => {
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

      logger.info(`Retrying in ${delay}ms... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
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

      Object.keys(formattedThemes).forEach((theme) => {
        // eslint-disable-next-line no-prototype-builtins
        if (formattedThemes[theme] && themeCount.hasOwnProperty(theme)) {
          themeCount[theme]++;
        }
      });

      await updateVerbatimThemes(verbatim, formattedThemes, {
        correction: data.correction,
        anonymisation: data.anonymisation,
      });
    }
    console.log("----------------");
    await sleep(500);
  } catch (err) {
    logger.error("Failed to classify verbatim:", verbatim.id, err);
  }
};

const updateVerbatimThemes = async (
  verbatim: Verbatim,
  formattedThemes: { [key: string]: boolean },
  correctionAndAnonymizationData: Pick<ExpositionApiResponse, "correction" | "anonymisation">
): Promise<void> => {
  const updateResult:
    | {
        id: string;
      }
    | undefined = await getKbdClient()
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

const sendSummaryToSlack = async (totalVerbatims: number, themeCount: Record<string, number>) => {
  const themesMessages = Object.entries(themeCount).map(([theme, count]) => ({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `${VERBATIM_THEMES_EMOJIS[theme]} *${VERBATIM_THEMES_LABELS[theme]}:* ${count}`,
    },
  }));

  const summaryMessage = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `:timer_clock: Extraction des thèmes des verbatims terminée!`,
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
        text: `:star2: Thèmes extraits de *${totalVerbatims}* verbatims!`,
      },
    },
    {
      type: "divider",
    },
    ...themesMessages,
    {
      type: "divider",
    },
  ];

  const summaryResponse = await sendToSlack(summaryMessage);

  if (!summaryResponse?.ok) {
    throw new Error("Failed to send the summary message");
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
      .where("themes", "is", null);

    const result = await baseQuery.execute();

    const unthemedVerbatims = camelcaseKeys(result);

    const themeCount: Record<string, number> = Object.keys(VERBATIM_THEMES_LABELS).reduce(
      (acc: Record<string, number>, theme: string) => {
        acc[theme] = 0;
        return acc;
      },
      {}
    );

    logger.info(`Found ${unthemedVerbatims.length} unthemed verbatims`);

    for (const verbatim of unthemedVerbatims) {
      await verbatimsExpositionPreparation(verbatim, themeCount);
    }

    if (unthemedVerbatims.length) {
      await sendSummaryToSlack(unthemedVerbatims.length, themeCount);
    }

    logger.info("Theme extraction completed successfully.");
    process.exit(0);
  } catch (err) {
    logger.error("Theme extraction failed:", err);
    process.exit(1);
  }
};
