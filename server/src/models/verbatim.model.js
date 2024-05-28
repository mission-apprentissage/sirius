const mongoose = require("mongoose");
const { VERBATIM_STATUS, VERBATIM_THEMES } = require("../constants");

const gemSchema = new mongoose.Schema(
  {
    avis: { type: String, required: true },
    justification: { type: String, required: true },
  },
  { minimize: false, _id: false }
);

const scoresSchema = new mongoose.Schema(
  {
    NOT_VALIDATED: { type: Number, required: true },
    [VERBATIM_STATUS.VALIDATED]: { type: Number, required: true },
    [VERBATIM_STATUS.REJECTED]: { type: Number, required: true },
    [VERBATIM_STATUS.TO_FIX]: { type: Number, required: true },
    [VERBATIM_STATUS.ALERT]: { type: Number, required: true },
    [VERBATIM_STATUS.GEM]: { type: gemSchema, required: true },
  },
  { minimize: false, _id: false }
);

const themesSchema = new mongoose.Schema(
  {
    [VERBATIM_THEMES.INTEGRATION_AMBIANCE]: { type: Boolean, required: true, default: false },
    [VERBATIM_THEMES.APPRENTISSAGE_METIER]: { type: Boolean, required: true, default: false },
    [VERBATIM_THEMES.HORAIRES]: { type: Boolean, required: true, default: false },
    [VERBATIM_THEMES.RYTHME_ENTREPRISE_ETABLISSEMENT]: { type: Boolean, required: true, default: false },
    [VERBATIM_THEMES.MOINS_VACANCES]: { type: Boolean, required: true, default: false },
    [VERBATIM_THEMES.JOURNEE_TYPE_ENTREPRISE]: { type: Boolean, required: true, default: false },
    [VERBATIM_THEMES.DIFFICULTES_COURS]: { type: Boolean, required: true, default: false },
    [VERBATIM_THEMES.ENSEIGNEMENT_PROPOSE]: { type: Boolean, required: true, default: false },
    [VERBATIM_THEMES.EQUIPEMENTS]: { type: Boolean, required: true, default: false },
    [VERBATIM_THEMES.ACCESSIBILITE_HANDICAP]: { type: Boolean, required: true, default: false },
    [VERBATIM_THEMES.CHARGE_TRAVAIL]: { type: Boolean, required: true, default: false },
    [VERBATIM_THEMES.JOURNEE_TYPE_ETABLISSEMENT]: { type: Boolean, required: true, default: false },
    [VERBATIM_THEMES.RYTHME_PERSONNEL_ETABLISSEMENT]: { type: Boolean, required: true, default: false },
  },
  { minimize: false, _id: false }
);

const verbatimSchema = new mongoose.Schema(
  {
    temoignageId: { type: mongoose.Schema.Types.ObjectId, required: true },
    questionKey: { type: String, required: true },
    content: { type: String, default: null },
    status: { type: String, default: VERBATIM_STATUS.PENDING },
    scores: { type: scoresSchema, default: null },
    themes: { type: themesSchema, default: null },
    deletedAt: { type: Date, default: null },
  },
  { minimize: false, timestamps: true }
);

const Verbatim = mongoose.model("Verbatim", verbatimSchema);

module.exports = Verbatim;
