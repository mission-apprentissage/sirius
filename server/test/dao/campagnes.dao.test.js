const { use, expect } = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const httpTests = require("../integration/utils/httpTests");

const campagnesDao = require("../../src/dao/campagnes.dao");
const formationsDao = require("../../src/dao/formations.dao");
const etablissementsDao = require("../../src/dao/etablissements.dao");
const temoignagesDao = require("../../src/dao/temoignages.dao");
const questionnairesDao = require("../../src/dao/questionnaires.dao");
const { newCampagne, newEtablissement, newFormation, newTemoignage, newQuestionnaire } = require("../fixtures");

use(sinonChai);

httpTests(__filename, ({ startServer }) => {
  before(async () => {
    await startServer();
  });
  beforeEach(async () => {
    sinon.useFakeTimers(new Date());
  });
  afterEach(async () => {
    sinon.restore();
  });
  describe("getAllWithTemoignageCountAndTemplateName", () => {
    it("should returns the campagnes with temoignages count, questionnaire template, formation and etablissement", async () => {
      const questionnaire1 = newQuestionnaire();
      const createdQuestionnaire1 = await questionnairesDao.create(questionnaire1);

      const campagne1 = newCampagne({ questionnaireId: createdQuestionnaire1._id.toString() });
      const campagne2 = newCampagne({ questionnaireId: createdQuestionnaire1._id.toString() });

      const createdCampagne1 = await campagnesDao.create(campagne1);
      const createdCampagne2 = await campagnesDao.create(campagne2);

      const formation1 = newFormation({ campagneId: createdCampagne1._id.toString() });
      const formation2 = newFormation({ campagneId: createdCampagne2._id.toString() });

      const createdFormation1 = await formationsDao.create(formation1);
      const createdFormation2 = await formationsDao.create(formation2);

      const temoignage1 = newTemoignage({ campagneId: createdCampagne1._id.toString() });

      const createdTemoignage1 = await temoignagesDao.create(temoignage1);

      const etablissement = newEtablissement({
        formationIds: [createdFormation1._id.toString(), createdFormation2._id.toString()],
        data: { siret: "123456789" },
      });

      const createdEtablissement = await etablissementsDao.create(etablissement);

      const campagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName({
        siret: etablissement.data.siret,
      });

      expect(campagnes).to.have.lengthOf(2);
      expect(campagnes[0]).to.deep.includes(campagne1);
      expect(campagnes[0].temoignagesCount).to.eql(1);
      expect(campagnes[0].temoignagesList).to.deep.includes(createdTemoignage1.toObject());
      expect(campagnes[0].questionnaireTemplateName).to.eql(createdQuestionnaire1.nom);
      expect(campagnes[0].questionnaire).to.eql(createdQuestionnaire1.questionnaire);
      expect(campagnes[0].questionnaireUI).to.eql(createdQuestionnaire1.questionnaireUI);
      expect(campagnes[0].formation.data).to.deep.includes(createdFormation1.toObject().data);
      expect(campagnes[0].etablissement.data).to.deep.includes(createdEtablissement.toObject().data);

      expect(campagnes[1]).to.deep.includes(campagne2);
      expect(campagnes[1].temoignagesCount).to.eql(0);
      expect(campagnes[1].temoignagesList).to.eql([]);
      expect(campagnes[1].questionnaireTemplateName).to.eql(createdQuestionnaire1.nom);
      expect(campagnes[1].questionnaire).to.eql(createdQuestionnaire1.questionnaire);
      expect(campagnes[1].questionnaireUI).to.eql(createdQuestionnaire1.questionnaireUI);
      expect(campagnes[1].formation.data).to.deep.includes(createdFormation2.toObject().data);
      expect(campagnes[1].etablissement.data).to.deep.includes(createdEtablissement.toObject().data);
    });
    it("should not returns the campagnes when deletedAt is set", async () => {
      const questionnaire1 = newQuestionnaire();
      const createdQuestionnaire1 = await questionnairesDao.create(questionnaire1);

      const campagne1 = newCampagne({ questionnaireId: createdQuestionnaire1._id.toString(), deletedAt: new Date() });
      const campagne2 = newCampagne({ questionnaireId: createdQuestionnaire1._id.toString() });

      const createdCampagne1 = await campagnesDao.create(campagne1);
      const createdCampagne2 = await campagnesDao.create(campagne2);

      const formation1 = newFormation({ campagneId: createdCampagne1._id.toString() });
      const formation2 = newFormation({ campagneId: createdCampagne2._id.toString() });

      const createdFormation1 = await formationsDao.create(formation1);
      const createdFormation2 = await formationsDao.create(formation2);

      const temoignage1 = newTemoignage({ campagneId: createdCampagne1._id.toString() });

      await temoignagesDao.create(temoignage1);

      const etablissement = newEtablissement({
        formationIds: [createdFormation1._id.toString(), createdFormation2._id.toString()],
        data: { siret: "123456789" },
      });

      await etablissementsDao.create(etablissement);

      const campagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName({
        siret: etablissement.data.siret,
      });

      expect(campagnes).to.have.lengthOf(1);
    });
  });
  describe("getOneWithTemoignagneCountAndTemplateName", () => {
    it("should returns the campagnes with temoignages count, questionnaire template, formation and etablissement", async () => {
      const questionnaire1 = newQuestionnaire();
      const createdQuestionnaire1 = await questionnairesDao.create(questionnaire1);

      const campagne1 = newCampagne({ questionnaireId: createdQuestionnaire1._id.toString() });
      const campagne2 = newCampagne({ questionnaireId: createdQuestionnaire1._id.toString() });

      const createdCampagne1 = await campagnesDao.create(campagne1);
      const createdCampagne2 = await campagnesDao.create(campagne2);

      const formation1 = newFormation({ campagneId: createdCampagne1._id.toString() });
      const formation2 = newFormation({ campagneId: createdCampagne2._id.toString() });

      const createdFormation1 = await formationsDao.create(formation1);
      const createdFormation2 = await formationsDao.create(formation2);

      const temoignage1 = newTemoignage({ campagneId: createdCampagne1._id.toString() });

      const createdTemoignage1 = await temoignagesDao.create(temoignage1);

      const etablissement = newEtablissement({
        formationIds: [createdFormation1._id.toString(), createdFormation2._id.toString()],
        data: { siret: "123456789" },
      });

      const createdEtablissement = await etablissementsDao.create(etablissement);

      const campagne = await campagnesDao.getOneWithTemoignagneCountAndTemplateName({
        id: createdCampagne1._id.toString(),
        siret: etablissement.data.siret,
      });

      expect(campagne).to.have.lengthOf(1);
      expect(campagne[0]).to.deep.includes(createdCampagne1.toObject());
      expect(campagne[0].temoignagesCount).to.eql(1);
      expect(campagne[0].temoignagesList).to.deep.includes(createdTemoignage1.toObject());
      expect(campagne[0].questionnaireTemplateName).to.eql(createdQuestionnaire1.nom);
      expect(campagne[0].questionnaire).to.eql(createdQuestionnaire1.questionnaire);
      expect(campagne[0].questionnaireUI).to.eql(createdQuestionnaire1.questionnaireUI);
      expect(campagne[0].formation.data).to.deep.includes(createdFormation1.toObject().data);
      expect(campagne[0].etablissement.data).to.deep.includes(createdEtablissement.toObject().data);
    });
    it("should not returns the campagnes when deletedAt is set", async () => {
      const questionnaire1 = newQuestionnaire();
      const createdQuestionnaire1 = await questionnairesDao.create(questionnaire1);

      const campagne1 = newCampagne({ questionnaireId: createdQuestionnaire1._id.toString(), deletedAt: new Date() });
      const campagne2 = newCampagne({ questionnaireId: createdQuestionnaire1._id.toString(), deletedAt: new Date() });

      const createdCampagne1 = await campagnesDao.create(campagne1);
      const createdCampagne2 = await campagnesDao.create(campagne2);

      const formation1 = newFormation({ campagneId: createdCampagne1._id.toString() });
      const formation2 = newFormation({ campagneId: createdCampagne2._id.toString() });

      const createdFormation1 = await formationsDao.create(formation1);
      const createdFormation2 = await formationsDao.create(formation2);

      const temoignage1 = newTemoignage({ campagneId: createdCampagne1._id.toString() });

      await temoignagesDao.create(temoignage1);

      const etablissement = newEtablissement({
        formationIds: [createdFormation1._id.toString(), createdFormation2._id.toString()],
        data: { siret: "123456789" },
      });

      await etablissementsDao.create(etablissement);

      const campagnes = await campagnesDao.getOneWithTemoignagneCountAndTemplateName({
        siret: etablissement.data.siret,
      });

      expect(campagnes).to.have.lengthOf(0);
    });
  });
  describe("getOne", () => {
    it("should return a single campagne object with the given id", async () => {
      const campagne = newCampagne();
      const createdCampagne = await campagnesDao.create(campagne);

      const result = await campagnesDao.getOne(createdCampagne._id);

      expect(result).to.deep.equal(createdCampagne.toObject());
    });

    it("should return null if no campagne exists with the given id", async () => {
      const result = await campagnesDao.getOne("5f3f8d9d1c9d440000a3d3e9");

      expect(result).to.be.null;
    });

    it("should not return a campagne that has been deleted", async () => {
      const campagne = newCampagne({ deletedAt: new Date() });
      const createdCampagne = await campagnesDao.create(campagne);

      const result = await campagnesDao.getOne(createdCampagne._id);

      expect(result).to.be.null;
    });
  });
  describe("create", () => {
    it("should create and returns the campagne", async () => {
      const campagne1 = newCampagne();

      const createdCampagne = await campagnesDao.create(campagne1);

      expect(createdCampagne).to.deep.includes(campagne1);
    });
  });
  describe("deleteOne", () => {
    it("should deletes the campagne", async () => {
      const campagne1 = newCampagne({}, true);
      await campagnesDao.create(campagne1);

      const deletedCampagne = await campagnesDao.deleteOne(campagne1._id);

      expect(deletedCampagne.modifiedCount).to.eql(1);
    });
  });
  describe("update", () => {
    it("should updates the campagne", async () => {
      const campagne1 = newCampagne();
      const createdCampagne = await campagnesDao.create(campagne1);

      const newNomCampagne = "nouveau nom";
      createdCampagne.nomCampagne = newNomCampagne;

      const updatedCampagne = await campagnesDao.update(createdCampagne._id, createdCampagne);

      expect(updatedCampagne.modifiedCount).to.eql(1);
    });
  });
  describe("getAll", () => {
    it("should returns the undeleted campagnes with formation and etablissement", async () => {
      const campagne1 = newCampagne();
      const campagne2 = newCampagne();

      const createdCampagne1 = await campagnesDao.create(campagne1);
      const createdCampagne2 = await campagnesDao.create(campagne2);

      const formation1 = newFormation({ campagneId: createdCampagne1._id.toString() });
      const formation2 = newFormation({ campagneId: createdCampagne2._id.toString() });

      const createdFormation1 = await formationsDao.create(formation1);
      const createdFormation2 = await formationsDao.create(formation2);

      const etablissement = newEtablissement({
        formationIds: [createdFormation1._id.toString(), createdFormation2._id.toString()],
        data: { siret: "123456789" },
      });

      const createdEtablissement = await etablissementsDao.create(etablissement);

      const campagnes = await campagnesDao.getAllWithTemoignageCountFormationEtablissement();

      expect(campagnes).to.have.lengthOf(2);
      expect(campagnes[0]).to.deep.includes(createdCampagne1.toObject());
      expect(campagnes[0].formation.data).to.deep.includes(createdFormation1.toObject().data);
      expect(campagnes[0].etablissement.data).to.deep.includes(createdEtablissement.toObject().data);
    });
    it("should not returns the campagnes when deletedAt is set", async () => {
      const campagne1 = newCampagne({ deletedAt: new Date() });
      const campagne2 = newCampagne();

      const createdCampagne1 = await campagnesDao.create(campagne1);
      const createdCampagne2 = await campagnesDao.create(campagne2);

      const formation1 = newFormation({ campagneId: createdCampagne1._id.toString() });
      const formation2 = newFormation({ campagneId: createdCampagne2._id.toString() });

      const createdFormation1 = await formationsDao.create(formation1);
      const createdFormation2 = await formationsDao.create(formation2);

      const etablissement = newEtablissement({
        formationIds: [createdFormation1._id.toString(), createdFormation2._id.toString()],
        data: { siret: "123456789" },
      });

      const createdEtablissement = await etablissementsDao.create(etablissement);

      const campagnes = await campagnesDao.getAllWithTemoignageCountFormationEtablissement();

      expect(campagnes).to.have.lengthOf(1);
      expect(campagnes[0]).to.deep.includes(createdCampagne2.toObject());
      expect(campagnes[0].formation.data).to.deep.includes(createdFormation2.toObject().data);
      expect(campagnes[0].etablissement.data).to.deep.includes(createdEtablissement.toObject().data);
    });
    it("should returns the campagnes matching the query", async () => {
      const campagne1 = newCampagne();
      const campagne2 = newCampagne({ nomCampagne: "test" });

      const createdCampagne1 = await campagnesDao.create(campagne1);
      const createdCampagne2 = await campagnesDao.create(campagne2);

      const formation1 = newFormation({ campagneId: createdCampagne1._id.toString() });
      const formation2 = newFormation({ campagneId: createdCampagne2._id.toString() });

      const createdFormation1 = await formationsDao.create(formation1);
      const createdFormation2 = await formationsDao.create(formation2);

      const etablissement1 = newEtablissement({
        formationIds: [createdFormation1._id.toString(), createdFormation2._id.toString()],
      });

      const createdEtablissement2 = await etablissementsDao.create(etablissement1);

      const campagnes = await campagnesDao.getAllWithTemoignageCountFormationEtablissement({
        _id: createdCampagne2._id,
      });

      expect(campagnes).to.have.lengthOf(1);
      expect(campagnes[0]).to.deep.includes(createdCampagne2.toObject());
      expect(campagnes[0].formation.data).to.deep.includes(createdFormation2.toObject().data);
      expect(campagnes[0].etablissement.data).to.deep.includes(createdEtablissement2.toObject().data);
    });
  });
});
