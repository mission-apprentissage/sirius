const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);

const errorMiddleware = require("../../src/middlewares/errorMiddleware");
const Boom = require("@hapi/boom");

describe(__filename, () => {
  let sandbox;
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    mockRequest = {
      err: null,
    };

    mockResponse = {
      status: sandbox.stub().returnsThis(),
      send: sandbox.stub().returnsThis(),
    };

    nextFunction = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should handle a Boom error", () => {
    const boomError = new Boom.Boom("Boom Error", { statusCode: 400 });
    boomError.isBoom = true;
    mockRequest.err = boomError;

    errorMiddleware()(boomError, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).to.have.been.calledWith(400);
    expect(mockResponse.send).to.have.been.calledWith(boomError.output.payload);
  });

  it("should handle a ValidationError and return a 400 status", () => {
    const validationError = new Error("ValidationError");
    validationError.name = "ValidationError";
    validationError.details = "Error details";
    mockRequest.err = validationError;

    errorMiddleware()(validationError, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).to.have.been.calledWith(400);
    expect(mockResponse.send).to.have.been.calledOnce;
    expect(mockResponse.send).to.have.been.calledWith(sinon.match.has("details", "Error details"));
  });

  it("should handle an unknown error and return a 500 status", () => {
    const unknownError = new Error("Unknown error");
    mockRequest.err = unknownError;

    errorMiddleware()(unknownError, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).to.have.been.calledWith(500);
    expect(mockResponse.send).to.have.been.calledOnce;
  });
});
