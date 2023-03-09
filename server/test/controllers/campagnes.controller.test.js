const { use, expect } = require("chai");
const { stub, restore, match } = require("sinon");
const sinonChai = require("sinon-chai");
const { mockRequest, mockResponse } = require("mock-req-res");

const campagnesController = require("../../src/controllers/campagnes.controller");
const campagnesService = require("../../src/services/campagnes.service");
const { BasicError, CampagneNotFoundError } = require("../../src/errors");
const { newCampagne } = require("../fixtures");

use(sinonChai);

describe(__filename, () => {
  const req = mockRequest();
  const res = mockResponse();
  const next = stub();

  const campagne1 = newCampagne();
  const campagne2 = newCampagne();

  afterEach(() => {
    restore();
    next.resetHistory();
    res.status.resetHistory();
    res.json.resetHistory();
  });

  describe("getCampagnes", () => {
    it("should throw a BasicError if success is false", async () => {
      stub(campagnesService, "getCampagnes").returns({ success: false, body: null });

      await campagnesController.getCampagnes(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
    it("should returns campagnes and status 200 if success is true", async () => {
      stub(campagnesService, "getCampagnes").returns({ success: true, body: [campagne1, campagne2] });

      await campagnesController.getCampagnes(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(match([campagne1, campagne2]));
    });
  });
  describe("getCampagne", () => {
    it("should throw a BasicError if success is false", async () => {
      stub(campagnesService, "getOneCampagne").returns({ success: false, body: null });

      await campagnesController.getCampagne(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
    it("should throw a CampagneNotFoundError if success is true but there's no body", async () => {
      stub(campagnesService, "getOneCampagne").returns({ success: true, body: null });

      await campagnesController.getCampagne(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(CampagneNotFoundError);
    });
    it("should returns the campagne and status 200 if success is true", async () => {
      stub(campagnesService, "getOneCampagne").returns({ success: true, body: campagne1 });

      await campagnesController.getCampagne(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(match(campagne1));
    });
  });
  describe("createCampagne", () => {
    it("should throw a BasicError if success is false", async () => {
      stub(campagnesService, "createCampagne").returns({ success: false, body: null });

      await campagnesController.createCampagne(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
    it("should returns the created campagne and status 201 if success is true", async () => {
      stub(campagnesService, "createCampagne").returns({ success: true, body: campagne1 });

      await campagnesController.createCampagne(req, res, next);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith(match(campagne1));
    });
  });
  describe("deleteCampagne", () => {
    it("should throw a BasicError if success is false", async () => {
      stub(campagnesService, "deleteCampagne").returns({ success: false, body: null });

      await campagnesController.deleteCampagne(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
    it("should throw a CampagneNotFoundError if deletedCount is not 1", async () => {
      stub(campagnesService, "deleteCampagne").returns({ success: true, body: { deletedCount: 0 } });

      await campagnesController.deleteCampagne(req, res, next);
      expect(next.getCall(0).args[0]).to.be.an.instanceof(CampagneNotFoundError);
    });
    it("should returns the deletedCount and status 200 if success is true", async () => {
      stub(campagnesService, "deleteCampagne").returns({ success: true, body: { deletedCount: 1 } });

      await campagnesController.deleteCampagne(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(match({ deletedCount: 1 }));
    });
  });
  describe("updateCampagne", () => {
    it("should throw a BasicError if success is false", async () => {
      stub(campagnesService, "updateCampagne").returns({ success: false, body: null });

      await campagnesController.updateCampagne(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
    it("should returns the updated campagne and status 200 if success is true", async () => {
      stub(campagnesService, "updateCampagne").returns({ success: true, body: campagne1 });

      await campagnesController.updateCampagne(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(match(campagne1));
    });
  });
});
