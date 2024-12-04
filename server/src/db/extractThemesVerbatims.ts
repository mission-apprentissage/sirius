/* eslint-disable n/no-process-exit */
/* eslint-disable no-process-exit */
// @ts-nocheck -- TODO

import { VERBATIM_THEMES, VERBATIM_THEMES_EMOJIS, VERBATIM_THEMES_LABELS } from "../constants";
import logger from "../modules/logger";
import { sendToSlack } from "../modules/slack";
import { sleep } from "../utils/asyncUtils";
import { getKbdClient } from "./db";

const THEME_EXTRACTION_API = "https://2b1d0760-a1f7-485d-8b69-2ecdf299615a.app.gra.ai.cloud.ovh.net/expose";

const extractThemesVerbatims = async (verbatim, themeCount) => {
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

      Object.keys(formattedThemes).forEach((theme) => {
        // eslint-disable-next-line no-prototype-builtins
        if (formattedThemes[theme] && themeCount.hasOwnProperty(theme)) {
          themeCount[theme]++;
        }
      });

      await updateVerbatimThemes(verbatim, formattedThemes);
    }
    console.log("----------------");
    await sleep(500);
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

const sendSummaryToSlack = async (totalVerbatims, themeCount) => {
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
    const unthemedVerbatims = await getKbdClient()
      .selectFrom("verbatims")
      .selectAll()
      .where("deleted_at", "is", null)
      .where("themes", "is", null)
      .execute();

    const themeCount = Object.keys(VERBATIM_THEMES_LABELS).reduce((acc, theme) => {
      acc[theme] = 0;
      return acc;
    }, {});

    logger.info(`Found ${unthemedVerbatims.length} unthemed verbatims`);

    for (const verbatim of unthemedVerbatims) {
      await extractThemesVerbatims(verbatim, themeCount);
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
