const { expect } = require("chai");
const { stub, restore } = require("sinon");
const { newEtablissement } = require("../fixtures");
const etablissementsService = require("../../src/services/etablissements.service");
const etablissementsDao = require("../../src/dao/etablissements.dao");

describe(__filename, () => {
  afterEach(async () => {
    restore();
  });

  describe("createEtablissement", () => {
    it("should be successful and returns created etablissement", async () => {
      const etablissement = newEtablissement();
      const stubbedGetAll = stub(etablissementsDao, "getAll").returns([]);
      const stubbedCreate = stub(etablissementsDao, "create").returns(etablissement);

      const { success, body } = await etablissementsService.createEtablissement(etablissement);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(etablissement);

      expect(stubbedGetAll).to.have.been.calledOnceWith({ "data._id": etablissement.data._id });
      expect(stubbedCreate).to.have.been.calledOnceWith(etablissement);
    });

    it("should be unsuccessful and returns error if etablissement already exists", async () => {
      const etablissement = newEtablissement();
      const stubbedGetAll = stub(etablissementsDao, "getAll").returns([etablissement]);

      const { success, body } = await etablissementsService.createEtablissement(etablissement);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
      expect(body.message).to.equal("Etablissement déjà existant");

      expect(stubbedGetAll).to.have.been.calledOnceWith({ "data._id": etablissement.data._id });
    });

    it("should be unsuccessful and returns error if etablissementsDao.create throws", async () => {
      const etablissement = newEtablissement();
      const stubbedGetAll = stub(etablissementsDao, "getAll").returns([]);
      const stubbedCreate = stub(etablissementsDao, "create").throws(new Error());

      const { success, body } = await etablissementsService.createEtablissement(etablissement);

      expect(success).to.be.false;
      expect(body).to.be.an("error");

      expect(stubbedGetAll).to.have.been.calledOnceWith({ "data._id": etablissement.data._id });
      expect(stubbedCreate).to.have.been.calledOnceWith(etablissement);
    });
  });
  describe("getEtablissements", () => {
    it("should be successful and returns etablissements", async () => {
      const etablissements = [newEtablissement(), newEtablissement()];
      const stubbedGetAll = stub(etablissementsDao, "getAll").returns(etablissements);

      const { success, body } = await etablissementsService.getEtablissements({});

      expect(success).to.be.true;
      expect(body).to.be.an("array");
      expect(body).to.deep.equal(etablissements);

      expect(stubbedGetAll).to.have.been.calledOnceWith({});
    });

    it("should be unsuccessful and returns error if etablissementsDao.getAll throws", async () => {
      const stubbedGetAll = stub(etablissementsDao, "getAll").throws(new Error());

      const { success, body } = await etablissementsService.getEtablissements({});

      expect(success).to.be.false;
      expect(body).to.be.an("error");

      expect(stubbedGetAll).to.have.been.calledOnceWith({});
    });
  });
  describe("getEtablissement", () => {
    it("should be successful and returns etablissement", async () => {
      const etablissement = newEtablissement();
      const stubbedGetOne = stub(etablissementsDao, "getOne").returns(etablissement);

      const { success, body } = await etablissementsService.getEtablissement(etablissement.data._id);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(etablissement);

      expect(stubbedGetOne).to.have.been.calledOnceWith(etablissement.data._id);
    });

    it("should be unsuccessful and returns error if etablissementsDao.getOne throws", async () => {
      const etablissement = newEtablissement();
      const stubbedGetOne = stub(etablissementsDao, "getOne").throws(new Error());

      const { success, body } = await etablissementsService.getEtablissement(etablissement.data._id);

      expect(success).to.be.false;
      expect(body).to.be.an("error");

      expect(stubbedGetOne).to.have.been.calledOnceWith(etablissement.data._id);
    });
  });
  describe("deleteEtablissement", () => {
    afterEach(() => {
      restore();
    });

    it("should be successful and returns deleted etablissement", async () => {
      const etablissement = newEtablissement();
      const stubbedDeleteOne = stub(etablissementsDao, "deleteOne").returns(etablissement);

      const { success, body } = await etablissementsService.deleteEtablissement(etablissement.data._id);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(etablissement);

      expect(stubbedDeleteOne).to.have.been.calledOnceWith(etablissement.data._id);
    });

    it("should be unsuccessful and returns error if etablissementsDao.deleteOne throws", async () => {
      const etablissement = newEtablissement();
      const stubbedDeleteOne = stub(etablissementsDao, "deleteOne").throws(new Error());

      const { success, body } = await etablissementsService.deleteEtablissement(etablissement.data._id);

      expect(success).to.be.false;
      expect(body).to.be.an("error");

      expect(stubbedDeleteOne).to.have.been.calledOnceWith(etablissement.data._id);
    });
  });
  describe("updateEtablissement", () => {
    afterEach(() => {
      restore();
    });

    it("should be successful and returns updated etablissement", async () => {
      const etablissement = newEtablissement();
      const updatedEtablissement = { ...etablissement, data: { ...etablissement.data, nom: "New Name" } };
      const stubbedUpdate = stub(etablissementsDao, "update").returns(updatedEtablissement);

      const { success, body } = await etablissementsService.updateEtablissement(
        etablissement.data._id,
        updatedEtablissement
      );

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(updatedEtablissement);

      expect(stubbedUpdate).to.have.been.calledOnceWith(etablissement.data._id, updatedEtablissement);
    });

    it("should be unsuccessful and returns error if etablissement not found", async () => {
      const etablissement = newEtablissement();
      const updatedEtablissement = { ...etablissement, data: { ...etablissement.data, nom: "New Name" } };
      const stubbedUpdate = stub(etablissementsDao, "update").returns(null);

      const { success, body } = await etablissementsService.updateEtablissement(
        etablissement.data._id,
        updatedEtablissement
      );

      expect(success).to.be.false;
      expect(body).to.be.an("error");
      expect(body.message).to.equal("Etablissement not found");

      expect(stubbedUpdate).to.have.been.calledOnceWith(etablissement.data._id, updatedEtablissement);
    });

    it("should be unsuccessful and returns error if etablissementsDao.update throws", async () => {
      const etablissement = newEtablissement();
      const updatedEtablissement = { ...etablissement, data: { ...etablissement.data, nom: "New Name" } };
      const stubbedUpdate = stub(etablissementsDao, "update").throws(new Error());

      const { success, body } = await etablissementsService.updateEtablissement(
        etablissement.data._id,
        updatedEtablissement
      );

      expect(success).to.be.false;
      expect(body).to.be.an("error");

      expect(stubbedUpdate).to.have.been.calledOnceWith(etablissement.data._id, updatedEtablissement);
    });
  });
});
