const mongoose = require("mongoose");

const etablissementSchema = new mongoose.Schema(
  {
    data: { type: Object, required: true },
    formationIds: { type: Array, default: [] },
    deletedAt: { type: Date, default: null },
    createdBy: { type: Object, required: true },
  },
  { minimize: false, timestamps: true }
);

const Etablissement = mongoose.model("Etablissement", etablissementSchema);

module.exports = Etablissement;
