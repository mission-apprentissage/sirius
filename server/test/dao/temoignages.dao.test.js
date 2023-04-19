const { use, expect } = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const httpTests = require("../integration/utils/httpTests");

const temoignagesDao = require("../../src/dao/temoignages.dao");
const { newTemoignage } = require("../fixtures");

use(sinonChai);

httpTests(__filename, ({ startServer }) => {
  before(async () => {
    await startServer();
  });
  beforeEach(async () => {
    sinon.useFakeTimers(new Date());
  });
  afterEach(async () => {
    sinon.restore();
  });
  describe("create", () => {
    it("should create and returns the temoignage", async () => {
      const temoignage1 = newTemoignage();

      const createdTemoignage = await temoignagesDao.create(temoignage1);

      expect(createdTemoignage.toObject()).to.eql({
        ...temoignage1,
        _id: createdTemoignage._id,
        __v: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
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
        { ...temoignage1, __v: 0, createdAt: new Date(), updatedAt: new Date() },
        { ...temoignage2, __v: 0, createdAt: new Date(), updatedAt: new Date() },
      ]);
    });
    it("should returns the temoignages related to the query if it exists", async () => {
      const temoignage1 = newTemoignage({ campagneId: "42" }, true);
      const temoignage2 = newTemoignage({ campagneId: "42" }, true);

      await temoignagesDao.create(temoignage1);
      await temoignagesDao.create(temoignage2);

      const temoignages = await temoignagesDao.getAll({ campagneId: "42" });

      expect(temoignages).to.have.deep.members([
        { ...temoignage1, __v: 0, createdAt: new Date(), updatedAt: new Date() },
        { ...temoignage2, __v: 0, createdAt: new Date(), updatedAt: new Date() },
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
