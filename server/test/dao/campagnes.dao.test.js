const { use, expect } = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const httpTests = require("../integration/utils/httpTests");

const campagnesDao = require("../../src/dao/campagnes.dao");
const formationsDao = require("../../src/dao/formations.dao");
const etablissementsDao = require("../../src/dao/etablissements.dao");
const { newCampagne, newEtablissement, newFormation } = require("../fixtures");

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
    it("should returns the campagnes", async () => {
      const campagne1 = newCampagne({});
      const campagne2 = newCampagne({});

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

      await etablissementsDao.create(etablissement);

      const campagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName({
        siret: etablissement.data.siret,
      });

      expect(campagnes[0]).to.deep.includes(campagne1);
      expect(campagnes[1]).to.deep.includes(campagne2);
    });
  });
  describe("getOneWithTemoignagneCountAndTemplateName", () => {
    it("should returns the campagne", async () => {
      const campagne1 = newCampagne({}, true);

      const formation1 = newFormation({ campagneId: campagne1._id }, true);

      const etablissement = newEtablissement({
        formationIds: [formation1._id],
        data: { siret: "123456789" },
      });

      await campagnesDao.create(campagne1);

      await formationsDao.create(formation1);

      await etablissementsDao.create(etablissement);

      const campagne = await campagnesDao.getOneWithTemoignagneCountAndTemplateName(campagne1._id);

      expect(campagne[0]).to.deep.includes(campagne1);
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
});
