const { expect } = require("chai");
const { stub, restore } = require("sinon");
const { newQuestionnaire, newCampagne, newTemoignage, newFormation, newEtablissement } = require("../fixtures");
const questionnairesDao = require("../../src/dao/questionnaires.dao");
const campagnesDao = require("../../src/dao/campagnes.dao");
const temoignagesDao = require("../../src/dao/temoignages.dao");
const { getVerbatims, patchVerbatim } = require("../../src/services/verbatims.service");
const { ErrorMessage } = require("../../src/errors");

describe(__filename, () => {
  afterEach(async () => {
    restore();
  });

  describe("getVerbatims", async () => {
    it("should be successful and returns verbatims with formation and etablissement", async () => {
      const questionnaire = newQuestionnaire({}, true);
      const formation = newFormation({}, true);
      const etablissement = newEtablissement({}, true);

      const campagne = newCampagne({ questionnaireId: questionnaire._id, formation, etablissement }, true);
      formation.campagneId = campagne._id;
      const temoignage = newTemoignage({
        campagneId: campagne._id.toString(),
        formationId: formation._id.toString(),
        reponses: {
          peurChangementConseil: "test",
        },
      });

      const stubbedGetAllQuestionnaire = stub(questionnairesDao, "getAll").returns([questionnaire]);
      const stubbedGetAll = stub(campagnesDao, "getAllWithTemoignageCountFormationEtablissement").returns([campagne]);
      const stubbedGetAll2 = stub(temoignagesDao, "getAll").returns([temoignage]);

      const { success, body } = await getVerbatims({
        questionnaireId: questionnaire._id,
        etablissementSiret: etablissement.data.siret,
        formationId: formation._id.toString(),
      });

      expect(success).to.be.true;
      expect(body.verbatims).to.be.an("array");
      expect(body.verbatims[0]).to.have.property("formation");
      expect(body.verbatims[0].formation).to.deep.equal(formation.data.intitule_long);
      expect(body.verbatims[0]).to.have.property("etablissement");
      expect(body.verbatims[0].etablissement).to.deep.equal(etablissement.data.onisep_nom);
      expect(stubbedGetAllQuestionnaire).to.have.been.calledOnce;
      expect(stubbedGetAll).to.have.been.calledOnceWith({
        questionnaireId: questionnaire._id.toString(),
        etablissementSiret: etablissement.data.siret,
        formationId: formation._id.toString(),
      });
      expect(stubbedGetAll2).to.have.been.calledOnceWith({ campagneId: { $in: [campagne._id] } });
    });

    it("should return an empty array if the campagnes are not found", async () => {
      const questionnaire = newQuestionnaire({}, true);
      const stubbedGetAllQuestionnaire = stub(questionnairesDao, "getAll").returns([questionnaire]);
      const stubbedGetAllCampagnes = stub(campagnesDao, "getAllWithTemoignageCountFormationEtablissement").returns(
        null
      );

      const { success, body } = await getVerbatims({ questionnaireId: questionnaire._id });

      expect(success).to.be.true;
      expect(body.verbatims).to.eql([]);
      expect(stubbedGetAllQuestionnaire).to.have.been.calledOnce;
      expect(stubbedGetAllCampagnes).to.have.been.calledOnceWith({ questionnaireId: questionnaire._id.toString() });
    });
  });
  describe("patchVerbatim", async () => {
    afterEach(async () => {
      restore();
    });

    it("should update the verbatim and return the updated temoignage", async () => {
      const temoignageId = "temoignage-id";
      const questionId = "question-id";
      const payload = "updated-payload";
      const temoignageToUpdate = newTemoignage({
        _id: temoignageId,
        reponses: {
          [questionId]: "old-payload",
        },
      });

      const stubbedGetOne = stub(temoignagesDao, "getOne").returns(temoignageToUpdate);
      const stubbedUpdate = stub(temoignagesDao, "update").returns(temoignageToUpdate);

      const { success, body } = await patchVerbatim(temoignageId, { questionId, payload });

      expect(success).to.be.true;
      expect(body).to.deep.equal(temoignageToUpdate);
      expect(temoignageToUpdate.reponses[questionId]).to.equal(payload);
      expect(stubbedGetOne).to.have.been.calledOnceWith(temoignageId);
      expect(stubbedUpdate).to.have.been.calledOnceWith(temoignageId, temoignageToUpdate);
    });

    it("should return an error if the temoignage is not found", async () => {
      const temoignageId = "non-existing-id";
      const questionId = "question-id";
      const payload = "updated-payload";

      const stubbedGetOne = stub(temoignagesDao, "getOne").returns(null);

      const { success, body } = await patchVerbatim(temoignageId, { questionId, payload });

      expect(success).to.be.false;
      expect(body).to.equal(ErrorMessage.TemoignageNotFoundError);
      expect(stubbedGetOne).to.have.been.calledOnceWith(temoignageId);
    });

    it("should return an error if an error occurs while updating the temoignage", async () => {
      const temoignageId = "temoignage-id";
      const questionId = "question-id";
      const payload = "updated-payload";
      const temoignageToUpdate = newTemoignage({
        _id: temoignageId,
        reponses: {
          [questionId]: "old-payload",
        },
      });

      const stubbedGetOne = stub(temoignagesDao, "getOne").returns(temoignageToUpdate);
      const stubbedUpdate = stub(temoignagesDao, "update").throws(new Error("Update error"));

      const { success, body } = await patchVerbatim(temoignageId, { questionId, payload });

      expect(success).to.be.false;
      expect(body).to.be.an("error");
      expect(stubbedGetOne).to.have.been.calledOnceWith(temoignageId);
      expect(stubbedUpdate).to.have.been.calledOnceWith(temoignageId, temoignageToUpdate);
    });
  });
});
