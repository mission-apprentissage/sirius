const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;

const { isAdminOrAllowed, TYPES } = require("../../src/middlewares/isAdminOrAllowed");
const { UnauthorizedError } = require("../../src/errors");
const { USER_ROLES, USER_STATUS } = require("../../src/constants");
const campagnesService = require("../../src/services/campagnes.service");
const etablissementsService = require("../../src/services/etablissements.service");
const formationsService = require("../../src/services/formations.service");
const referentiel = require("../../src/modules/referentiel");

chai.use(sinonChai);

describe(__filename, () => {
  let next;
  const req = {
    user: {
      status: USER_STATUS.ACTIVE,
      role: USER_ROLES.ETABLISSEMENT,
      siret: "123456789",
      etablissements: [{ siret: "123456789" }, { siret: "987654321" }],
    },
    params: { id: "some-id", siret: "123456789" },
    query: { ids: "some-id-1,some-id-2" },
    body: {
      data: {
        etablissement_gestionnaire_siret: "123456789",
        etablissement_formateur_siret: "987654321",
      },
      etablissementSiret: "123456789",
    },
  };

  beforeEach(() => {
    next = sinon.spy();
    sinon.restore();
  });

  it("should call next if user is an admin and active", async () => {
    const reqWithAdminRole = {
      ...req,
      user: { ...req.user, role: USER_ROLES.ADMIN, status: USER_STATUS.ACTIVE },
    };

    await isAdminOrAllowed(reqWithAdminRole, next, TYPES.CAMPAGNE_ID);

    expect(next.calledOnce).to.be.true;
    expect(next.args[0]).to.eql([]);
  });
  it("should call next and throw if user is an admin and inactive", async () => {
    const reqWithAdminRole = {
      ...req,
      user: { ...req.user, role: USER_ROLES.ADMIN, status: USER_STATUS.INACTIVE },
    };

    await isAdminOrAllowed(reqWithAdminRole, next, TYPES.CAMPAGNE_ID);

    expect(next.calledOnce).to.be.true;
    expect(next.getCall(0).args[0]).to.be.an.instanceof(UnauthorizedError);
  });
  it("should call next if user is an etablissement and active and is of type campagneId", async () => {
    const reqWithCampagneId = { ...req, params: { id: "some-id" } };

    const getOneCampagneStub = sinon
      .stub(campagnesService, "getOneCampagne")
      .resolves({ success: true, body: { etablissement: { data: { siret: "123456789" } } } });

    await isAdminOrAllowed(reqWithCampagneId, next, TYPES.CAMPAGNE_ID);

    expect(getOneCampagneStub).to.have.been.calledOnceWith({ id: "some-id", siret: "123456789" });
    expect(next.calledOnce).to.be.true;
    expect(next.args[0]).to.eql([]);
  });
  it("should call next if user is an etablissement and active and is of type campagneIds", async () => {
    const siret = "123456789";
    const otherSiret = "987654321";
    const reqWithCampagneId = { ...req, query: { ids: "some-id,other-id", siret } };

    const getEtablissementSIRETFromRelationTypeStub = sinon.stub(referentiel, "getEtablissementSIRETFromRelationType");
    getEtablissementSIRETFromRelationTypeStub.resolves([otherSiret]);

    const getOneCampagneStub = sinon.stub(campagnesService, "getOneCampagne");

    getOneCampagneStub.withArgs(sinon.match({ id: "some-id", siret })).resolves({
      success: true,
      body: { _id: "some-mongo-id", etablissement: { data: { siret } } },
    });

    getOneCampagneStub.withArgs(sinon.match({ id: "other-id", siret })).resolves({
      success: true,
      body: { _id: "other-mongo-id", etablissement: { data: { siret } } },
    });

    await isAdminOrAllowed(reqWithCampagneId, next, TYPES.CAMPAGNE_IDS);

    expect(getOneCampagneStub.callCount).to.equal(2);
    expect(next.calledOnce).to.be.true;
    expect(next.args[0]).to.eql([]);
  });
  it("should call next if user is an etablissement and active and is of type SIRET", async () => {
    const reqWithSiret = { ...req, params: { siret: "123456789" } };

    await isAdminOrAllowed(reqWithSiret, next, TYPES.SIRET);

    expect(next.calledOnce).to.be.true;
    expect(next.args[0]).to.eql([]);
  });

  it("should call next if user is an etablissement and active and is of type etablissementId", async () => {
    const reqWithEtablissementId = { ...req, params: { id: "some-id" } };

    const getEtablissementStub = sinon
      .stub(etablissementsService, "getEtablissement")
      .resolves({ success: true, body: { data: { siret: "123456789" } } });

    await isAdminOrAllowed(reqWithEtablissementId, next, TYPES.ETABLISSEMENT_ID);

    expect(getEtablissementStub).to.have.been.calledOnceWith("some-id");
    expect(next.calledOnce).to.be.true;
    expect(next.args[0]).to.eql([]);
  });
  it("should call next if user is an etablissement and active and is of type siretInFormation", async () => {
    const reqWithSiretInFormation = { ...req, body: { data: { etablissement_gestionnaire_siret: "123456789" } } };

    await isAdminOrAllowed(reqWithSiretInFormation, next, TYPES.SIRET_IN_FORMATION);

    expect(next.calledOnce).to.be.true;
    expect(next.args[0]).to.eql([]);
  });
  it("should call next if user is an etablissement and active and is of type formationId", async () => {
    const reqWithFormationId = { ...req, params: { id: "some-id" } };

    const getFormationStub = sinon
      .stub(formationsService, "getFormation")
      .resolves({ success: true, body: { data: { etablissement_gestionnaire_siret: "123456789" } } });

    await isAdminOrAllowed(reqWithFormationId, next, TYPES.FORMATION_ID);

    expect(getFormationStub).to.have.been.calledOnceWith("some-id");
    expect(next.calledOnce).to.be.true;
    expect(next.calledWith()).to.be.true;
  });
  it("should call next if user is an etablissement and active and is of type formationIds", async () => {
    const reqWithFormationIds = { ...req, query: { id: ["some-id", "other-id"] } };

    const getFormationsStub = sinon.stub(formationsService, "getFormations").resolves({
      success: true,
      body: [
        { data: { etablissement_gestionnaire_siret: "123456789" } },
        { data: { etablissement_gestionnaire_siret: "987654321" } },
      ],
    });

    await isAdminOrAllowed(reqWithFormationIds, next, TYPES.FORMATION_IDS);

    expect(getFormationsStub).to.have.been.calledOnceWith({ id: ["some-id", "other-id"] });
    expect(next.calledOnce).to.be.true;
    expect(next.calledWith()).to.be.true;
  });

  it("should call next with an UnauthorizedError if user is not an admin or etablissement or is not active", async () => {
    const reqWithInactiveStatus = { ...req, user: { ...req.user, status: USER_STATUS.INACTIVE } };

    await isAdminOrAllowed(reqWithInactiveStatus, next, TYPES.CAMPAGNE_ID);

    expect(next.calledOnce).to.be.true;
    expect(next.getCall(0).args[0]).to.be.an.instanceof(UnauthorizedError);
  });
});
