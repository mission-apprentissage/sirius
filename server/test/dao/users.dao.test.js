const { use, expect } = require("chai");
const sinonChai = require("sinon-chai");
const httpTests = require("../integration/utils/httpTests");

const usersDao = require("../../src/dao/users.dao");
const { newUser } = require("../fixtures");

use(sinonChai);

httpTests(__filename, ({ startServer }) => {
  before(async () => {
    await startServer();
  });
  describe("getOne", () => {
    it("should returns the user", async () => {
      const user1 = newUser({}, true);
      await usersDao.create(user1);

      const user = await usersDao.getOne(user1._id);

      expect(user).to.eql({ ...user1, __v: 0 });
    });
  });

  describe("update", () => {
    it("should updates the user", async () => {
      const user1 = newUser();
      const createdUser = await usersDao.create(user1);

      const newlastName = "nouveau nom";
      createdUser.lastName = newlastName;

      const updatedUser = await usersDao.update(createdUser._id, createdUser);

      expect(updatedUser.modifiedCount).to.eql(1);
    });
  });
  describe("create", () => {
    it("should create and returns the user", async () => {
      const user1 = newUser();

      const createdUser = await usersDao.create(user1);

      expect(createdUser.toObject()).to.eql({ ...user1, _id: createdUser._id, __v: 0 });
    });
  });
});
