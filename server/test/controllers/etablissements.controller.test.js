const { use, expect } = require("chai");
const { stub, restore } = require("sinon");
const sinonChai = require("sinon-chai");
const { mockRequest, mockResponse } = require("mock-req-res");

const sinon = require("sinon");
const {
  createEtablissement,
  getEtablissements,
  getEtablissement,
  deleteEtablissement,
  updateEtablissement,
} = require("../../src/controllers/etablissements.controller");
const etablissementsService = require("../../src/services/etablissements.service");
const {
  EtablissementAlreadyExistingError,
  BasicError,
  EtablissementNotFoundError,
  ErrorMessage,
} = require("../../src/errors");

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

  describe("createEtablissement", () => {
    const req = mockRequest({ body: { nom: "test" } });

    it("should create a new etablissement and return it with a 201 status code", async () => {
      const expectedResponse = { id: 1, name: "Test Etablissement" };
      sinon.stub(etablissementsService, "createEtablissement").resolves({ success: true, body: expectedResponse });

      await createEtablissement(req, res, next);

      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.status().json.calledOnceWith(expectedResponse)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should throw an EtablissementAlreadyExistingError if the etablissement already exists", async () => {
      sinon.stub(etablissementsService, "createEtablissement").resolves({
        success: false,
        body: { message: ErrorMessage.EtablissementAlreadyExistingError },
      });

      await createEtablissement(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(EtablissementAlreadyExistingError);
    });

    it("should throw a BasicError if there is an error creating the etablissement", async () => {
      sinon.stub(etablissementsService, "createEtablissement").resolves({ success: false });

      await createEtablissement(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
  });
  describe("getEtablissements", () => {
    const req = mockRequest({ query: { siret: "1" } });

    it("should return a list of etablissements with a 200 status code", async () => {
      const expectedResponse = [
        { id: 1, name: "Test Etablissement 1" },
        { id: 2, name: "Test Etablissement 2" },
      ];
      sinon.stub(etablissementsService, "getEtablissements").resolves({ success: true, body: expectedResponse });
      req.query = {};

      await getEtablissements(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.status().json.calledOnceWith(expectedResponse)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should throw a BasicError if there is an error getting the etablissements", async () => {
      sinon.stub(etablissementsService, "getEtablissements").resolves({ success: false });
      req.query = {};

      await getEtablissements(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
  });
  describe("getEtablissement", () => {
    const req = mockRequest({ params: { id: "1" } });

    it("should return the etablissement with a 200 status code if it exists", async () => {
      const expectedResponse = { id: 1, name: "Test Etablissement" };
      sinon.stub(etablissementsService, "getEtablissement").resolves({ success: true, body: expectedResponse });

      await getEtablissement(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.status().json.calledOnceWith(expectedResponse)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should throw a BasicError if the etablissement does not exist", async () => {
      sinon.stub(etablissementsService, "getEtablissement").resolves({ success: false });

      await getEtablissement(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
  });
  describe("deleteEtablissement", () => {
    const req = mockRequest({ params: { id: "1" } });

    it("should delete an etablissement and return it with a 200 status code", async () => {
      const expectedResponse = { modifiedCount: 1 };
      sinon.stub(etablissementsService, "deleteEtablissement").resolves({ success: true, body: expectedResponse });

      await deleteEtablissement(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.status().json.calledOnceWith(expectedResponse)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should throw a BasicError if there is an error deleting the etablissement", async () => {
      sinon.stub(etablissementsService, "deleteEtablissement").resolves({ success: false });

      await deleteEtablissement(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });

    it("should throw an EtablissementNotFoundError if the etablissement does not exist", async () => {
      const expectedResponse = { modifiedCount: 0 };
      sinon.stub(etablissementsService, "deleteEtablissement").resolves({ success: true, body: expectedResponse });

      await deleteEtablissement(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(EtablissementNotFoundError);
    });
  });
  describe("updateEtablissement", () => {
    const req = mockRequest({ params: { id: "1" }, body: { name: "New Etablissement Name" } });

    it("should update an existing etablissement and return it with a 200 status code", async () => {
      const expectedResponse = { modifiedCount: 1 };
      sinon.stub(etablissementsService, "updateEtablissement").resolves({ success: true, body: expectedResponse });

      await updateEtablissement(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.status().json.calledOnceWith(expectedResponse)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should throw a BasicError if there is an error updating the etablissement", async () => {
      sinon.stub(etablissementsService, "updateEtablissement").resolves({ success: false });

      await updateEtablissement(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });

    it("should throw an EtablissementNotFoundError if the etablissement does not exist", async () => {
      const expectedResponse = { modifiedCount: 0 };
      sinon.stub(etablissementsService, "updateEtablissement").resolves({ success: true, body: expectedResponse });

      await updateEtablissement(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(EtablissementNotFoundError);
    });
  });
});
