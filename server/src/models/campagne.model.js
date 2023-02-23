const mongoose = require("mongoose");

const campagneSchema = new mongoose.Schema(
  {
    nomCampagne: String,
    cfa: String,
    formation: String,
    startDate: String,
    endDate: String,
    questionnaire: Object,
    questionnaireUI: Object,
  },
  { minimize: false }
);

const Campagne = mongoose.model("Campagne", campagneSchema);

module.exports = Campagne;
