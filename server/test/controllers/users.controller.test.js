const { use, expect } = require("chai");
const { stub, restore, match, reset } = require("sinon");
const sinonChai = require("sinon-chai");
const { mockRequest, mockResponse } = require("mock-req-res");
const { faker } = require("@faker-js/faker");
const ObjectId = require("mongoose").mongo.ObjectId;

const usersController = require("../../src/controllers/users.controller");
const usersService = require("../../src/services/users.service");
const { BasicError, UnauthorizedError } = require("../../src/errors");
const { newUser } = require("../fixtures");
const { COOKIE_OPTIONS } = require("../../src/utils/authenticate.utils");

use(sinonChai);

describe(__filename, () => {
  const req = mockRequest();
  const res = mockResponse();
  const next = stub();

  const user1 = newUser();

  afterEach(async () => {
    next.resetHistory();
    res.status.resetHistory();
    res.json.resetHistory();
    res.cookie.resetHistory();
    res.clearCookie.resetHistory();
    restore();
    reset();
  });

  describe("loginUser", () => {
    it("should throw a BasicError if success is false", async () => {
      req.user = { _id: ObjectId(faker.database.mongodbObjectId()) };
      stub(usersService, "loginUser").returns({ success: false });

      await usersController.loginUser(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
    it("should returns the cookie and token if success is true", async () => {
      req.user = { _id: ObjectId(faker.database.mongodbObjectId()) };

      const token = faker.datatype.uuid();
      const refreshToken = faker.datatype.uuid();

      stub(usersService, "loginUser").returns({
        success: true,
        body: { token, refreshToken },
      });

      await usersController.loginUser(req, res, next);

      expect(res.cookie).to.have.been.calledWith("refreshToken", refreshToken, COOKIE_OPTIONS);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(match({ success: true, token }));
    });
  });
  describe("refreshTokenUser", () => {
    it("should throw an UnauthorizedError if there is no refreshToken in payload", async () => {
      req.signedCookies = { refreshToken: null };

      await usersController.refreshTokenUser(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(UnauthorizedError);
    });
    it("should throw a BasicError if success is false", async () => {
      req.signedCookies = { refreshToken: faker.datatype.uuid() };

      stub(usersService, "refreshTokenUser").returns({ success: false });

      await usersController.refreshTokenUser(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
    it("should returns the cookie and token if success is true", async () => {
      req.signedCookies = { refreshToken: faker.datatype.uuid() };

      const token = faker.datatype.uuid();
      const newRefreshToken = faker.datatype.uuid();

      stub(usersService, "refreshTokenUser").returns({
        success: true,
        body: { token, newRefreshToken: newRefreshToken },
      });

      await usersController.refreshTokenUser(req, res, next);

      expect(res.cookie).to.have.been.calledWith("refreshToken", newRefreshToken, COOKIE_OPTIONS);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(match({ success: true, token }));
    });
  });
  describe("getCurrentUser", () => {
    it("should returns the user with status 200", async () => {
      req.user = user1;

      await usersController.getCurrentUser(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWithMatch({ _id: req.user._id, ...user1 });
    });
  });
  describe("logoutUser", () => {
    it("should throw an UnauthorizedError if there is no refreshToken in payload", async () => {
      req.signedCookies = { refreshToken: null };

      await usersController.logoutUser(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(UnauthorizedError);
    });
    it("should throw a BasicError if success is false", async () => {
      req.signedCookies = { refreshToken: faker.datatype.uuid() };
      req.user = user1;

      stub(usersService, "logoutUser").returns({ success: false });

      await usersController.logoutUser(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
    it("should remove the cookie if success is true", async () => {
      req.signedCookies = { refreshToken: faker.datatype.uuid() };
      req.user = user1;

      stub(usersService, "logoutUser").returns({
        success: true,
      });

      await usersController.logoutUser(req, res, next);

      expect(res.clearCookie).to.have.been.calledWith("refreshToken", COOKIE_OPTIONS);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(match({ success: true }));
    });
  });
});
