const Verbatim = require("../models/verbatim.model");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CLASSIFICATION_API = "https://huynhdoo--sirius-moderation-score.modal.run";

module.exports = async () => {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const fetch = (await import("node-fetch")).default;

  try {
    const unclassifiedVerbatims = await Verbatim.find({
      deletedAt: null,
      $or: [{ scores: { $exists: false } }, { scores: null }],
    });

    console.log(`Found ${unclassifiedVerbatims.length} unclassified verbatims`);

    for (const verbatim of unclassifiedVerbatims) {
      try {
        const response = await fetch(CLASSIFICATION_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: verbatim.content }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        console.log("Classification API response:", data);

        const updateResult = await Verbatim.updateOne({ _id: verbatim._id }, { scores: data.scores });
        if (updateResult.modifiedCount === 1) {
          console.log("Verbatim updated successfully:", verbatim._id.toString());
        } else {
          console.error("Failed to update verbatim:", verbatim._id.toString());
        }
        console.log("----------------");
        sleep(500);
      } catch (err) {
        console.error("Failed to classify verbatim:", verbatim._id.toString(), err);
      }
    }

    console.log("Classification completed successfully.");
  } catch (err) {
    console.error("Classification failed:", err);
  }
};
