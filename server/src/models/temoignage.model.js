const mongoose = require("mongoose");

const temoignageSchema = new mongoose.Schema(
  {
    campagneId: { type: String, required: true },
    reponses: { type: Object, required: true },
  },
  { minimize: false }
);

const Temoignage = mongoose.model("Temoignage", temoignageSchema);

module.exports = Temoignage;
