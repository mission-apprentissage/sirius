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

  afterEach(async () => {
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
      const req = { query: { ids: "1,2,3" } };

      stub(campagnesService, "deleteCampagnes").returns({ success: false, body: null });

      await campagnesController.deleteCampagnes(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
    it("should throw a CampagneNotFoundError if deletedCount is not 1", async () => {
      const req = { query: { ids: "1,2,3" } };

      stub(campagnesService, "deleteCampagnes").returns({ success: true, body: { modifiedCount: 0 } });

      await campagnesController.deleteCampagnes(req, res, next);
      expect(next.getCall(0).args[0]).to.be.an.instanceof(CampagneNotFoundError);
    });
    it("should returns the deletedCount and status 200 if success is true", async () => {
      const req = { query: { ids: "1,2,3" } };

      stub(campagnesService, "deleteCampagnes").returns({ success: true, body: { modifiedCount: 1 } });

      await campagnesController.deleteCampagnes(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(match({ modifiedCount: 1 }));
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
  describe("createMultiCampagne", () => {
    it("should return a 201 status code and the created campagnes if successful", async () => {
      const req = { body: [{ name: "Campagne 1" }, { name: "Campagne 2" }] };
      const expectedResponse = [
        { id: 1, name: "Campagne 1" },
        { id: 2, name: "Campagne 2" },
      ];

      stub(campagnesService, "createMultiCampagne").resolves({ success: true, body: expectedResponse });

      await campagnesController.createMultiCampagne(req, res, next);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith(expectedResponse);
    });

    it("should throw a BasicError if unsuccessful", async () => {
      const req = { body: [{ name: "Campagne 1" }, { name: "Campagne 2" }] };

      stub(campagnesService, "createMultiCampagne").resolves({ success: false });

      await campagnesController.createMultiCampagne(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
  });
  describe("getExport", () => {
    const req = mockRequest({ params: { id: 1 } });

    it("should throw a BasicError if success is false", async () => {
      stub(campagnesService, "getExport").returns({ success: false, body: null });

      await campagnesController.getExport(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });

    it("should return the export and status 200 if success is true", async () => {
      const exportData = { data: "some data" };
      stub(campagnesService, "getExport").returns({ success: true, body: exportData });

      await campagnesController.getExport(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(exportData);
    });
  });
  describe("getMultipleExport", () => {
    it("should return a 200 status code and the exported data if successful", async () => {
      const req = {
        query: {
          ids: "1,2,3",
        },
        user: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
        },
      };
      const res = {
        status: stub().returnsThis(),
        json: stub(),
      };
      const expectedResponse = { data: "exported data" };
      stub(campagnesService, "getMultipleExport").resolves({ success: true, body: expectedResponse });

      await campagnesController.getMultipleExport(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(expectedResponse);
    });
    it("should throw a BasicError if unsuccessful", async () => {
      const req = {
        query: {
          ids: "1,2,3",
        },
        user: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
        },
      };
      const res = {
        status: stub().returnsThis(),
        json: stub(),
      };
      stub(campagnesService, "getMultipleExport").resolves({ success: false });
      await campagnesController.getMultipleExport(req, res, next);
      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
  });
});
