const { use, expect } = require("chai");
const { stub, restore, spy } = require("sinon");
const sinonChai = require("sinon-chai");
const { mockRequest, mockResponse } = require("mock-req-res");
const {
  createFormation,
  getFormations,
  getFormation,
  deleteFormation,
  updateFormation,
} = require("../../src/controllers/formations.controller");
const formationsService = require("../../src/services/formations.service");
const { FormationAlreadyExistingError, FormationNotFoundError, BasicError, ErrorMessage } = require("../../src/errors");

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

  describe("createFormation", () => {
    const req = { body: { name: "Formation 1" } };
    const res = { status: stub().returns({ json: spy() }) };

    it("should create a new formation", async () => {
      const success = true;
      const body = { id: 1, name: "Formation 1" };
      stub(formationsService, "createFormation").resolves({ success, body });

      await createFormation(req, res);

      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.status().json.calledOnceWith(body)).to.be.true;
    });

    it("should throw a FormationAlreadyExistingError if the formation already exists", async () => {
      const success = false;
      const body = { message: ErrorMessage.FormationAlreadyExistingError };
      stub(formationsService, "createFormation").resolves({ success, body });

      await createFormation(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(FormationAlreadyExistingError);
    });

    it("should throw a BasicError if the formation creation fails for any other reason", async () => {
      const success = false;
      const body = { message: ErrorMessage.BasicError };
      stub(formationsService, "createFormation").resolves({ success, body });

      await createFormation(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
  });
  describe("getFormations", () => {
    const req = mockRequest({ query: { foo: "bar" } });

    it("should return a list of formations", async () => {
      const success = true;
      const body = [
        { id: 1, name: "Formation 1" },
        { id: 2, name: "Formation 2" },
      ];
      stub(formationsService, "getFormations").resolves({ success, body });

      await getFormations(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith(body)).to.be.true;
    });

    it("should throw a BasicError if the formations retrieval fails for any reason", async () => {
      const success = false;
      const body = { message: ErrorMessage.BasicError };
      stub(formationsService, "getFormations").resolves({ success, body });

      await getFormations(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
  });
  describe("getFormation", () => {
    it("should return the formation with the given id", async () => {
      const id = 1;
      const formation = { id, name: "Formation 1" };
      stub(formationsService, "getFormation").resolves({ success: true, body: formation });
      const req = { params: { id } };
      const res = mockResponse();

      await getFormation(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(formation);
    });

    it("should throw a BasicError if the formation retrieval fails for any reason", async () => {
      const id = 1;
      stub(formationsService, "getFormation").resolves({ success: false });
      const req = { params: { id } };
      const res = mockResponse();

      await getFormation(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
  });
  describe("deleteFormation", () => {
    const req = { params: { id: "123" } };
    const res = mockResponse();

    afterEach(() => {
      restore();
      res.status.resetHistory();
      res.json.resetHistory();
    });

    it("should delete a formation", async () => {
      const success = true;
      const body = { deletedCount: 1 };
      stub(formationsService, "deleteFormation").resolves({ success, body });

      await deleteFormation(req, res);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith(body)).to.be.true;
    });

    it("should throw a BasicError if the formation deletion fails for any reason", async () => {
      const success = false;
      stub(formationsService, "deleteFormation").resolves({ success });
      const next = stub();

      await deleteFormation(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });

    it("should throw a FormationNotFoundError if the formation does not exist", async () => {
      const success = true;
      const body = { deletedCount: 0 };
      stub(formationsService, "deleteFormation").resolves({ success, body });
      const next = stub();

      await deleteFormation(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(FormationNotFoundError);
    });
  });
  describe("updateFormation", () => {
    const req = { params: { id: "123" }, body: { name: "New Formation Name" } };
    const res = mockResponse();

    afterEach(() => {
      restore();
      res.status.resetHistory();
      res.json.resetHistory();
    });

    it("should update a formation", async () => {
      const success = true;
      const body = { modifiedCount: 1 };
      stub(formationsService, "updateFormation").resolves({ success, body });

      await updateFormation(req, res);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith(body)).to.be.true;
    });

    it("should throw a BasicError if the formation update fails for any reason", async () => {
      const success = false;
      const body = { message: ErrorMessage.BasicError };
      stub(formationsService, "updateFormation").resolves({ success, body });

      await updateFormation(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });

    it("should throw a FormationNotFoundError if the formation does not exist", async () => {
      const success = true;
      const body = { modifiedCount: 0 };
      stub(formationsService, "updateFormation").resolves({ success, body });
      const next = stub();

      await updateFormation(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(FormationNotFoundError);
    });
  });
});
