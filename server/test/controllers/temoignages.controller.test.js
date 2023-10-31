const { use, expect } = require("chai");
const { stub, restore } = require("sinon");
const sinonChai = require("sinon-chai");
const { mockRequest, mockResponse } = require("mock-req-res");
const {
  createTemoignage,
  getTemoignages,
  deleteTemoignage,
  updateTemoignage,
} = require("../../src/controllers/temoignages.controller");
const temoignagesService = require("../../src/services/temoignages.service");
const {
  BasicError,
  TemoignageNotFoundError,
  CampagneNotStarted,
  ErrorMessage,
  CampagneEnded,
  NoSeatsAvailable,
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

  describe("createTemoignage", () => {
    const req = mockRequest({ body: { nom: "test" } });

    it("should return a 201 status code and the created temoignage if successful", async () => {
      const expectedResponse = { id: 1, name: "Test temoignage" };
      stub(temoignagesService, "createTemoignage").resolves({ success: true, body: expectedResponse });

      await createTemoignage(req, res, next);

      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.status().json.calledOnceWith(expectedResponse)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should throw a CampagneNotStarted error if the campaign has not started", async () => {
      stub(temoignagesService, "createTemoignage").resolves({ success: false, body: ErrorMessage.CampagneNotStarted });

      await createTemoignage(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(CampagneNotStarted);
    });

    it("should throw a CampagneEnded error if the campaign has ended", async () => {
      stub(temoignagesService, "createTemoignage").resolves({ success: false, body: ErrorMessage.CampagneEnded });

      await createTemoignage(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(CampagneEnded);
    });

    it("should throw a NoSeatsAvailable error if there are no seats available", async () => {
      stub(temoignagesService, "createTemoignage").resolves({ success: false, body: ErrorMessage.NoSeatsAvailable });

      await createTemoignage(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(NoSeatsAvailable);
    });

    it("should throw a BasicError if the request fails for any other reason", async () => {
      stub(temoignagesService, "createTemoignage").resolves({ success: false });

      await createTemoignage(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
  });
  describe("getTemoignages", () => {
    const req = mockRequest({ query: { foo: "bar" } });

    it("should return a 200 status code and the temoignages if successful", async () => {
      const expectedResponse = [
        { id: 1, name: "Test temoignage 1" },
        { id: 2, name: "Test temoignage 2" },
      ];
      stub(temoignagesService, "getTemoignages").resolves({ success: true, body: expectedResponse });

      await getTemoignages(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.status().json.calledOnceWith(expectedResponse)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should throw a BasicError if the request fails for any reason", async () => {
      stub(temoignagesService, "getTemoignages").resolves({ success: false });

      await getTemoignages(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
  });
  describe("deleteTemoignage", () => {
    const req = mockRequest({ params: { id: "1" } });

    it("should return a 200 status code and the deleted temoignage if successful", async () => {
      const expectedResponse = { modifiedCount: 1 };
      stub(temoignagesService, "deleteTemoignage").resolves({
        success: true,
        body: expectedResponse,
      });

      await deleteTemoignage(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.status().json.calledOnceWith(expectedResponse)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should throw a TemoignageNotFoundError if the temoignage does not exist", async () => {
      stub(temoignagesService, "deleteTemoignage").resolves({ success: true, body: {}, modifiedCount: 0 });

      await deleteTemoignage(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(TemoignageNotFoundError);
    });

    it("should throw a BasicError if the request fails for any other reason", async () => {
      stub(temoignagesService, "deleteTemoignage").resolves({ success: false });

      await deleteTemoignage(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
  });
  describe("updateTemoignage", () => {
    const req = mockRequest({ params: { id: "1" }, body: { nom: "test" } });

    it("should return a 200 status code and the updated temoignage if successful", async () => {
      const expectedResponse = { id: 1, name: "Test temoignage" };
      stub(temoignagesService, "updateTemoignage").resolves({ success: true, body: expectedResponse });

      await updateTemoignage(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.status().json.calledOnceWith(expectedResponse)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should throw a CampagneNotStarted error if the campaign has not started", async () => {
      stub(temoignagesService, "updateTemoignage").resolves({ success: false, body: ErrorMessage.CampagneNotStarted });

      await updateTemoignage(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(CampagneNotStarted);
    });

    it("should throw a CampagneEnded error if the campaign has ended", async () => {
      stub(temoignagesService, "updateTemoignage").resolves({ success: false, body: ErrorMessage.CampagneEnded });

      await updateTemoignage(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(CampagneEnded);
    });

    it("should throw a NoSeatsAvailable error if there are no seats available", async () => {
      stub(temoignagesService, "updateTemoignage").resolves({ success: false, body: ErrorMessage.NoSeatsAvailable });

      await updateTemoignage(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(NoSeatsAvailable);
    });

    it("should throw a BasicError if the request fails for any other reason", async () => {
      stub(temoignagesService, "updateTemoignage").resolves({ success: false });

      await updateTemoignage(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
  });
});
