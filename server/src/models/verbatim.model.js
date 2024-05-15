const mongoose = require("mongoose");
const { VERBATIM_STATUS } = require("../constants");

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

const verbatimSchema = new mongoose.Schema(
  {
    temoignageId: { type: mongoose.Schema.Types.ObjectId, required: true },
    questionKey: { type: String, required: true },
    content: { type: String, default: null },
    status: { type: String, default: VERBATIM_STATUS.PENDING },
    scores: { type: scoresSchema, default: null },
    deletedAt: { type: Date, default: null },
  },
  { minimize: false, timestamps: true }
);

const Verbatim = mongoose.model("Verbatim", verbatimSchema);

module.exports = Verbatim;
