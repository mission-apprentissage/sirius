const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
const validator = require("../../src/middlewares/validatorMiddleware");

chai.use(sinonChai);

describe("validatorMiddleware", () => {
  let next;

  beforeEach(() => {
    next = sinon.spy();
    sinon.restore();
  });

  it("should call next if validation succeeds", () => {
    const schema = {
      validate: () => ({ error: null }),
    };
    const req = { body: {} };

    validator(schema)(req, null, next);

    expect(next.calledOnce).to.be.true;
    expect(next.args[0]).to.eql([]);
  });

  it("should call next with error if validation fails", () => {
    const schema = {
      validate: () => ({ error: new Error("Validation error") }),
    };
    const req = { body: {} };

    validator(schema)(req, null, next);

    expect(next.calledOnce).to.be.true;
    expect(next.getCall(0).args[0].message).to.be.eql("Validation error");
  });
});
