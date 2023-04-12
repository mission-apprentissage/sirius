const { expect } = require("chai");
const { stub, restore } = require("sinon");
const { newTemoignage } = require("../fixtures");
const temoignagesService = require("../../src/services/temoignages.service");
const temoignagesDao = require("../../src/dao/temoignages.dao");

describe(__filename, () => {
  afterEach(() => {
    restore();
  });

  describe("createTemoignage", () => {
    it("should be successful and returns one temoignage", async () => {
      const temoignage = newTemoignage();
      stub(temoignagesDao, "create").returns(temoignage);

      const { success, body } = await temoignagesService.createTemoignage(temoignage);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(temoignage);
    });
    it("should be unsuccessful and returns errors if it throws", async () => {
      stub(temoignagesDao, "create").throws(new Error());

      const { success, body } = await temoignagesService.createTemoignage();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("getTemoignages", () => {
    it("should be successful and returns temoignages", async () => {
      const temoignage = newTemoignage();
      stub(temoignagesDao, "getAll").returns([temoignage]);

      const { success, body } = await temoignagesService.getTemoignages();

      expect(success).to.be.true;
      expect(body).to.be.an("array");
      expect(body[0]).to.deep.equal(temoignage);
    });
    it("should be unsuccessful and returns errors if it throws", async () => {
      stub(temoignagesDao, "getAll").throws(new Error());

      const { success, body } = await temoignagesService.getTemoignages();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("deleteTemoignage", () => {
    it("should be successful and returns the number of deleted temoignage", async () => {
      const temoignage = newTemoignage({}, true);
      stub(temoignagesDao, "deleteOne").returns({
        acknowledged: true,
        deletedCount: 1,
      });

      const { success, body } = await temoignagesService.deleteTemoignage(temoignage._id);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal({
        acknowledged: true,
        deletedCount: 1,
      });
    });
    it("should be unsuccessful and returns errors if it throws", async () => {
      stub(temoignagesDao, "deleteOne").throws(new Error());

      const { success, body } = await temoignagesService.deleteTemoignage();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
});
