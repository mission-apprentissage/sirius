const { use, expect } = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const httpTests = require("../integration/utils/httpTests");

const questionnairesDao = require("../../src/dao/questionnaires.dao");
const usersDao = require("../../src/dao/users.dao");
const { newQuestionnaire, newUser } = require("../fixtures");

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
    it("should create and returns the questionnaire", async () => {
      const user = newUser({ password: "42" });

      const createdUser = await usersDao.create(user);

      const questionnaire1 = newQuestionnaire({ createdBy: createdUser._id });

      const createdQuestionnaire = await questionnairesDao.create(questionnaire1);

      expect(createdQuestionnaire).to.deep.includes(questionnaire1);
    });
  });
  describe("getAllWithCreatorName", () => {
    it("should returns the questionnaires with its creator name", async () => {
      const user = newUser({ password: "42" });

      const createdUser = await usersDao.create(user);

      const questionnaire1 = newQuestionnaire({ createdBy: createdUser._id });
      const questionnaire2 = newQuestionnaire({ createdBy: createdUser._id });

      const createdQuestionnaire1 = await questionnairesDao.create(questionnaire1);
      const createdQuestionnaire2 = await questionnairesDao.create(questionnaire2);

      const questionnaires = await questionnairesDao.getAllWithCreatorName();

      const expectedCreatedBy = {
        _id: createdUser._id,
        __v: 0,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
      };
      expect(questionnaires).to.have.lengthOf(2);
      expect(questionnaires[0]).to.deep.includes({
        ...createdQuestionnaire1.toObject(),
        createdBy: expectedCreatedBy,
      });
      expect(questionnaires[0].createdBy).to.deep.includes(expectedCreatedBy);
      expect(questionnaires[1]).to.deep.includes({
        ...createdQuestionnaire2.toObject(),
        createdBy: expectedCreatedBy,
      });
    });
    it("should returns the questionnaires related to the query if it exists", async () => {
      const nom = "test";
      const user = newUser({ password: "42" });

      const createdUser = await usersDao.create(user);

      const questionnaire1 = newQuestionnaire({ nom, createdBy: createdUser._id });
      const questionnaire2 = newQuestionnaire({ createdBy: createdUser._id });

      const createdQuestionnaire1 = await questionnairesDao.create(questionnaire1);
      await questionnairesDao.create(questionnaire2);

      const questionnaires = await questionnairesDao.getAllWithCreatorName({ nom });

      const expectedCreatedBy = {
        _id: createdUser._id,
        __v: 0,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
      };

      expect(questionnaires).to.have.lengthOf(1);
      expect(questionnaires[0]).to.deep.includes({
        ...createdQuestionnaire1.toObject(),
        createdBy: expectedCreatedBy,
      });
    });
    it("should returns the questionnaires that are not deleted", async () => {
      const user = newUser({ password: "42" });

      const createdUser = await usersDao.create(user);

      const questionnaire1 = newQuestionnaire({ createdBy: createdUser._id });
      const questionnaire2 = newQuestionnaire({ createdBy: createdUser._id, deletedAt: new Date() });

      const createdQuestionnaire1 = await questionnairesDao.create(questionnaire1);
      await questionnairesDao.create(questionnaire2);

      const questionnaires = await questionnairesDao.getAllWithCreatorName();

      const expectedCreatedBy = {
        _id: createdUser._id,
        __v: 0,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
      };

      expect(questionnaires).to.have.lengthOf(1);
      expect(questionnaires[0]).to.deep.includes({ ...createdQuestionnaire1.toObject(), createdBy: expectedCreatedBy });
    });
  });
  describe("deleteOne", () => {
    it("should deletes the questionnaire", async () => {
      const questionnaire1 = newQuestionnaire();
      const createdQuestionnaire = await questionnairesDao.create(questionnaire1);

      const deletedQuestionnaire = await questionnairesDao.deleteOne(createdQuestionnaire._id);

      expect(deletedQuestionnaire.modifiedCount).to.eql(1);
    });
  });
  describe("update", () => {
    it("should updates the questionnaire", async () => {
      const questionnaire1 = newQuestionnaire();
      const createdQuestionnaire = await questionnairesDao.create(questionnaire1);

      createdQuestionnaire.nom = "test";

      const updatedQuestionnaire = await questionnairesDao.update(createdQuestionnaire._id, createdQuestionnaire);

      expect(updatedQuestionnaire.modifiedCount).to.eql(1);
    });
  });
  describe("getOne", () => {
    it("should return a single questionnaire object with the given id", async () => {
      const questionnaire = newQuestionnaire();
      const createdQuestionnaire = await questionnairesDao.create(questionnaire);

      const result = await questionnairesDao.getOne(createdQuestionnaire._id);

      expect(result).to.deep.includes(createdQuestionnaire.toObject());
    });

    it("should return null if no questionnaire exists with the given id", async () => {
      const result = await questionnairesDao.getOne("5f3f8d9d1c9d440000a3d3e9");

      expect(result).to.be.null;
    });
  });
});
