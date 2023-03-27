const { use, expect } = require("chai");
const sinonChai = require("sinon-chai");
const httpTests = require("../integration/utils/httpTests");

const temoignagesDao = require("../../src/dao/temoignages.dao");
const { newTemoignage } = require("../fixtures");

use(sinonChai);

httpTests(__filename, ({ startServer }) => {
  before(async () => {
    await startServer();
  });
  describe("create", () => {
    it("should create and returns the temoignage", async () => {
      const temoignage1 = newTemoignage();

      const createdTemoignage = await temoignagesDao.create(temoignage1);

      expect(createdTemoignage.toObject()).to.eql({ ...temoignage1, _id: createdTemoignage._id, __v: 0 });
    });
  });
  describe("getAll", () => {
    it("should returns the temoignages", async () => {
      const temoignage1 = newTemoignage({}, true);
      const temoignage2 = newTemoignage({}, true);

      await temoignagesDao.create(temoignage1);
      await temoignagesDao.create(temoignage2);

      const temoignages = await temoignagesDao.getAll();

      expect(temoignages).to.have.deep.members([
        { ...temoignage1, __v: 0 },
        { ...temoignage2, __v: 0 },
      ]);
    });
  });
  describe("deleteOne", () => {
    it("should deletes the temoignage", async () => {
      const temoignage1 = newTemoignage({}, true);
      await temoignagesDao.create(temoignage1);

      const deletedTemoignage = await temoignagesDao.deleteOne(temoignage1._id);

      expect(deletedTemoignage.deletedCount).to.eql(1);
    });
  });
});
