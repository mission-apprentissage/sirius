const { expect } = require("chai");
const { stub, restore } = require("sinon");
const jwt = require("jsonwebtoken");

const { newUser } = require("../fixtures");
const usersService = require("../../src/services/users.service");
const usersDao = require("../../src/dao/users.dao");
const { getToken, getRefreshToken } = require("../../src/utils/authenticate.utils");
const { ErrorMessage } = require("../../src/errors");
const config = require("../../src/config");
const User = require("../../src/models/user.model");

describe(__filename, () => {
  afterEach(async () => {
    restore();
  });

  describe("createUser", () => {
    it("should be successful and returns the created user", async () => {
      const user = newUser({}, true);
      const usersDaoCreateStub = stub(usersDao, "create").returns(user);

      const { success, body } = await usersService.createUser(user);

      expect(usersDaoCreateStub.getCall(0).args[0]).to.eql(user);
      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(user);
    });
    it("should be unsuccessful and returns error if create DAO throws", async () => {
      const user = newUser({}, true);
      stub(usersDao, "create").throws(new Error());

      const { success, body } = await usersService.createUser(user);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
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
  describe("getUsers", () => {
    afterEach(() => {
      restore();
    });

    it("should be successful and returns all users", async () => {
      const users = [newUser(), newUser()];
      const usersDaoGetAllStub = stub(usersDao, "getAll").returns(users);

      const { success, body } = await usersService.getUsers();

      expect(usersDaoGetAllStub.calledOnce).to.be.true;
      expect(success).to.be.true;
      expect(body).to.be.an("array");
      expect(body).to.deep.equal(users);
    });

    it("should be unsuccessful and returns error if getAll DAO throws", async () => {
      stub(usersDao, "getAll").throws(new Error());

      const { success, body } = await usersService.getUsers();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("updateUser", () => {
    afterEach(() => {
      restore();
    });

    it("should be successful and returns the updated user", async () => {
      const user = newUser({}, true);
      const usersDaoUpdateStub = stub(usersDao, "update").returns(user);

      const { success, body } = await usersService.updateUser(user._id, user);

      expect(usersDaoUpdateStub.getCall(0).args[0]).to.eql(user._id);
      expect(usersDaoUpdateStub.getCall(0).args[1]).to.eql(user);
      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(user);
    });

    it("should be unsuccessful and returns error if update DAO throws", async () => {
      const user = newUser({}, true);
      stub(usersDao, "update").throws(new Error());

      const { success, body } = await usersService.updateUser(user._id, user);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("forgotPassword", () => {
    afterEach(() => {
      restore();
    });

    it("should be successful and returns the user if found", async () => {
      const email = "test@example.com";
      const user = newUser({ email }, true);
      const usersDaoGetOneByEmailStub = stub(usersDao, "getOneByEmail").returns(user);

      const { success, body } = await usersService.forgotPassword(email);

      expect(usersDaoGetOneByEmailStub.getCall(0).args[0]).to.eql(email);
      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(user);
    });

    it("should be unsuccessful and returns error if user not found", async () => {
      const email = "test@example.com";
      stub(usersDao, "getOneByEmail").returns(null);

      const { success, body } = await usersService.forgotPassword(email);

      expect(success).to.be.false;
      expect(body).to.be.equal(ErrorMessage.UserNotFound);
    });

    it("should be unsuccessful and returns error if getOneByEmail DAO throws", async () => {
      const email = "test@example.com";
      stub(usersDao, "getOneByEmail").throws(new Error());

      const { success, body } = await usersService.forgotPassword(email);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("resetPassword", () => {
    it("should be successful and returns the updated user", async () => {
      const token = jwt.sign({ email: "test@example.com" }, config.auth.jwtSecret);
      const password = "newPassword";
      const user = newUser({ email: "test@example.com" }, true);
      const userFindByUsernameStub = stub(User, "findByUsername").returns({
        ...user,
        setPassword: () => user,
        save: () => user,
      });

      const { success, body } = await usersService.resetPassword(token, password);

      expect(userFindByUsernameStub.getCall(0).args[0]).to.eql("test@example.com");
      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(user);
    });

    it("should be unsuccessful and returns error if token is invalid", async () => {
      const token = "invalidToken";
      const password = "newPassword";

      const { success, body } = await usersService.resetPassword(token, password);

      expect(success).to.be.false;
      expect(body.message).to.eql("jwt malformed");
    });

    it("should be unsuccessful and returns error if user is not found", async () => {
      const token = jwt.sign({ email: "test@example.com" }, config.auth.jwtSecret);
      const password = "newPassword";
      const userFindByUsernameStub = stub(User, "findByUsername").returns(null);
      const { success, body } = await usersService.resetPassword(token, password);

      expect(success).to.be.false;
      expect(userFindByUsernameStub.getCall(0).args[0]).to.eql("test@example.com");
      expect(body).to.be.equal(ErrorMessage.UserNotFound);
    });

    it("should be unsuccessful and returns error if setPassword throws", async () => {
      const token = jwt.sign({ email: "test@example.com" }, config.auth.jwtSecret);
      const password = "newPassword";
      const user = newUser({ email: "test@example.com" }, true);
      stub(User, "findByUsername").returns({
        ...user,
        setPassword: () => {
          throw new Error();
        },
      });

      const { success, body } = await usersService.resetPassword(token, password);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("confirmUser", () => {
    it("should be successful and returns the updated user", async () => {
      const token = jwt.sign({ email: "test@example.com" }, config.auth.jwtSecret);
      const user = newUser({ email: "test@example.com" }, true);
      const usersFindByUsernameStub = stub(User, "findByUsername").returns(user);

      const usersDaoUpdateStub = stub(usersDao, "update").returns(user);

      const { success, body } = await usersService.confirmUser(token);

      expect(usersDaoUpdateStub.getCall(0).args[0]).to.eql(user.id);
      expect(usersDaoUpdateStub.getCall(0).args[1]).to.eql({ ...user, emailConfirmed: true });
      expect(usersFindByUsernameStub.getCall(0).args[0]).to.eql("test@example.com");
      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal({ ...user, emailConfirmed: true });
    });

    it("should be unsuccessful and returns error if token is invalid", async () => {
      const token = "invalidToken";

      const { success, body } = await usersService.confirmUser(token);

      expect(success).to.be.false;
      expect(body.message).to.eql("jwt malformed");
    });

    it("should be unsuccessful and returns error if findByUsername DAO throws", async () => {
      const token = jwt.sign({ email: "test@example.com" }, config.auth.jwtSecret);
      stub(User, "findByUsername").throws(new Error());

      const { success, body } = await usersService.confirmUser(token);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });

    it("should be unsuccessful and returns error if update DAO throws", async () => {
      const token = jwt.sign({ email: "test@example.com" }, config.auth.jwtSecret);
      const user = newUser({ email: "test@example.com" }, true);
      stub(User, "findByUsername").returns(user);
      stub(usersDao, "update").throws(new Error());

      const { success, body } = await usersService.confirmUser(token);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("getUserById", () => {
    afterEach(() => {
      restore();
    });

    it("should be successful and returns the user", async () => {
      const user = newUser({}, true);
      const usersDaoGetOneStub = stub(usersDao, "getOne").returns(user);

      const { success, body } = await usersService.getUserById(user._id);

      expect(usersDaoGetOneStub.getCall(0).args[0]).to.eql(user._id);
      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(user);
    });

    it("should be unsuccessful and returns error if getOne DAO throws", async () => {
      stub(usersDao, "getOne").throws(new Error());

      const { success, body } = await usersService.getUserById();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
});
