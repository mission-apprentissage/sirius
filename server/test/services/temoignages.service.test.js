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
});
