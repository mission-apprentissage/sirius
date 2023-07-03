const mongoose = require("mongoose");

const questionnaireSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    questionnaire: { type: Object, required: true },
    questionnaireUI: { type: Object, required: true },
    deletedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { minimize: false, timestamps: true }
);

const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);

module.exports = Questionnaire;
