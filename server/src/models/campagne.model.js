const mongoose = require("mongoose");

const campagneSchema = new mongoose.Schema(
  {
    nomCampagne: { type: String, required: true },
    cfa: { type: String, required: true },
    formation: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    questionnaire: { type: Object, required: true },
    questionnaireUI: { type: Object, required: true },
  },
  { minimize: false, timestamps: true }
);

const Campagne = mongoose.model("Campagne", campagneSchema);

module.exports = Campagne;
