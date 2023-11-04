const { use, expect } = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const httpTests = require("../integration/utils/httpTests");

const etablissementsDao = require("../../src/dao/etablissements.dao");
const { newEtablissement } = require("../fixtures");
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
    it("should create and returns the etablissement", async () => {
      const etablissement1 = newEtablissement();

      const createdEtablissement = await etablissementsDao.create(etablissement1);

      expect(createdEtablissement).to.deep.includes(etablissement1);
    });
  });
  describe("getAll", () => {
    it("should returns the etablissements", async () => {
      const etablissement1 = newEtablissement();
      const etablissement2 = newEtablissement();

      const createdEtablissement1 = await etablissementsDao.create(etablissement1);
      const createdEtablissement2 = await etablissementsDao.create(etablissement2);

      const etablissements = await etablissementsDao.getAll();

      expect(etablissements).to.have.lengthOf(2);
      expect(etablissements[0]).to.deep.includes(createdEtablissement1.toObject());
      expect(etablissements[1]).to.deep.includes(createdEtablissement2.toObject());
    });
    it("should returns the etablissements related to the query if it exists", async () => {
      const siret = "987654321";
      const etablissement1 = newEtablissement({ "data.siret": siret });
      const etablissement2 = newEtablissement();

      const createdEtablissement1 = await etablissementsDao.create(etablissement1);
      await etablissementsDao.create(etablissement2);

      const etablissements = await etablissementsDao.getAll({ "data.siret": siret });

      expect(etablissements).to.have.lengthOf(1);
      expect(etablissements[0]).to.deep.includes(createdEtablissement1.toObject());
    });
    it("should returns the etablissements that are not deleted", async () => {
      const etablissement1 = newEtablissement();
      const etablissement2 = newEtablissement({ deletedAt: new Date() });

      const createdEtablissement1 = await etablissementsDao.create(etablissement1);
      await etablissementsDao.create(etablissement2);

      const etablissements = await etablissementsDao.getAll();

      expect(etablissements).to.have.lengthOf(1);
      expect(etablissements[0]).to.deep.includes(createdEtablissement1.toObject());
    });
  });
  describe("getOne", () => {
    it("should return a single etablissement object with the given id", async () => {
      const etablissement = newEtablissement();
      const createdEtablissement = await etablissementsDao.create(etablissement);

      const result = await etablissementsDao.getOne(createdEtablissement._id);

      expect(result).to.deep.includes(createdEtablissement.toObject());
    });

    it("should return null if no etablissement exists with the given id", async () => {
      const result = await etablissementsDao.getOne("5f3f8d9d1c9d440000a3d3e9");

      expect(result).to.be.null;
    });
  });
  describe("deleteOne", () => {
    it("should deletes the etablissement", async () => {
      const etablissement1 = newEtablissement({}, true);
      await etablissementsDao.create(etablissement1);

      const deletedEtablissement = await etablissementsDao.deleteOne(etablissement1._id);

      expect(deletedEtablissement.modifiedCount).to.eql(1);
    });
  });
  describe("update", () => {
    it("should updates the etablissement", async () => {
      const etablissement1 = newEtablissement();
      const createdEtablissement = await etablissementsDao.create(etablissement1);

      createdEtablissement.formationIds = [faker.database.mongodbObjectId()];

      const updatedEtablissement = await etablissementsDao.update(createdEtablissement._id, createdEtablissement);

      expect(updatedEtablissement.modifiedCount).to.eql(1);
    });
  });
});
