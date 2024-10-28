const expect = require("chai").expect;

const TemoignageModel = require("../../src/models/temoignage.model");
const { newTemoignage } = require("../fixtures");

describe(__filename, () => {
  it("should be invalid if required fields are empty", (done) => {
    const createdTemoignage = new TemoignageModel();

    createdTemoignage.validate((err) => {
      expect(err.errors.campagneId).to.exist;
      expect(err.errors.reponses).to.exist;
      done();
    });
  });

  it("should be valid if required fields are present", (done) => {
    const createdTemoignage = new TemoignageModel(newTemoignage());

    createdTemoignage.validate((err) => {
      expect(err).to.not.exist;
      done();
    });
  });
});
