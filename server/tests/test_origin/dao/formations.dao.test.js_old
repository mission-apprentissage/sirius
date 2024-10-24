const { use, expect } = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const httpTests = require("../integration/utils/httpTests");

const formationsDao = require("../../src/dao/formations.dao");
const { newFormation } = require("../fixtures");
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
    it("should create and returns the formation", async () => {
      const formation1 = newFormation();

      const createdFormation = await formationsDao.create(formation1);

      expect(createdFormation).to.deep.includes(formation1);
    });
  });
  describe("getAll", () => {
    it("should returns the formations", async () => {
      const formation1 = newFormation();
      const formation2 = newFormation();

      const createdFormation1 = await formationsDao.create(formation1);
      const createdFormation2 = await formationsDao.create(formation2);

      const formations = await formationsDao.getAll();

      expect(formations).to.have.lengthOf(2);
      expect(formations[0]).to.deep.includes(createdFormation1.toObject());
      expect(formations[1]).to.deep.includes(createdFormation2.toObject());
    });
    it("should returns the formations related to the query if it exists", async () => {
      const siret = "987654321";
      const formation1 = newFormation({ "data.siret": siret });
      const formation2 = newFormation();

      const createdFormation1 = await formationsDao.create(formation1);
      await formationsDao.create(formation2);

      const formations = await formationsDao.getAll({ "data.siret": siret });

      expect(formations).to.have.lengthOf(1);
      expect(formations[0]).to.deep.includes(createdFormation1.toObject());
    });
    it("should returns the formations related to the ids in query if it exists", async () => {
      const formation1 = newFormation();
      const formation2 = newFormation();
      const formation3 = newFormation();
      const formation4 = newFormation();

      const createdFormation1 = await formationsDao.create(formation1);
      const createdFormation2 = await formationsDao.create(formation2);
      const createdFormation3 = await formationsDao.create(formation3);
      await formationsDao.create(formation4);

      const query = { id: [createdFormation1._id, createdFormation2._id, createdFormation3._id] };

      const formations = await formationsDao.getAll(query);

      expect(formations).to.have.lengthOf(3);
      expect(formations[0]).to.deep.includes(createdFormation1.toObject());
      expect(formations[1]).to.deep.includes(createdFormation2.toObject());
      expect(formations[2]).to.deep.includes(createdFormation3.toObject());
    });
    it("should returns the formations that are not deleted", async () => {
      const formation1 = newFormation();
      const formation2 = newFormation({ deletedAt: new Date() });

      const createdFormation1 = await formationsDao.create(formation1);

      await formationsDao.create(formation2);

      const formations = await formationsDao.getAll();

      expect(formations).to.have.lengthOf(1);
      expect(formations[0]).to.deep.includes(createdFormation1.toObject());
    });
  });
  describe("getOne", () => {
    it("should return a single formation object with the given id", async () => {
      const formation = newFormation();
      const createdFormation = await formationsDao.create(formation);

      const result = await formationsDao.getOne(createdFormation._id);

      expect(result).to.deep.includes(createdFormation.toObject());
    });

    it("should return null if no formation exists with the given id", async () => {
      const result = await formationsDao.getOne("5f3f8d9d1c9d440000a3d3e9");

      expect(result).to.be.null;
    });
  });
  describe("getOneByDataId", () => {
    it("should return a single formation object with the given data id", async () => {
      const id = faker.database.mongodbObjectId();
      const formation = newFormation({
        "data._id": id,
      });

      const createdFormation = await formationsDao.create(formation);

      const result = await formationsDao.getOneByDataId(id);

      expect(result).to.deep.includes(createdFormation.toObject());
    });
  });
  describe("deleteOne", () => {
    it("should deletes the formation", async () => {
      const formation1 = newFormation();
      const createdFormation = await formationsDao.create(formation1);

      const deletedFormation = await formationsDao.deleteOne(createdFormation._id);

      expect(deletedFormation.deletedCount).to.eql(1);
    });
  });
  describe("update", () => {
    it("should updates the formation", async () => {
      const formation1 = newFormation();
      const createdFormation = await formationsDao.create(formation1);

      createdFormation.campagneId = faker.database.mongodbObjectId();

      const updatedFormation = await formationsDao.update(createdFormation._id, createdFormation);

      expect(updatedFormation.modifiedCount).to.eql(1);
    });
  });
});
