const expect = require("chai").expect;

const FormationModel = require("../../src/models/formation.model");
const { newFormation } = require("../fixtures");

describe(__filename, () => {
  it("should be invalid if required fields are empty", (done) => {
    const createdFormation = new FormationModel();

    createdFormation.validate((err) => {
      expect(err.errors.data).to.exist;
      expect(err.errors.createdBy).to.exist;
      expect(err.errors.campagneId).to.exist;
      done();
    });
  });

  it("should be valid if required fields are present", (done) => {
    const createdFormation = new FormationModel(newFormation());

    createdFormation.validate((err) => {
      expect(err).to.not.exist;
      done();
    });
  });
});
