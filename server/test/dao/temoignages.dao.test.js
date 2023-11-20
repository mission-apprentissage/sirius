const { use, expect } = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const httpTests = require("../integration/utils/httpTests");

const temoignagesDao = require("../../src/dao/temoignages.dao");
const campagnesDao = require("../../src/dao/campagnes.dao");
const { newTemoignage, newCampagne } = require("../fixtures");
const { faker } = require("@faker-js/faker");

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

      expect(createdTemoignage).to.deep.includes(temoignage1);
    });
  });
  describe("getAll", () => {
    it("should returns the temoignages", async () => {
      const temoignage1 = newTemoignage();
      const temoignage2 = newTemoignage();

      const createdTemoignage1 = await temoignagesDao.create(temoignage1);
      const createdTemoignage2 = await temoignagesDao.create(temoignage2);

      const temoignages = await temoignagesDao.getAll();

      expect(temoignages).to.have.lengthOf(2);
      expect(temoignages[0]).to.deep.includes(createdTemoignage1.toObject());
      expect(temoignages[1]).to.deep.includes(createdTemoignage2.toObject());
    });
    it("should returns the temoignages related to the query if it exists", async () => {
      const id = faker.database.mongodbObjectId();
      const temoignage1 = newTemoignage({ campagneId: id });
      const temoignage2 = newTemoignage();

      const createdTemoignage1 = await temoignagesDao.create(temoignage1);
      await temoignagesDao.create(temoignage2);

      const temoignages = await temoignagesDao.getAll({ campagneId: id });

      expect(temoignages).to.have.lengthOf(1);
      expect(temoignages[0]).to.deep.includes(createdTemoignage1.toObject());
    });
    it("should returns the temoignages that are not deleted", async () => {
      const temoignage1 = newTemoignage();
      const temoignage2 = newTemoignage({ deletedAt: new Date() });

      const createdTemoignage1 = await temoignagesDao.create(temoignage1);
      await temoignagesDao.create(temoignage2);

      const temoignages = await temoignagesDao.getAll();

      expect(temoignages).to.have.lengthOf(1);
      expect(temoignages[0]).to.deep.includes(createdTemoignage1.toObject());
    });
  });
  describe("deleteOne", () => {
    it("should deletes the temoignage", async () => {
      const temoignage1 = newTemoignage({}, true);
      await temoignagesDao.create(temoignage1);

      const deletedTemoignage = await temoignagesDao.deleteOne(temoignage1._id);

      expect(deletedTemoignage.modifiedCount).to.eql(1);
    });
  });
  describe("update", () => {
    it("should updates the temoignage", async () => {
      const temoignage1 = newTemoignage();
      const createdTemoignage = await temoignagesDao.create(temoignage1);

      createdTemoignage.campagneId = faker.database.mongodbObjectId();

      const updatedTemoignage = await temoignagesDao.update(createdTemoignage._id, createdTemoignage);

      expect(updatedTemoignage.modifiedCount).to.eql(1);
    });
  });
  describe("countByCampagne", () => {
    it("should return the count of temoignages for a campagne", async () => {
      const campagne = newCampagne();
      const createdCampagne = await campagnesDao.create(campagne);

      const temoignage1 = newTemoignage({ campagneId: createdCampagne._id });
      const temoignage2 = newTemoignage({ campagneId: createdCampagne._id });

      await temoignagesDao.create(temoignage1);
      await temoignagesDao.create(temoignage2);

      const result = await temoignagesDao.countByCampagne(createdCampagne._id);

      expect(result).to.eql(2);
    });
  });
  describe("getOne", () => {
    it("should return a single temoignage object with the given id", async () => {
      const temoignage = newTemoignage();
      const createdTemoignage = await temoignagesDao.create(temoignage);

      const result = await temoignagesDao.getOne(createdTemoignage._id);

      expect(result).to.deep.includes(createdTemoignage.toObject());
    });

    it("should return null if no temoignage exists with the given id", async () => {
      const result = await temoignagesDao.getOne("5f3f8d9d1c9d440000a3d3e9");

      expect(result).to.be.null;
    });
  });
});
