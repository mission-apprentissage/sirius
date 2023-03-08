const { use, expect } = require("chai");
const { mockRequest, mockResponse } = require("mock-req-res");
const { stub, restore } = require("sinon");
const sinonChai = require("sinon-chai");
const passport = require("passport");

const { verifyUser, passportCallback } = require("../../src/middlewares/verifyUserMiddleware");
const { UnauthorizedError } = require("../../src/errors");

use(sinonChai);

describe(__filename, () => {
  const req = mockRequest();
  const res = mockResponse();
  const next = stub();

  afterEach(() => {
    restore();
    next.resetHistory();
  });

  describe("passportCallback", () => {
    it("should return the user and call next", async () => {
      const user = { _id: "123" };
      const error = null;

      const callback = passportCallback(req, res, next);
      callback(error, user);

      expect(req.user).to.eql(user);
      expect(next).to.have.been.calledWith();
    });
    it("should return an UnauthorizedError if there is an error", async () => {
      const user = { _id: "123" };
      const error = true;

      const callback = passportCallback(req, res, next);
      callback(error, user);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(UnauthorizedError);
    });
    it("should return an UnauthorizedError if there is no user provided", async () => {
      const user = null;
      const error = null;

      const callback = passportCallback(req, res, next);
      callback(error, user);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(UnauthorizedError);
    });
  });

  describe("verifyUser", () => {
    require("../../src/modules/authStrategies/jwtStrategy");
    require("../../src/modules/authStrategies/localStrategy");

    it("should call passport.authenticate with the local strategy for login routes", async () => {
      const authenticate = stub(passport, "authenticate").returns(() => {});
      req.url = "/api/users/login";

      verifyUser(req, res, next);

      expect(authenticate.getCall(0).args[0]).to.eql("local");
    });

    it("should call passport.authenticate with the JWT strategy for other routes", async () => {
      const authenticate = stub(passport, "authenticate").returns(() => {});
      req.url = "/api/users/logout";

      verifyUser(req, res, next);

      expect(authenticate.getCall(0).args[0]).to.eql("jwt");
    });
  });
});
