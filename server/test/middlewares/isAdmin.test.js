const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;

const { isAdmin } = require("../../src/middlewares/isAdmin");
const { UnauthorizedError } = require("../../src/errors");
const { USER_ROLES, USER_STATUS } = require("../../src/constants");
chai.use(sinonChai);

describe(__filename, () => {
  let res, next;

  beforeEach(() => {
    res = {};
    next = sinon.spy();
  });

  it("should call next if user is an admin and active", async () => {
    const req = {
      user: {
        role: USER_ROLES.ADMIN,
        status: USER_STATUS.ACTIVE,
      },
    };

    await isAdmin(req, res, next);

    expect(next.calledOnce).to.be.true;
  });

  it("should call next with UnauthorizedError if user is not an admin", async () => {
    const req = {
      user: {
        role: USER_ROLES.ETABLISSEMENT,
        status: USER_STATUS.ACTIVE,
      },
    };

    await isAdmin(req, {}, next);

    expect(next.getCall(0).args[0]).to.be.an.instanceof(UnauthorizedError);
  });

  it("should call next with UnauthorizedError if user is not active", async () => {
    const req = {
      user: {
        role: USER_ROLES.ADMIN,
        status: USER_STATUS.INACTIVE,
      },
    };

    await isAdmin(req, {}, next);

    expect(next.getCall(0).args[0]).to.be.an.instanceof(UnauthorizedError);
  });
});
