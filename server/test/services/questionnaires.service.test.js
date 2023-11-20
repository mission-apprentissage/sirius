const { expect } = require("chai");
const { stub, restore } = require("sinon");
const { newQuestionnaire } = require("../fixtures");
const questionnairesService = require("../../src/services/questionnaires.service");
const questionnairesDao = require("../../src/dao/questionnaires.dao");
const { faker } = require("@faker-js/faker");

describe(__filename, () => {
  afterEach(async () => {
    restore();
  });

  describe("createQuestionnaire", () => {
    it("should be successful and returns the created questionnaire", async () => {
      const questionnaire = newQuestionnaire();
      stub(questionnairesDao, "create").returns(questionnaire);

      const { success, body } = await questionnairesService.createQuestionnaire(questionnaire);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(questionnaire);
    });

    it("should be unsuccessful and returns errors if it throws", async () => {
      const questionnaire = newQuestionnaire();
      stub(questionnairesDao, "create").throws(new Error());

      const { success, body } = await questionnairesService.createQuestionnaire(questionnaire);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("getQuestionnaires", () => {
    it("should be successful and returns an array of questionnaires", async () => {
      const query = { questionnaireId: faker.datatype.uuid() };
      const questionnaires = [newQuestionnaire(), newQuestionnaire()];
      stub(questionnairesDao, "getAllWithCreatorName").returns(questionnaires);

      const { success, body } = await questionnairesService.getQuestionnaires(query);

      expect(success).to.be.true;
      expect(body).to.be.an("array");
      expect(body).to.deep.equal(questionnaires);
    });

    it("should be unsuccessful and returns errors if it throws", async () => {
      const query = { questionnaireId: faker.datatype.uuid() };
      stub(questionnairesDao, "getAllWithCreatorName").throws(new Error());

      const { success, body } = await questionnairesService.getQuestionnaires(query);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("getOneQuestionnaire", () => {
    afterEach(() => {
      restore();
    });

    it("should be successful and returns the questionnaire", async () => {
      const questionnaire = newQuestionnaire();
      stub(questionnairesDao, "getOne").returns(questionnaire);

      const { success, body } = await questionnairesService.getOneQuestionnaire(questionnaire.id);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(questionnaire);
    });

    it("should be unsuccessful and returns errors if it throws", async () => {
      const questionnaire = newQuestionnaire();
      stub(questionnairesDao, "getOne").throws(new Error());

      const { success, body } = await questionnairesService.getOneQuestionnaire(questionnaire.id);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("deleteQuestionnaire", () => {
    afterEach(() => {
      restore();
    });

    it("should be successful and returns the deleted questionnaire", async () => {
      const questionnaire = newQuestionnaire();
      stub(questionnairesDao, "deleteOne").returns(questionnaire);

      const { success, body } = await questionnairesService.deleteQuestionnaire(questionnaire.id);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(questionnaire);
    });

    it("should be unsuccessful and returns errors if it throws", async () => {
      const questionnaire = newQuestionnaire();
      stub(questionnairesDao, "deleteOne").throws(new Error());

      const { success, body } = await questionnairesService.deleteQuestionnaire(questionnaire.id);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("updateQuestionnaire", () => {
    afterEach(() => {
      restore();
    });

    it("should be successful and returns the updated questionnaire", async () => {
      const questionnaireId = faker.datatype.uuid();
      const updatedQuestionnaire = newQuestionnaire();
      const questionnaire = newQuestionnaire({ id: questionnaireId });
      stub(questionnairesDao, "update").returns(questionnaire);

      const { success, body } = await questionnairesService.updateQuestionnaire(questionnaireId, updatedQuestionnaire);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(questionnaire);
      expect(questionnairesDao.update).to.have.been.calledOnceWith(questionnaireId, updatedQuestionnaire);
    });

    it("should be unsuccessful and returns errors if it throws", async () => {
      const questionnaireId = faker.datatype.uuid();
      const updatedQuestionnaire = newQuestionnaire();
      stub(questionnairesDao, "update").throws(new Error());

      const { success, body } = await questionnairesService.updateQuestionnaire(questionnaireId, updatedQuestionnaire);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
      expect(questionnairesDao.update).to.have.been.calledOnceWith(questionnaireId, updatedQuestionnaire);
    });

    it("should be unsuccessful and returns an error if the questionnaire is not found", async () => {
      const questionnaireId = faker.datatype.uuid();
      const updatedQuestionnaire = newQuestionnaire();
      stub(questionnairesDao, "update").returns(null);

      const { success, body } = await questionnairesService.updateQuestionnaire(questionnaireId, updatedQuestionnaire);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
      expect(questionnairesDao.update).to.have.been.calledOnceWith(questionnaireId, updatedQuestionnaire);
    });
  });
});
