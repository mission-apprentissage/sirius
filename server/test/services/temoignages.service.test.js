const { expect } = require("chai");
const { stub, restore } = require("sinon");
const { newTemoignage, newCampagne, newQuestionnaire } = require("../fixtures");
const temoignagesService = require("../../src/services/temoignages.service");
const temoignagesDao = require("../../src/dao/temoignages.dao");
const campagnesDao = require("../../src/dao/campagnes.dao");
const questionnairesDao = require("../../src/dao/questionnaires.dao");
const { ErrorMessage } = require("../../src/errors");

describe(__filename, () => {
  afterEach(async () => {
    restore();
  });

  describe("createTemoignage", () => {
    afterEach(() => {
      restore();
    });

    it("should create a new temoignage and return it", async () => {
      const campagne = newCampagne({}, true);
      const temoignage = newTemoignage({ campagneId: campagne._id });

      const getOneWithTemoignagneCountAndTemplateNameStub = stub(
        campagnesDao,
        "getOneWithTemoignagneCountAndTemplateName"
      ).returns(campagne);
      const countByCampagneStub = stub(temoignagesDao, "countByCampagne").returns(0);
      const createStub = stub(temoignagesDao, "create").returns(temoignage);

      const { success, body } = await temoignagesService.createTemoignage(temoignage);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(temoignage);

      expect(getOneWithTemoignagneCountAndTemplateNameStub.calledOnceWithExactly({ id: temoignage.campagneId })).to.be
        .true;
      expect(countByCampagneStub.calledOnceWithExactly(temoignage.campagneId)).to.be.true;
      expect(createStub.calledOnceWithExactly(temoignage)).to.be.true;
    });

    it("should return an error if the campagne is not found", async () => {
      const temoignage = newTemoignage({ campagneId: "non-existing-campagne-id" });

      const getOneWithTemoignagneCountAndTemplateNameStub = stub(
        campagnesDao,
        "getOneWithTemoignagneCountAndTemplateName"
      ).returns(null);

      const { success, body } = await temoignagesService.createTemoignage(temoignage);

      expect(success).to.be.false;
      expect(body).to.be.an("error");
      expect(body.message).to.equal("Campagne not found");

      expect(getOneWithTemoignagneCountAndTemplateNameStub.calledOnceWithExactly({ id: temoignage.campagneId })).to.be
        .true;
    });

    it("should return an error if the campagne has not started yet", async () => {
      const campagne = newCampagne({ startDate: new Date(Date.now() + 100000) }, true);
      const temoignage = newTemoignage({ campagneId: campagne._id });

      stub(temoignagesDao, "countByCampagne").returns(0);

      const getOneWithTemoignagneCountAndTemplateNameStub = stub(
        campagnesDao,
        "getOneWithTemoignagneCountAndTemplateName"
      ).returns(campagne);

      const { success, body } = await temoignagesService.createTemoignage(temoignage);

      expect(success).to.be.false;
      expect(body).to.equal(ErrorMessage.CampagneNotStarted);

      expect(getOneWithTemoignagneCountAndTemplateNameStub.calledOnceWithExactly({ id: temoignage.campagneId })).to.be
        .true;
    });

    it("should return an error if the campagne has ended", async () => {
      const campagne = newCampagne({ endDate: new Date(Date.now() - 100000) }, true);
      const temoignage = newTemoignage({ campagneId: campagne._id });

      stub(temoignagesDao, "countByCampagne").returns(0);

      const getOneWithTemoignagneCountAndTemplateNameStub = stub(
        campagnesDao,
        "getOneWithTemoignagneCountAndTemplateName"
      ).returns(campagne);

      const { success, body } = await temoignagesService.createTemoignage(temoignage);

      expect(success).to.be.false;
      expect(body).to.equal(ErrorMessage.CampagneEnded);

      expect(getOneWithTemoignagneCountAndTemplateNameStub.calledOnceWithExactly({ id: temoignage.campagneId })).to.be
        .true;
    });

    it("should return an error if there are no seats available", async () => {
      const campagne = newCampagne({ seats: 1 }, true);
      const temoignage1 = newTemoignage({ campagneId: campagne._id });

      const getOneWithTemoignagneCountAndTemplateNameStub = stub(
        campagnesDao,
        "getOneWithTemoignagneCountAndTemplateName"
      ).returns(campagne);

      const countByCampagneStub = stub(temoignagesDao, "countByCampagne").returns(1);

      const { success, body } = await temoignagesService.createTemoignage(temoignage1);

      expect(success).to.be.false;
      expect(body).to.equal(ErrorMessage.NoSeatsAvailable);

      expect(getOneWithTemoignagneCountAndTemplateNameStub.calledOnceWithExactly({ id: temoignage1.campagneId })).to.be
        .true;
      expect(countByCampagneStub.calledOnceWithExactly(temoignage1.campagneId)).to.be.true;
    });

    it("should return an error if an error is thrown", async () => {
      const temoignage = newTemoignage({ campagneId: "non-existing-campagne-id" });

      const getOneWithTemoignagneCountAndTemplateNameStub = stub(
        campagnesDao,
        "getOneWithTemoignagneCountAndTemplateName"
      ).throws(new Error());

      const { success, body } = await temoignagesService.createTemoignage(temoignage);

      expect(success).to.be.false;
      expect(body).to.be.an("error");

      expect(getOneWithTemoignagneCountAndTemplateNameStub.calledOnceWithExactly({ id: temoignage.campagneId })).to.be
        .true;
    });
  });
  describe("getTemoignages", () => {
    it("should be successful and returns temoignages", async () => {
      const temoignage = newTemoignage();
      const campagne = newCampagne({}, true);
      const questionnaire = newQuestionnaire({}, true);

      const getAllStub = stub(temoignagesDao, "getAll").returns([temoignage]);
      const getOneStub = stub(campagnesDao, "getOne").returns(campagne);
      const getOneQuestionnaireStub = stub(questionnairesDao, "getOne").returns(questionnaire);

      const { success, body } = await temoignagesService.getTemoignages({ campagneId: campagne._id });

      expect(success).to.be.true;
      expect(body).to.be.an("array");
      expect(body[0]).to.deep.equal(temoignage);

      expect(getAllStub.calledOnceWithExactly({ campagneId: campagne._id })).to.be.true;
      expect(getOneStub.calledOnceWithExactly(campagne._id)).to.be.true;
      expect(getOneQuestionnaireStub.calledOnceWithExactly(campagne.questionnaireId)).to.be.true;
    });
    it("should be successful, returns temoignages but remove responses that are not VALIDATED", async () => {
      const temoignage = newTemoignage({
        reponses: {
          peurChangementConseil: { status: "PENDING", content: "test" },
        },
      });
      const campagne = newCampagne({}, true);
      const questionnaire = newQuestionnaire({}, true);

      const getAllStub = stub(temoignagesDao, "getAll").returns([temoignage]);
      const getOneStub = stub(campagnesDao, "getOne").returns(campagne);
      const getOneQuestionnaireStub = stub(questionnairesDao, "getOne").returns(questionnaire);

      const { success, body } = await temoignagesService.getTemoignages({ campagneId: campagne._id });

      expect(success).to.be.true;
      expect(body).to.be.an("array");
      expect(body[0]).to.deep.equal(temoignage);
      expect(body[0].reponses).to.not.have.property("peurChangementConseil");

      expect(getAllStub.calledOnceWithExactly({ campagneId: campagne._id })).to.be.true;
      expect(getOneStub.calledOnceWithExactly(campagne._id)).to.be.true;
      expect(getOneQuestionnaireStub.calledOnceWithExactly(campagne.questionnaireId)).to.be.true;
    });
    it("should return an error if the campagne is not found", async () => {
      const campagneId = "non-existing-campagne-id";

      const getAllStub = stub(temoignagesDao, "getAll").returns([]);
      const getOneStub = stub(campagnesDao, "getOne").returns(null);

      const { success, body } = await temoignagesService.getTemoignages({ campagneId });

      expect(success).to.be.false;
      expect(body).to.equal(ErrorMessage.CampagneNotFoundError);

      expect(getAllStub.calledOnceWithExactly({ campagneId })).to.be.true;
      expect(getOneStub.calledOnceWithExactly(campagneId)).to.be.true;
    });
    it("should return an error if the questionnaire is not found", async () => {
      const campagne = newCampagne({}, true);

      const getAllStub = stub(temoignagesDao, "getAll").returns([]);
      const getOneStub = stub(campagnesDao, "getOne").returns(campagne);
      const getOneQuestionnaireStub = stub(questionnairesDao, "getOne").returns(null);

      const { success, body } = await temoignagesService.getTemoignages({ campagneId: campagne._id });

      expect(success).to.be.false;
      expect(body).to.equal(ErrorMessage.QuestionnaireNotFoundError);

      expect(getAllStub.calledOnceWithExactly({ campagneId: campagne._id })).to.be.true;
      expect(getOneStub.calledOnceWithExactly(campagne._id)).to.be.true;
      expect(getOneQuestionnaireStub.calledOnceWithExactly(campagne.questionnaireId)).to.be.true;
    });
    it("should return an error if an error is thrown", async () => {
      const getAllStub = stub(temoignagesDao, "getAll").throws(new Error());

      const { success, body } = await temoignagesService.getTemoignages({});

      expect(success).to.be.false;
      expect(body).to.be.an("error");

      expect(getAllStub.calledOnceWithExactly({})).to.be.true;
    });
  });
  describe("deleteTemoignage", () => {
    it("should be successful and returns the number of deleted temoignage", async () => {
      const temoignage = newTemoignage({}, true);
      stub(temoignagesDao, "deleteOne").returns({
        acknowledged: true,
        deletedCount: 1,
      });

      const { success, body } = await temoignagesService.deleteTemoignage(temoignage._id);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal({
        acknowledged: true,
        deletedCount: 1,
      });
    });
    it("should be unsuccessful and returns errors if it throws", async () => {
      stub(temoignagesDao, "deleteOne").throws(new Error());

      const { success, body } = await temoignagesService.deleteTemoignage();

      expect(success).to.be.false;
      expect(body).to.be.an("error");
    });
  });
  describe("updateTemoignage", () => {
    afterEach(() => {
      restore();
    });

    it("should update a temoignage and return it", async () => {
      const temoignageToUpdate = newTemoignage();
      const updatedTemoignage = { ...temoignageToUpdate, reponses: { ...temoignageToUpdate.reponses, test: "test" } };
      const campagne = newCampagne({}, true);

      const getOneStub = stub(temoignagesDao, "getOne").returns(temoignageToUpdate);
      const getOneWithTemoignagneCountAndTemplateNameStub = stub(
        campagnesDao,
        "getOneWithTemoignagneCountAndTemplateName"
      ).returns([campagne]);
      const updateStub = stub(temoignagesDao, "update").returns(updatedTemoignage);

      const { success, body } = await temoignagesService.updateTemoignage(temoignageToUpdate._id, updatedTemoignage);

      expect(success).to.be.true;
      expect(body).to.be.an("object");
      expect(body).to.deep.equal(updatedTemoignage);

      expect(getOneStub.calledOnceWithExactly(temoignageToUpdate._id)).to.be.true;
      expect(getOneWithTemoignagneCountAndTemplateNameStub.calledOnceWithExactly({ id: temoignageToUpdate.campagneId }))
        .to.be.true;
      expect(updateStub.calledOnceWithExactly(temoignageToUpdate._id, updatedTemoignage)).to.be.true;
    });

    it("should return an error if the campagne is not found", async () => {
      const id = "non-existing-campagne-id";
      const temoignage = newTemoignage({ campagneId: id }, true);
      const updatedTemoignage = { ...temoignage, reponses: { ...temoignage.reponses, test: "test" } };

      const getOneStub = stub(temoignagesDao, "getOne").returns(temoignage);
      const getOneWithTemoignagneCountAndTemplateNameStub = stub(
        campagnesDao,
        "getOneWithTemoignagneCountAndTemplateName"
      ).returns(null);

      const { success, body } = await temoignagesService.updateTemoignage(temoignage._id, updatedTemoignage);

      expect(success).to.be.false;
      expect(body.message).to.equal("Campagne not found");

      expect(getOneStub.calledOnceWithExactly(temoignage._id)).to.be.true;
      expect(getOneWithTemoignagneCountAndTemplateNameStub.calledOnceWithExactly({ id: temoignage.campagneId })).to.be
        .true;
    });
    it("should return an error if an error is thrown", async () => {
      const temoignageToUpdate = newTemoignage();
      const updatedTemoignage = { ...temoignageToUpdate, reponses: { ...temoignageToUpdate.reponses, test: "test" } };

      const getOneStub = stub(temoignagesDao, "getOne").throws(new Error());

      const { success, body } = await temoignagesService.updateTemoignage(temoignageToUpdate._id, updatedTemoignage);

      expect(success).to.be.false;
      expect(body).to.be.an("error");

      expect(getOneStub.calledOnceWithExactly(temoignageToUpdate._id)).to.be.true;
    });
  });
});
