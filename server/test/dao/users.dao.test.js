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
      const user1 = newUser({ password: "test123" });
      const createdUser = await usersDao.create(user1);
      const fetchedUser = await usersDao.getOne(createdUser._id);
      delete user1.password;

      expect(fetchedUser).to.deep.includes({ ...user1, refreshToken: [] });
    });
  });

  describe("update", () => {
    it("should updates the user", async () => {
      const user1 = newUser({ password: "test123" });
      const createdUser = await usersDao.create(user1);

      const newlastName = "nouveau nom";
      createdUser.lastName = newlastName;

      const updatedUser = await usersDao.update(createdUser._id, createdUser);

      expect(updatedUser.modifiedCount).to.eql(1);
    });
  });
  describe("create", () => {
    it("should create and returns the user", async () => {
      const user1 = newUser({ password: "test123" });
      const createdUser = await usersDao.create(user1);
      delete user1.password;

      expect(createdUser).to.deep.includes({ ...user1, refreshToken: [] });
    });
  });
});
