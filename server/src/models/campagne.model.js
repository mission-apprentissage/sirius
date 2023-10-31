const mongoose = require("mongoose");

const campagneSchema = new mongoose.Schema(
  {
    nomCampagne: { type: String, default: "" },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    questionnaireId: { type: String, required: true },
    deletedAt: { type: Date, default: null },
    seats: { type: Number, required: true },
  },
  { minimize: false, timestamps: true }
);

const Campagne = mongoose.model("Campagne", campagneSchema);

module.exports = Campagne;
