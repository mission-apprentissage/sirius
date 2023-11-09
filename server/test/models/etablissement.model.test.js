const expect = require("chai").expect;

const EtablissementModel = require("../../src/models/etablissement.model");
const { newEtablissement } = require("../fixtures");

describe(__filename, () => {
  it("should be invalid if required fields are empty", (done) => {
    const createdEtablissement = new EtablissementModel();

    createdEtablissement.validate((err) => {
      expect(err.errors.data).to.exist;
      expect(err.errors.createdBy).to.exist;
      done();
    });
  });

  it("should be valid if required fields are present", (done) => {
    const createdEtablissement = new EtablissementModel(newEtablissement());

    createdEtablissement.validate((err) => {
      expect(err).to.not.exist;
      done();
    });
  });
});
