const { expect } = require("chai");
const { stub, restore } = require("sinon");

const { newUser } = require("../fixtures");
const usersService = require("../../src/services/users.service");
const usersDao = require("../../src/dao/users.dao");
const { getToken, getRefreshToken } = require("../../src/utils/authenticate.utils");

describe(__filename, () => {
  afterEach(async () => {
    restore();
  });

  describe("loginUser", () => {
    it("should be successful and returns the token and refresh token", async () => {
      const user = newUser({}, true);
      const userGetOneStub = stub(usersDao, "getOne").returns(user);
      const userUpdateStub = stub(usersDao, "update");

      const { success, body } = await usersService.loginUser(user._id);

      const tokenPayload = {
        _id: user._id.toString(),
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        etablissements: user.etablissements,
      };

      expect(userGetOneStub.getCall(0).args[0]).to.eql(user._id);
      expect(userUpdateStub.getCall(0).args[0]).to.eql(user._id);
      expect(userUpdateStub.getCall(0).args[1]).to.eql(user);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal({
        token: getToken(tokenPayload),
        refreshToken: getRefreshToken(tokenPayload),
      });
    });
    it("should be unsuccessful and returns error if getOne DAO throws", async () => {
      stub(usersDao, "getOne").throws(new Error());

      const { success, body } = await usersService.loginUser();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
    it("should be unsuccessful and returns error if getOne throws", async () => {
      stub(usersDao, "getOne");
      stub(usersDao, "update").throws(new Error());

      const { success, body } = await usersService.loginUser();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("refreshTokenUser", () => {
    it("should be successful and returns the token and the new refresh token", async () => {
      const user = newUser({}, true);
      user.refreshToken[0].refreshToken = getRefreshToken({ _id: user._id });
      const userGetOneStub = stub(usersDao, "getOne").returns(user);
      stub(usersDao, "update");

      const { success, body } = await usersService.refreshTokenUser(user.refreshToken[0].refreshToken);

      const tokenPayload = {
        _id: user._id.toString(),
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        etablissements: user.etablissements,
      };

      expect(userGetOneStub.getCall(0).args[0]).to.eql(user._id.toString());
      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal({
        token: getToken(tokenPayload),
        newRefreshToken: getRefreshToken(tokenPayload),
      });
    });
    it("should be unsuccessful and returns error if getOne DAO throws", async () => {
      const user = newUser({}, true);
      user.refreshToken[0].refreshToken = getRefreshToken({ _id: user._id });
      stub(usersDao, "getOne").throws(new Error());
      stub(usersDao, "update");

      const { success, body } = await usersService.refreshTokenUser(user.refreshToken[0].refreshToken);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
    it("should be unsuccessful and returns error if update throws", async () => {
      const user = newUser({}, true);
      user.refreshToken[0].refreshToken = getRefreshToken({ _id: user._id });
      stub(usersDao, "getOne").returns(user);
      stub(usersDao, "update").throws(new Error());

      const { success, body } = await usersService.refreshTokenUser(user.refreshToken[0].refreshToken);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("logoutUser", () => {
    it("should be successful and returns the token and the new refresh token", async () => {
      const user = newUser({}, true);
      user.refreshToken[0].refreshToken = getRefreshToken({ _id: user._id });

      const userGetOneStub = stub(usersDao, "getOne").returns(user);
      stub(usersDao, "update");

      const { success, body } = await usersService.logoutUser(user._id.toString(), user.refreshToken);

      expect(userGetOneStub.getCall(0).args[0]).to.eql(user._id.toString());
      expect(success).to.be.true;
      expect(body).to.deep.equal({});
    });
    it("should be unsuccessful and returns error if getOne DAO throws", async () => {
      const user = newUser({}, true);
      user.refreshToken[0].refreshToken = getRefreshToken({ _id: user._id });
      stub(usersDao, "getOne").throws(new Error());
      stub(usersDao, "update");

      const { success, body } = await usersService.logoutUser(user._id.toString(), user.refreshToken);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
    it("should be unsuccessful and returns error if update throws", async () => {
      const user = newUser({}, true);
      user.refreshToken[0].refreshToken = getRefreshToken({ _id: user._id });
      stub(usersDao, "getOne").returns(user);
      stub(usersDao, "update").throws(new Error());

      const { success, body } = await usersService.logoutUser(user._id.toString(), user.refreshToken);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
});
