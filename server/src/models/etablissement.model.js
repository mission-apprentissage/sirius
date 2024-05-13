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

etablissementSchema.index({
  "data.siret": "text",
  "data.onisep_nom": "text",
  "data.enseigne": "text",
  "data.entreprise_raison_sociale": "text",
});

const Etablissement = mongoose.model("Etablissement", etablissementSchema);

module.exports = Etablissement;
