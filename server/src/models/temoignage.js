const mongoose = require("mongoose");

const temoignageSchema = new mongoose.Schema(
  {
    campagneId: String,
    reponses: Object,
  },
  { minimize: false }
);

const Temoignage = mongoose.model("Temoignage", temoignageSchema);

module.exports = Temoignage;
