/* eslint-disable no-prototype-builtins */
const { VERBATIM_STATUS } = require("../constants");
const Temoignage = require("../models/temoignage.model");
const Verbatim = require("../models/verbatim.model");
const Questionnaire = require("../models/questionnaire.model");
const { getChampsLibreField } = require("../utils/verbatims.utils");

module.exports = async ({ isDryRun = false }) => {
  console.log(isDryRun ? "Dry run mode" : "Real run mode");
  try {
    let createdVerbatimCount = 0;
    let deletedVerbatimCount = 0;
    let temoignagesUpdatedCount = 0;

    const champsLibreFields = [];
    const questionnaires = await Questionnaire.find();

    questionnaires.forEach((questionnaire) => {
      champsLibreFields.push(...getChampsLibreField(questionnaire.questionnaireUI));
    });

    const uniqueChampsLibreFields = [...new Set(champsLibreFields.flat())];

    const temoignages = await Temoignage.find();

    for (const temoignage of temoignages) {
      const responses = temoignage.reponses;
      let fieldsToDelete = {};

      for (let key in responses) {
        if (responses.hasOwnProperty(key) && uniqueChampsLibreFields.includes(key)) {
          const value = responses[key];
          let verbatim = {
            temoignageId: temoignage._id,
            questionKey: key,
            content: "",
            status: "",
            createdAt: temoignage.createdAt,
          };

          if (temoignage.deletedAt) {
            verbatim.deletedAt = temoignage.deletedAt;
          }

          if (typeof value === "object" && value !== null) {
            verbatim.content = value.content || "";
            verbatim.status = value.status || VERBATIM_STATUS.PENDING;
          } else {
            verbatim.content = value ? String(value) : "";
            verbatim.status = VERBATIM_STATUS.PENDING;
          }

          if (!isDryRun) {
            await Verbatim.create(verbatim);
          } else {
            console.log(`Dry run: Would create verbatim for temoignageId ${temoignage._id} with questionKey ${key}`);
          }
          createdVerbatimCount += 1;
          fieldsToDelete[`reponses.${key}`] = "";
        }
      }

      if (Object.keys(fieldsToDelete).length > 0) {
        if (!isDryRun) {
          await Temoignage.updateOne({ _id: temoignage._id }, { $unset: fieldsToDelete }, { timestamps: false });
        } else {
          console.log(`Dry run: Would delete fields from temoignageId ${temoignage._id}`);
        }
        deletedVerbatimCount += Object.keys(fieldsToDelete).length;
        temoignagesUpdatedCount += 1;
      }
    }

    console.log(isDryRun ? "Dry run migration completed successfully" : "Migration completed successfully");
    console.log(
      isDryRun
        ? `Dry run: Would have created ${createdVerbatimCount} verbatims `
        : `Created ${createdVerbatimCount} verbatims`
    );
    console.info(
      isDryRun
        ? `Would have deleted ${deletedVerbatimCount} fields from ${temoignagesUpdatedCount} temoignages `
        : `Deleted ${deletedVerbatimCount} fields from ${temoignagesUpdatedCount} temoignages`
    );
  } catch (err) {
    console.error(isDryRun ? "Dry run mode failed" : "Migration failed:", err);
  }
};
