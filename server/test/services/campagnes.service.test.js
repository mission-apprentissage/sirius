const { expect } = require("chai");
const { stub, restore } = require("sinon");
const ObjectId = require("mongoose").mongo.ObjectId;
const {
  newCampagne,
  newTemoignage,
  newQuestionnaire,
  newFormation,
  newEtablissement,
  newUser,
} = require("../fixtures");
const campagnesService = require("../../src/services/campagnes.service");
const campagnesDao = require("../../src/dao/campagnes.dao");
const formationsDao = require("../../src/dao/formations.dao");
const etablissementsDao = require("../../src/dao/etablissements.dao");
const temoignagesDao = require("../../src/dao/temoignages.dao");
const pdfExport = require("../../src/modules/pdfExport");
const { DIPLOME_TYPE_MATCHER, ETABLISSEMENT_NATURE } = require("../../src/constants");
const referentiel = require("../../src/modules/referentiel");

describe(__filename, () => {
  afterEach(async () => {
    restore();
  });

  describe("getCampagnes", async () => {
    "should be successful and returns campagnes with champsLibreRate ans medianDurationInMs",
      async () => {
        const expectedMedianDurationInMs = 100;
        const expectedChampsLibreRate = 50;

        const questionnaire = newQuestionnaire();

        const temoignage = newTemoignage({
          createdAt: new Date("2023-10-25T08:00:00.000Z"),
          lastQuestionAt: new Date("2023-10-25T08:00:00.100Z"),
          reponses: {
            peurChangementConseil: "test verbatim",
          },
        });

        const campagne = newCampagne({ temoignagesList: [temoignage] });

        const stubbedCampagneReturned = { ...campagne, questionnaireUI: questionnaire.questionnaireUI };

        stub(referentiel, "getEtablissementNature").returns(ETABLISSEMENT_NATURE.GESTIONNAIRE);
        stub(referentiel, "getEtablissementSIRETFromRelationType").returns(["987654321"]);
        stub(campagnesDao, "getAllWithTemoignageCountAndTemplateName").returns([stubbedCampagneReturned]);

        const { success, body } = await campagnesService.getCampagnes({ siret: "123456789" });

        expect(success).to.be.true;
        expect(body).to.be.an("array");
        expect(body[0]).to.deep.equal(stubbedCampagneReturned);
        expect(body[0]).to.not.have.property("temoignagesList");
        expect(body[0].medianDurationInMs).to.equal(expectedMedianDurationInMs);
        expect(body[0].champsLibreRate).to.equal(expectedChampsLibreRate);
      };
    it("should be unsuccessful and returns errors if it throws", async () => {
      stub(campagnesDao, "getAllWithTemoignageCountAndTemplateName").throws(new Error());

      const { success, body } = await campagnesService.getCampagnes();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("getOneCampagne", () => {
    it("should be successful and returns one campagne", async () => {
      const campagne = newCampagne({ temoignagesList: [] });
      stub(campagnesDao, "getOneWithTemoignagneCountAndTemplateName").returns([campagne]);

      const { success, body } = await campagnesService.getOneCampagne(campagne._id);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(campagne);
    });
    it("should be unsuccessful and returns errors if it throws", async () => {
      stub(campagnesDao, "getOneWithTemoignagneCountAndTemplateName").throws(new Error());

      const { success, body } = await campagnesService.getOneCampagne();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("createCampagne", () => {
    it("should be successful and returns one campagne", async () => {
      const campagne = newCampagne();
      stub(campagnesDao, "create").returns(campagne);

      const { success, body } = await campagnesService.createCampagne(campagne);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(campagne);
    });
    it("should be unsuccessful and returns errors if it throws", async () => {
      stub(campagnesDao, "create").throws(new Error());

      const { success, body } = await campagnesService.createCampagne();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("deleteCampagnes", () => {
    afterEach(() => {
      restore();
    });

    it("should delete campagnes, temoignages, and update etablissements", async () => {
      const ids = ["campagneId1", "campagneId2"];

      const deletedCampagnes = { acknowledged: true, deletedCount: 2 };
      const deletedFormationsIds = ["formationId1", "formationId2"];

      stub(campagnesDao, "deleteMany").resolves(deletedCampagnes);
      stub(temoignagesDao, "deleteManyByCampagneId").resolves();
      stub(formationsDao, "deleteManyByCampagneIdAndReturnsTheDeletedFormationId").resolves(deletedFormationsIds);
      stub(etablissementsDao, "updateByFormationIds").resolves();

      const result = await campagnesService.deleteCampagnes(ids);

      expect(result.success).to.be.true;
      expect(result.body).to.deep.equal(deletedCampagnes);

      expect(campagnesDao.deleteMany).to.have.been.calledOnceWithExactly(ids);
      expect(temoignagesDao.deleteManyByCampagneId).to.have.been.calledOnceWithExactly(ids);
      expect(formationsDao.deleteManyByCampagneIdAndReturnsTheDeletedFormationId).to.have.been.calledOnceWithExactly(
        ids
      );
      expect(etablissementsDao.updateByFormationIds).to.have.been.calledOnceWithExactly(deletedFormationsIds);
    });

    it("should handle errors", async () => {
      const ids = ["campagneId1", "campagneId2"];
      const error = new Error("Delete error");

      stub(campagnesDao, "deleteMany").rejects(error);

      const result = await campagnesService.deleteCampagnes(ids);

      expect(result.success).to.be.false;
      expect(result.body).to.equal(error);
      expect(campagnesDao.deleteMany).to.have.been.calledOnceWithExactly(ids);
    });
  });
  describe("updateCampagne", () => {
    it("should be successful and returns one campagne", async () => {
      const campagne = newCampagne({}, true);
      const campagne2 = newCampagne();

      stub(campagnesDao, "update").returns({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      });

      const { success, body } = await campagnesService.updateCampagne(campagne._id, campagne2);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      });
    });
    it("should be unsuccessful and returns errors if it throws", async () => {
      stub(campagnesDao, "update").throws(new Error());

      const { success, body } = await campagnesService.updateCampagne();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("createMultiCampagne", () => {
    it("should be successful, create campagnes create related formations, update related etablissement and returns createdCount", async () => {
      const user = newUser({}, true);

      const formation1 = newFormation({ createdBy: user._id.toString() }, true);
      const formation2 = newFormation({ createdBy: user._id.toString() }, true);

      const campagne1 = newCampagne({ formation: formation1 }, true);
      const campagne2 = newCampagne({ formation: formation2 }, true);

      const etablissement = newEtablissement();

      const stubCreatedCampagne = stub(campagnesDao, "create");
      const stubbedCreatedCampagne1 = stubCreatedCampagne.onCall(0).returns(campagne1);
      const stubbedCreatedCampagne2 = stubCreatedCampagne.onCall(1).returns(campagne2);

      const stubCreatedFormation = stub(formationsDao, "create");
      const stubbedCreatedFormation1 = stubCreatedFormation.onCall(0).returns(formation1);
      const stubbedCreatedFormation2 = stubCreatedFormation.onCall(1).returns(formation2);

      const stubGetAllEtablissement = stub(etablissementsDao, "getAll").returns([etablissement]);
      const stubUpdateEtablissement = stub(etablissementsDao, "update");

      const { success, body } = await campagnesService.createMultiCampagne({
        campagnes: [campagne1, campagne2],
        etablissementSiret: etablissement.data.siret,
      });

      expect(stubCreatedCampagne.calledTwice).to.be.true;
      expect(stubbedCreatedCampagne1).to.have.been.calledWith(campagne1);
      expect(stubbedCreatedCampagne2).to.have.been.calledWith(campagne2);

      expect(stubCreatedFormation.calledTwice).to.be.true;
      expect(stubbedCreatedFormation1).to.have.been.calledWith({
        data: formation1,
        campagneId: campagne1._id,
        createdBy: formation1.createdBy,
      });
      expect(stubbedCreatedFormation2).to.have.been.calledWith({
        data: formation2,
        campagneId: campagne2._id,
        createdBy: formation2.createdBy,
      });

      expect(stubGetAllEtablissement).to.have.been.calledOnceWith({ "data.siret": etablissement.data.siret });
      expect(stubUpdateEtablissement).to.have.been.calledOnceWith(etablissement._id, {
        formationIds: [formation1._id.toString(), formation2._id.toString()],
      });

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal({
        createdCount: 2,
      });
    });
    it("should be unsuccessful and returns errors if it throws", async () => {
      const user = newUser({}, true);

      const formation1 = newFormation({ createdBy: user._id.toString() }, true);
      const formation2 = newFormation({ createdBy: user._id.toString() }, true);

      const campagne1 = newCampagne({ formation: formation1 }, true);
      const campagne2 = newCampagne({ formation: formation2 }, true);

      const etablissement = newEtablissement();

      stub(campagnesDao, "create").throws(new Error());

      const { success, body } = await campagnesService.createMultiCampagne({
        campagnes: [campagne1, campagne2],
        etablissementSiret: etablissement.data.siret,
      });

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("getExport", async () => {
    it("should be successful and returns generated pdf", async () => {
      const campagne = newCampagne();
      const formation = newFormation({ campagneId: campagne._id });

      const expectedPdf = "pdf content";

      const stubbedGetOne = stub(campagnesDao, "getOne").returns(campagne);
      const stubbedGetAll = stub(formationsDao, "getAll").returns([formation]);
      const stubbedGeneratePdf = stub(pdfExport, "generatePdf").returns(expectedPdf);

      const { success, body } = await campagnesService.getExport(campagne._id, stubbedGeneratePdf);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body.data).to.equal(expectedPdf);
      expect(body.fileName).to.equal(campagne.nomCampagne + ".pdf");

      expect(stubbedGetOne).to.have.been.calledOnceWith(campagne._id);
      expect(stubbedGetAll).to.have.been.calledOnceWith({ campagneId: campagne._id });
      expect(stubbedGeneratePdf).to.have.been.calledOnceWith(campagne._id, campagne.nomCampagne);
    });
    it("should be unsuccessful and returns errors if it throws", async () => {
      const campagne = newCampagne();

      const stubbedGetOne = stub(campagnesDao, "getOne").returns(campagne);
      const stubbedGetAll = stub(formationsDao, "getAll").throws(new Error());

      const { success, body } = await campagnesService.getExport(campagne._id);

      expect(success).to.be.false;
      expect(body).to.be.an("error");

      expect(stubbedGetOne).to.have.been.calledOnceWith(campagne._id);
      expect(stubbedGetAll).to.have.been.calledOnceWith({ campagneId: campagne._id });
    });
  });
  describe("getMultipleExport", async () => {
    it("should be successful and returns generated pdf", async () => {
      const user = newUser({}, true);

      const etablissement = newEtablissement();

      const diplome = "CERTIFICAT D'APTITUDES PROFESSIONNELLES";

      const formation1 = newFormation({ data: { diplome } });
      const formation2 = newFormation({ data: { diplome } });

      const campagne1 = newCampagne({ formation: formation1, etablissement }, true);
      const campagne2 = newCampagne({ formation: formation2, etablissement }, true);

      const stubbedGetAll = stub(campagnesDao, "getAll").returns([campagne1, campagne2]);
      const stubbedGeneratePdf = stub(pdfExport, "generateMultiplePdf").returns("pdf content");

      const { success, body } = await campagnesService.getMultipleExport([campagne1._id, campagne2._id], user);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body.data).to.equal("pdf content");
      expect(body.fileName).to.equal(`campagnes Sirius - ${DIPLOME_TYPE_MATCHER[diplome]}.pdf`);

      expect(stubbedGetAll).to.have.been.calledOnceWith({
        _id: { $in: [campagne1._id, campagne2._id] },
      });
      expect(stubbedGeneratePdf).to.have.been.calledOnceWith(
        [
          {
            campagneId: campagne1._id.toString(),
            campagneName:
              campagne1.nomCampagne ||
              campagne1.formation.data.intitule_long ||
              campagne1.formation.data.intitule_court,
            localite: campagne1.formation.data.localite,
            tags: campagne1.formation.data.tags,
            duree: campagne1.formation.data.duree,
          },
          {
            campagneId: campagne2._id.toString(),
            campagneName:
              campagne2.nomCampagne ||
              campagne2.formation.data.intitule_long ||
              campagne2.formation.data.intitule_court,
            localite: campagne2.formation.data.localite,
            tags: campagne2.formation.data.tags,
            duree: campagne2.formation.data.duree,
          },
        ],
        DIPLOME_TYPE_MATCHER[diplome],
        etablissement.data.onisep_nom ||
          etablissement.data.enseigne ||
          etablissement.data.entreprise_raison_sociale ||
          "",
        user
      );
    });

    it("should be unsuccessful and returns errors if it throws", async () => {
      const user = newUser({}, true);

      const campagne1 = newCampagne({}, true);
      const campagne2 = newCampagne({}, true);

      const stubbedGetAll = stub(campagnesDao, "getAll").throws(new Error());

      const { success, body } = await campagnesService.getMultipleExport([campagne1._id, campagne2._id], user);

      expect(success).to.be.false;
      expect(body).to.be.an("error");

      expect(stubbedGetAll).to.have.been.calledOnceWith({
        _id: { $in: [ObjectId(campagne1._id), ObjectId(campagne2._id)] },
      });
    });
  });
});
