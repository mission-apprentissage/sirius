const { use, expect } = require("chai");
const { stub, restore } = require("sinon");
const sinonChai = require("sinon-chai");
const { mockResponse } = require("mock-req-res");
const { getVerbatims, patchVerbatim } = require("../../src/controllers/verbatims.controller");
const verbatimsService = require("../../src/services/verbatims.service");
const { BasicError } = require("../../src/errors");

use(sinonChai);

describe(__filename, () => {
  const res = mockResponse();
  const next = stub();

  afterEach(async () => {
    restore();
    next.resetHistory();
    res.status.resetHistory();
    res.json.resetHistory();
  });

  describe("getVerbatims", () => {
    afterEach(() => {
      restore();
    });

    it("should return verbatims when successful", async () => {
      const req = { query: { someParam: "someValue" } };
      const res = { status: stub().returnsThis(), json: stub() };
      const expectedVerbatims = [{ id: 1, text: "Some verbatim" }];

      stub(verbatimsService, "getVerbatims").resolves({ success: true, body: expectedVerbatims, pagination: null });

      await getVerbatims(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({ body: expectedVerbatims, pagination: null })).to.be.true;
    });

    it("should throw an error when unsuccessful", async () => {
      const req = { query: { someParam: "someValue" } };
      const res = { status: stub().returnsThis(), json: stub() };
      stub(verbatimsService, "getVerbatims").resolves({ success: false });

      await getVerbatims(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
  });
  describe("patchVerbatim", () => {
    afterEach(() => {
      restore();
    });

    it("should return the updated verbatim when successful", async () => {
      const req = { params: { id: 1 }, body: { text: "Updated verbatim" } };
      const expectedVerbatim = { id: 1, text: "Updated verbatim" };
      const { success, body } = { success: true, body: expectedVerbatim };
      const patchVerbatimStub = stub(verbatimsService, "patchVerbatim").resolves({ success, body });
      const res = mockResponse();

      await patchVerbatim(req, res, next);

      expect(patchVerbatimStub).to.have.been.calledOnceWithExactly(req.params.id, req.body);
      expect(res.status).to.have.been.calledOnceWithExactly(200);
      expect(res.json).to.have.been.calledOnceWithExactly(expectedVerbatim);
    });

    it("should throw a BasicError when unsuccessful", async () => {
      const req = { params: { id: 1 }, body: { text: "Updated verbatim" } };
      const { success } = { success: false };
      const patchVerbatimStub = stub(verbatimsService, "patchVerbatim").resolves({ success });
      const next = stub();
      const res = mockResponse();

      await patchVerbatim(req, res, next);

      expect(patchVerbatimStub).to.have.been.calledOnceWithExactly(req.params.id, req.body);
      expect(next).to.have.been.calledOnce;
      expect(next.args[0][0]).to.be.an.instanceof(BasicError);
    });
  });
});
