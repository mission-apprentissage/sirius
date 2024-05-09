const mongoose = require("mongoose");
const { VERBATIM_STATUS } = require("../constants");

const verbatimSchema = new mongoose.Schema(
  {
    temoignageId: { type: String, required: true },
    questionKey: { type: String, required: true },
    content: { type: String, default: null },
    status: { type: String, default: VERBATIM_STATUS.PENDING },
    deletedAt: { type: Date, default: null },
  },
  { minimize: false, timestamps: true }
);

const Verbatim = mongoose.model("Verbatim", verbatimSchema);

module.exports = Verbatim;
