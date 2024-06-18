const Verbatim = require("../models/verbatim.model");
const { VERBATIM_THEMES_LABELS, VERBATIM_THEMES, VERBATIM_THEMES_EMOJIS } = require("../constants");
const { sendToSlack } = require("../modules/slack");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const THEME_EXTRACTION_API = "https://huynhdoo--sirius-moderation-expose.modal.run";

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

      console.log(`Retrying in ${delay}ms... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
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

    console.log("Themes API response:", data);
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
    console.error("Failed to classify verbatim:", verbatim._id.toString(), err);
  }
};

const updateVerbatimThemes = async (verbatim, formattedThemes) => {
  const updateResult = await Verbatim.updateOne({ _id: verbatim._id }, { themes: formattedThemes });

  if (updateResult.modifiedCount === 1) {
    console.log("Verbatim updated successfully:", verbatim._id.toString());
  } else {
    console.error("Failed to update verbatim:", verbatim._id.toString());
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

module.exports = async () => {
  try {
    const unthemedVerbatims = await Verbatim.find({
      deletedAt: null,
      $or: [{ themes: { $exists: false } }, { themes: null }],
    });

    const themeCount = Object.keys(VERBATIM_THEMES_LABELS).reduce((acc, theme) => {
      acc[theme] = 0;
      return acc;
    }, {});

    console.log(`Found ${unthemedVerbatims.length} unthemed verbatims`);

    for (const verbatim of unthemedVerbatims) {
      await extractThemesVerbatims(verbatim, themeCount);
    }

    if (unthemedVerbatims.length) {
      await sendSummaryToSlack(unthemedVerbatims.length, themeCount);
    }

    console.log("Theme extraction completed successfully.");
  } catch (err) {
    console.error("Theme extraction failed:", err);
  }
};
