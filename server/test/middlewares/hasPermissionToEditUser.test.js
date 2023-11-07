const { expect } = require("chai");
const sinon = require("sinon");
const { hasPermissionToEditUser } = require("../../src/middlewares/hasPermissionToEditUser");
const { USER_ROLES, USER_STATUS } = require("../../src/constants");
const { UnauthorizedError } = require("../../src/errors");

describe(__filename, () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "123" },
      user: { _id: "123", status: USER_STATUS.ACTIVE, role: USER_ROLES.USER },
      body: {},
    };
    res = {};
    next = sinon.spy();
  });

  it("should allow an admin to edit any user", () => {
    req.user.role = USER_ROLES.ADMIN;
    hasPermissionToEditUser(req, res, next);
    expect(next.calledOnce).to.be.true;
  });

  it("should allow a user to edit their own account", () => {
    req.params.id = "123";
    hasPermissionToEditUser(req, res, next);
    expect(next.calledOnce).to.be.true;
  });

  it("should not allow a user to edit another user's account", () => {
    req.params.id = "456";
    hasPermissionToEditUser(req, res, next);
    expect(next.calledOnce).to.be.true;
    expect(next.getCall(0).args[0]).to.be.an.instanceof(UnauthorizedError);
  });
  it("should not allow a user to change their own status or role", () => {
    req.body.status = USER_STATUS.INACTIVE;
    hasPermissionToEditUser(req, res, next);
    expect(next.calledOnce).to.be.true;
    expect(next.getCall(0).args[0]).to.be.an.instanceof(UnauthorizedError);

    req.body = { role: USER_ROLES.ADMIN };
    hasPermissionToEditUser(req, res, next);
    expect(next.calledTwice).to.be.true;
    expect(next.getCall(0).args[0]).to.be.an.instanceof(UnauthorizedError);
  });

  it("should return an UnauthorizedError if the user is not active", () => {
    req.user.status = USER_STATUS.INACTIVE;
    hasPermissionToEditUser(req, res, next);
    expect(next.getCall(0).args[0]).to.be.an.instanceof(UnauthorizedError);
  });
});
