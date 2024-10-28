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
  describe("getOneByEmail", () => {
    it("should returns the user", async () => {
      const user1 = newUser({ password: "test123" });
      const createdUser = await usersDao.create(user1);
      const fetchedUser = await usersDao.getOneByEmail(createdUser.email);
      delete user1.password;
      delete user1.authStrategy;
      delete user1.refreshToken;

      expect(fetchedUser).to.deep.includes({ ...user1 });
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
  describe("getAll", () => {
    it("should return all users without refreshToken and authStrategy fields", async () => {
      const user1 = newUser({ password: "test123" });
      const user2 = newUser({ password: "test123" });

      await usersDao.create(user1);
      await usersDao.create(user2);

      delete user1.password;
      delete user2.password;
      delete user1.authStrategy;
      delete user2.authStrategy;
      delete user1.refreshToken;
      delete user2.refreshToken;

      const users = await usersDao.getAll();

      expect(users).to.have.lengthOf(2);
      expect(users[0]).to.deep.includes(user1);
      expect(users[0]).to.not.have.property("refreshToken");
      expect(users[0]).to.not.have.property("authStrategy");
      expect(users[1]).to.deep.includes(user2);
      expect(users[1]).to.not.have.property("refreshToken");
      expect(users[1]).to.not.have.property("authStrategy");
    });
  });
});
