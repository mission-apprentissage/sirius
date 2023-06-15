const { expect } = require("chai");
const { stub, restore } = require("sinon");
const { newCampagne } = require("../fixtures");
const campagnesService = require("../../src/services/campagnes.service");
const campagnesDao = require("../../src/dao/campagnes.dao");

describe(__filename, () => {
  afterEach(() => {
    restore();
  });

  describe("getCampagnes", () => {
    it("should be successful and returns campagnes", async () => {
      const campagne = newCampagne();
      stub(campagnesDao, "getAllWithTemoignageCount").returns([campagne]);

      const { success, body } = await campagnesService.getCampagnes();

      expect(success).to.be.true;
      expect(body).to.be.an("array");
      expect(body[0]).to.deep.equal(campagne);
    });
    it("should be unsuccessful and returns errors if it throws", async () => {
      stub(campagnesDao, "getAllWithTemoignageCount").throws(new Error());

      const { success, body } = await campagnesService.getCampagnes();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("getOneCampagne", () => {
    it("should be successful and returns one campagne", async () => {
      const campagne = newCampagne({}, true);
      stub(campagnesDao, "getOneWithTemoignagneCount").returns([campagne]);

      const { success, body } = await campagnesService.getOneCampagne(campagne._id);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(campagne);
    });
    it("should be unsuccessful and returns errors if it throws", async () => {
      stub(campagnesDao, "getOneWithTemoignagneCount").throws(new Error());

      const { success, body } = await campagnesService.getOneCampagne();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("createCampagne", () => {
    it("should be successful and returns one campagne", async () => {
      const campagne = newCampagne();
      stub(campagnesDao, "create").returns(campagne);

      const { success, body } = await campagnesService.createCampagne(campagne);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(campagne);
    });
    it("should be unsuccessful and returns errors if it throws", async () => {
      stub(campagnesDao, "create").throws(new Error());

      const { success, body } = await campagnesService.createCampagne();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("deleteCampagne", () => {
    it("should be successful and returns the number of deleted campagne", async () => {
      const campagne = newCampagne({}, true);
      stub(campagnesDao, "deleteOne").returns({
        acknowledged: true,
        deletedCount: 1,
      });

      const { success, body } = await campagnesService.deleteCampagne(campagne._id);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal({
        acknowledged: true,
        deletedCount: 1,
      });
    });
    it("should be unsuccessful and returns errors if it throws", async () => {
      stub(campagnesDao, "deleteOne").throws(new Error());

      const { success, body } = await campagnesService.deleteCampagne();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("updateCampagne", () => {
    it("should be successful and returns one campagne", async () => {
      const campagne = newCampagne({}, true);
      const campagne2 = newCampagne();

      stub(campagnesDao, "update").returns({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      });

      const { success, body } = await campagnesService.updateCampagne(campagne._id, campagne2);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      });
    });
    it("should be unsuccessful and returns errors if it throws", async () => {
      stub(campagnesDao, "update").throws(new Error());

      const { success, body } = await campagnesService.updateCampagne();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
});
