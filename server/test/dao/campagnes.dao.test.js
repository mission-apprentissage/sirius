const { use, expect } = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const httpTests = require("../integration/utils/httpTests");

const campagnesDao = require("../../src/dao/campagnes.dao");
const { newCampagne } = require("../fixtures");

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
  describe("getAll", () => {
    it("should returns the campagnes", async () => {
      const campagne1 = newCampagne({}, true);
      const campagne2 = newCampagne({}, true);

      await campagnesDao.create(campagne1);
      await campagnesDao.create(campagne2);

      const campagnes = await campagnesDao.getAll();

      expect(campagnes).to.have.deep.members([
        { ...campagne1, __v: 0, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
        { ...campagne2, __v: 0, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
      ]);
    });
  });
  describe("getOne", () => {
    it("should returns the campagne", async () => {
      const campagne1 = newCampagne({}, true);
      await campagnesDao.create(campagne1);

      const campagne = await campagnesDao.getOne(campagne1._id);

      expect(campagne).to.eql({ ...campagne1, __v: 0, createdAt: new Date(), updatedAt: new Date(), deletedAt: null });
    });
  });
  describe("create", () => {
    it("should create and returns the campagne", async () => {
      const campagne1 = newCampagne();

      const createdCampagne = await campagnesDao.create(campagne1);

      expect(createdCampagne.toObject()).to.eql({
        ...campagne1,
        _id: createdCampagne._id,
        __v: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
    });
  });
  describe("deleteOne", () => {
    it("should deletes the campagne", async () => {
      const campagne1 = newCampagne({}, true);
      await campagnesDao.create(campagne1);

      const deletedCampagne = await campagnesDao.deleteOne(campagne1._id);

      expect(deletedCampagne.modifiedCount).to.eql(1);
    });
  });
  describe("update", () => {
    it("should updates the campagne", async () => {
      const campagne1 = newCampagne();
      const createdCampagne = await campagnesDao.create(campagne1);

      const newNomCampagne = "nouveau nom";
      createdCampagne.nomCampagne = newNomCampagne;

      const updatedCampagne = await campagnesDao.update(createdCampagne._id, createdCampagne);

      expect(updatedCampagne.modifiedCount).to.eql(1);
    });
  });
});
