const { expect } = require("chai");
const { stub, restore } = require("sinon");
const { newFormation } = require("../fixtures");
const formationsService = require("../../src/services/formations.service");
const formationsDao = require("../../src/dao/formations.dao");

describe(__filename, () => {
  afterEach(async () => {
    restore();
  });

  describe("createFormation", async () => {
    it("should be successful and returns created formation", async () => {
      const formation = newFormation();
      stub(formationsDao, "getOneByDataId").returns([]);
      stub(formationsDao, "create").returns(formation);

      const { success, body } = await formationsService.createFormation(formation);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(formation);
    });
    it("should be unsuccessful and returns error if formation already exists", async () => {
      const formation = newFormation();
      stub(formationsDao, "getOneByDataId").returns([formation]);

      const { success, body } = await formationsService.createFormation(formation);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
      expect(body.message).to.equal("Formation déjà existante");
    });
    it("should be unsuccessful and returns error if it throws", async () => {
      const formation = newFormation();
      stub(formationsDao, "getOneByDataId").throws(new Error());

      const { success, body } = await formationsService.createFormation(formation);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("getFormations", async () => {
    it("should be successful and returns formations", async () => {
      const formations = [newFormation(), newFormation()];
      stub(formationsDao, "getAll").returns(formations);

      const { success, body } = await formationsService.getFormations();

      expect(success).to.be.true;
      expect(body).to.be.an("array");
      expect(body).to.deep.equal(formations);
    });
    it("should be unsuccessful and returns error if it throws", async () => {
      stub(formationsDao, "getAll").throws(new Error());

      const { success, body } = await formationsService.getFormations();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  it("should be successful and returns formation", async () => {
    const formation = newFormation();
    stub(formationsDao, "getOne").returns(formation);

    const { success, body } = await formationsService.getFormation(1);

    expect(success).to.be.true;
    expect(body).to.be.an("object");
    expect(body).to.deep.equal(formation);
  });

  it("should be unsuccessful and returns error if it throws", async () => {
    stub(formationsDao, "getOne").throws(new Error());

    const { success, body } = await formationsService.getFormation(1);

    expect(success).to.be.false;
    expect(body).to.be.an("error");
  });
  describe("deleteFormation", async () => {
    it("should be successful and returns deleted formation", async () => {
      const formation = newFormation();
      stub(formationsDao, "deleteOne").returns(formation);

      const { success, body } = await formationsService.deleteFormation(1);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(formation);
    });

    it("should be unsuccessful and returns error if it throws", async () => {
      stub(formationsDao, "deleteOne").throws(new Error());

      const { success, body } = await formationsService.deleteFormation(1);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("updateFormation", () => {
    it("should be successful and returns updated formation", async () => {
      const formation = newFormation();
      const updatedFormation = { ...formation, title: "Updated Title" };
      stub(formationsDao, "update").returns(updatedFormation);

      const { success, body } = await formationsService.updateFormation(1, updatedFormation);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(updatedFormation);
    });

    it("should be unsuccessful and returns error if formation not found", async () => {
      const updatedFormation = newFormation();
      stub(formationsDao, "update").returns(null);

      const { success, body } = await formationsService.updateFormation(1, updatedFormation);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
      expect(body.message).to.equal("Formation not found");
    });

    it("should be unsuccessful and returns error if it throws", async () => {
      const updatedFormation = newFormation();
      stub(formationsDao, "update").throws(new Error());

      const { success, body } = await formationsService.updateFormation(1, updatedFormation);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
});
