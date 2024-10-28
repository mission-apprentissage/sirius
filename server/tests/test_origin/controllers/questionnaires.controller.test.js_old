const { use, expect } = require("chai");
const { stub, restore } = require("sinon");
const sinonChai = require("sinon-chai");
const { mockRequest, mockResponse } = require("mock-req-res");
const questionnairesService = require("../../src/services/questionnaires.service");
const {
  createQuestionnaire,
  getQuestionnaires,
  getQuestionnaire,
  deleteQuestionnaire,
  updateQuestionnaire,
} = require("../../src/controllers/questionnaires.controller");
const { BasicError, QuestionnaireNotFoundError } = require("../../src/errors");
const { USER_ROLES } = require("../../src/constants");

use(sinonChai);

describe(__filename, () => {
  const res = mockResponse();
  const next = stub();
  afterEach(async () => {
    restore();
    next.resetHistory();
    res.status.resetHistory();
    res.json.resetHistory();
  });

  describe("createQuestionnaire", () => {
    const req = mockRequest({ body: { nom: "test" } });

    it("should return 201 status code and the created questionnaire", async () => {
      const expectedResponse = { id: 1, name: "Test Questionnaire" };
      stub(questionnairesService, "createQuestionnaire").resolves({ success: true, body: expectedResponse });

      await createQuestionnaire(req, res, next);

      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.status().json.calledOnceWith(expectedResponse)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should throw a BasicError if there is an error creating the questionnaire", async () => {
      stub(questionnairesService, "createQuestionnaire").resolves({ success: false });

      await createQuestionnaire(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
  });
  describe("getQuestionnaires", () => {
    const req = mockRequest({ query: {}, user: { role: USER_ROLES.ETABLISSEMENT } });

    it("should return 200 status code and the list of questionnaires", async () => {
      const expectedResponse = [
        { id: 1, name: "Questionnaire 1" },
        { id: 2, name: "Questionnaire 2" },
      ];
      stub(questionnairesService, "getQuestionnaires").resolves({ success: true, body: expectedResponse });

      await getQuestionnaires(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.status().json.calledOnceWith(expectedResponse)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should return 200 status code and the list of questionnaires if user is not admin", async () => {
      const expectedResponse = [
        { id: 1, name: "Questionnaire 1" },
        { id: 2, name: "Questionnaire 2" },
      ];
      stub(questionnairesService, "getQuestionnaires").resolves({ success: true, body: expectedResponse });
      const req = mockRequest({ query: {}, user: { role: USER_ROLES.ETABLISSEMENT } });

      await getQuestionnaires(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.status().json.calledOnceWith(expectedResponse)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should throw a BasicError if there is an error getting the questionnaires", async () => {
      stub(questionnairesService, "getQuestionnaires").resolves({ success: false });

      await getQuestionnaires(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
  });
  describe("getQuestionnaire", () => {
    const req = mockRequest({ params: { id: 1 } });

    it("should return 200 status code and the questionnaire", async () => {
      const expectedResponse = { id: 1, name: "Test Questionnaire" };
      stub(questionnairesService, "getOneQuestionnaire").resolves({ success: true, body: expectedResponse });

      await getQuestionnaire(req, res);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith(expectedResponse)).to.be.true;
    });

    it("should throw a BasicError if there is an error getting the questionnaire", async () => {
      stub(questionnairesService, "getOneQuestionnaire").resolves({ success: false });

      await getQuestionnaire(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });

    it("should throw a QuestionnaireNotFoundError if the questionnaire does not exist", async () => {
      stub(questionnairesService, "getOneQuestionnaire").resolves({ success: true, body: null });

      await getQuestionnaire(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(QuestionnaireNotFoundError);
    });
  });
  describe("deleteQuestionnaire", () => {
    const req = mockRequest({ params: { id: 1 } });

    it("should return 200 status code and the deleted questionnaire", async () => {
      const expectedResponse = { modifiedCount: 1 };
      stub(questionnairesService, "deleteQuestionnaire").resolves({
        success: true,
        body: expectedResponse,
      });

      await deleteQuestionnaire(req, res);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith(expectedResponse)).to.be.true;
    });

    it("should throw a BasicError if there is an error deleting the questionnaire", async () => {
      stub(questionnairesService, "deleteQuestionnaire").resolves({ success: false });

      await deleteQuestionnaire(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });

    it("should throw a QuestionnaireNotFoundError if the questionnaire does not exist", async () => {
      stub(questionnairesService, "deleteQuestionnaire").resolves({ success: true, body: { modifiedCount: 0 } });

      await deleteQuestionnaire(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(QuestionnaireNotFoundError);
    });
  });
  describe("updateQuestionnaire", () => {
    const req = mockRequest({ params: { id: 1 }, body: { nom: "test" } });

    it("should return 200 status code and the updated questionnaire", async () => {
      const expectedResponse = { id: 1, name: "Test Questionnaire" };
      stub(questionnairesService, "updateQuestionnaire").resolves({ success: true, body: expectedResponse });

      await updateQuestionnaire(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith(expectedResponse)).to.be.true;
    });

    it("should throw a BasicError if there is an error updating the questionnaire", async () => {
      stub(questionnairesService, "updateQuestionnaire").resolves({ success: false });

      await updateQuestionnaire(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
  });
});
