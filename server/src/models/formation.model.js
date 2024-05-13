const mongoose = require("mongoose");

const formationSchema = new mongoose.Schema(
  {
    data: { type: Object, required: true },
    campagneId: { type: String, required: true },
    deletedAt: { type: Date, default: null },
    createdBy: { type: Object, required: true },
  },
  { minimize: false, timestamps: true }
);

formationSchema.index({
  "data.intitule_long": "text",
  "data.etablissement_formateur_entreprise_raison_sociale": "text",
  "data.etablissement_formateur_enseigne": "text",
  "data.etablissement_formateur_siret": "text",
});

const Formation = mongoose.model("Formation", formationSchema);

module.exports = Formation;
