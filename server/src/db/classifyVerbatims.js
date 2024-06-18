const { VERBATIM_STATUS, VERBATIM_STATUS_EMOJIS, VERBATIM_STATUS_LABELS } = require("../constants");
const Verbatim = require("../models/verbatim.model");
const { sendToSlack } = require("../modules/slack");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CLASSIFICATION_API = "https://huynhdoo--sirius-moderation-score.modal.run";

const classifyVerbatim = async (verbatim, classificationCount, gemVerbatims) => {
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
    const data = await fetchWithRetry(CLASSIFICATION_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: verbatim.content }),
    });

    console.log("Classification API response:", data);

    const highestScore = getHighestScore(data.scores);
    const isGem = data.scores.GEM?.avis === "oui";
    const status = isGem ? VERBATIM_STATUS.GEM : highestScore;

    classificationCount[status]++;
    await updateVerbatimScores(verbatim, data.scores);

    if (isGem) {
      gemVerbatims.push(verbatim.content);
    }

    console.log("----------------");
    await sleep(500);
  } catch (err) {
    console.error("Failed to classify verbatim:", verbatim._id.toString(), err);
  }
};

const getHighestScore = (scores) => {
  return Object.entries(scores)
    .filter(([key]) => key !== "NOT_VALIDATED")
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)[0][0];
};

const updateVerbatimScores = async (verbatim, scores) => {
  const updateResult = await Verbatim.updateOne({ _id: verbatim._id }, { scores });

  if (updateResult.modifiedCount === 1) {
    console.log("Verbatim updated successfully:", verbatim._id.toString());
  } else {
    console.error("Failed to update verbatim:", verbatim._id.toString());
  }
};

const sendSummaryToSlack = async (totalVerbatims, classificationCount, gemVerbatims) => {
  const statusMessages = Object.entries(classificationCount).map(([status, count]) => ({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `${VERBATIM_STATUS_EMOJIS[status]} *${VERBATIM_STATUS_LABELS[status]}:* ${count}`,
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
        text: `:star2: *${totalVerbatims}* verbatims ont été classifiés!`,
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

  if (!summaryResponse.ok) {
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

module.exports = async () => {
  try {
    const unclassifiedVerbatims = await Verbatim.find({
      deletedAt: null,
      $or: [{ scores: { $exists: false } }, { scores: null }],
    });

    const classificationCount = Object.keys(VERBATIM_STATUS).reduce((acc, status) => {
      if (status !== VERBATIM_STATUS.PENDING) {
        acc[status] = 0;
      }
      return acc;
    }, {});

    console.log(`Found ${unclassifiedVerbatims.length} unclassified verbatims`);

    const gemVerbatims = [];

    for (const verbatim of unclassifiedVerbatims) {
      await classifyVerbatim(verbatim, classificationCount, gemVerbatims);
    }

    const totalClassifiedVerbatims = Object.values(classificationCount).reduce((acc, count) => acc + count, 0);

    if (totalClassifiedVerbatims) {
      await sendSummaryToSlack(totalClassifiedVerbatims, totalClassifiedVerbatims, gemVerbatims);
    }

    console.log("Classification completed successfully.");
  } catch (err) {
    console.error("Classification failed:", err);
  }
};
