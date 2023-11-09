const expect = require("chai").expect;

const QuestionnaireModel = require("../../src/models/questionnaire.model");
const { newQuestionnaire } = require("../fixtures");

describe(__filename, () => {
  it("should be invalid if required fields are empty", (done) => {
    const createdQuestionnaire = new QuestionnaireModel();

    createdQuestionnaire.validate((err) => {
      expect(err.errors.nom).to.exist;
      expect(err.errors.questionnaire).to.exist;
      expect(err.errors.questionnaireUI).to.exist;
      done();
    });
  });

  it("should be valid if required fields are present", (done) => {
    const createdQuestionnaire = new QuestionnaireModel(newQuestionnaire());

    createdQuestionnaire.validate((err) => {
      expect(err).to.not.exist;
      done();
    });
  });
});
