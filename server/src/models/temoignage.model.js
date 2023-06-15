const mongoose = require("mongoose");

const temoignageSchema = new mongoose.Schema(
  {
    campagneId: { type: String, required: true },
    reponses: { type: Object, required: true },
    deletedAt: { type: Date, default: null },
  },
  { minimize: false, timestamps: true }
);

const Temoignage = mongoose.model("Temoignage", temoignageSchema);

module.exports = Temoignage;
