const { use, expect } = require("chai");
const { stub, restore, match } = require("sinon");
const sinonChai = require("sinon-chai");
const { mockRequest, mockResponse } = require("mock-req-res");

const temoignagesController = require("../../src/controllers/temoignages.controller");
const temoignagesService = require("../../src/services/temoignages.service");
const { BasicError, TemoignageNotFoundError } = require("../../src/errors");
const { newTemoignage } = require("../fixtures");

use(sinonChai);

describe(__filename, () => {
  const req = mockRequest();
  const res = mockResponse();
  const next = stub();

  const temoignage1 = newTemoignage();
  const temoignage2 = newTemoignage();

  afterEach(async () => {
    restore();
    next.resetHistory();
    res.status.resetHistory();
    res.json.resetHistory();
  });

  describe("createTemoignage", () => {
    it("should throw a BasicError if success is false", async () => {
      stub(temoignagesService, "createTemoignage").returns({ success: false, body: null });

      await temoignagesController.createTemoignage(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
    it("should returns the created temoignage and status 201 if success is true", async () => {
      stub(temoignagesService, "createTemoignage").returns({ success: true, body: temoignage1 });

      await temoignagesController.createTemoignage(req, res, next);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith(match(temoignage1));
    });
  });
  describe("getTemoignages", () => {
    it("should throw a BasicError if success is false", async () => {
      stub(temoignagesService, "getTemoignages").returns({ success: false, body: null });

      await temoignagesController.getTemoignages(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
    it("should returns temoignages and status 200 if success is true", async () => {
      stub(temoignagesService, "getTemoignages").returns({ success: true, body: [temoignage1, temoignage2] });

      await temoignagesController.getTemoignages(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(match([temoignage1, temoignage2]));
    });
  });
  describe("deleteTemoignage", () => {
    it("should throw a BasicError if success is false", async () => {
      stub(temoignagesService, "deleteTemoignage").returns({ success: false, body: null });

      await temoignagesController.deleteTemoignage(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
    it("should throw a TemoignageNotFoundError if modifiedCount is not 1", async () => {
      stub(temoignagesService, "deleteTemoignage").returns({ success: true, body: { modifiedCount: 0 } });

      await temoignagesController.deleteTemoignage(req, res, next);
      expect(next.getCall(0).args[0]).to.be.an.instanceof(TemoignageNotFoundError);
    });
    it("should returns the modifiedCount and status 200 if success is true", async () => {
      stub(temoignagesService, "deleteTemoignage").returns({ success: true, body: { modifiedCount: 1 } });

      await temoignagesController.deleteTemoignage(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(match({ modifiedCount: 1 }));
    });
  });
});
