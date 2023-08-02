const expect = require("chai").expect;

const CampagneModel = require("../../src/models/campagne.model");
const { newCampagne } = require("../fixtures");

describe(__filename, () => {
  it("should be invalid if required fields are empty", (done) => {
    const createdCampagne = new CampagneModel();

    createdCampagne.validate((err) => {
      expect(err.errors.nomCampagne).to.exist;
      expect(err.errors.etablissement).to.exist;
      expect(err.errors.formation).to.exist;
      expect(err.errors.startDate).to.exist;
      expect(err.errors.endDate).to.exist;
      expect(err.errors.questionnaireId).to.exist;
      expect(err.errors.seats).to.exist;
      done();
    });
  });

  it("should be valid if required fields are present", (done) => {
    const createdCampagne = new CampagneModel(newCampagne());

    createdCampagne.validate((err) => {
      expect(err).to.not.exist;
      done();
    });
  });
});
