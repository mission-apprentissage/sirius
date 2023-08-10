const { UnauthorizedError } = require("../errors");
const { ROLES, STATUS } = require("../constants");
const campagnesService = require("../services/campagnes.service");
const etablissementsService = require("../services/etablissements.service");
const formationsService = require("../services/formations.service");

const TYPES = {
  CAMPAGNE_ID: "campagneId",
  ETABLISSEMENT_ID: "etablissementId",
  FORMATION_ID: "formationId",
  FORMATION_IDS: "formationIds",
  SIRET_IN_FORMATION: "siretInFormation",
  SIRET: "siret",
};

const isAdminOrAllowed = async (req, next, type) => {
  const { status, role, siret } = req.user;

  if (role === ROLES.ADMIN && status === STATUS.ACTIVE) {
    return next();
  }

  if (role === ROLES.USER && status === STATUS.ACTIVE) {
    // check campagneId
    if (type === TYPES.CAMPAGNE_ID) {
      const query = { id: req.params.id, siret: siret };
      const { body } = await campagnesService.getOneCampagne(query);

      if (body) return next();
    }

    //check SIRET
    if (type === TYPES.SIRET) {
      const siretToVerify = req.params.siret || req.query.siret || req.body.siret || req.query["data.siret"];
      if (siret === siretToVerify) return next();
    }

    //check etablissementId
    if (type === TYPES.ETABLISSEMENT_ID) {
      const { body } = await etablissementsService.getEtablissement(req.params.id);
      if (body && body.data.siret === siret) return next();
    }

    //check formation related to etablissement siret
    if (type === TYPES.SIRET_IN_FORMATION) {
      const siretGestionnaire = req.body.data.etablissement_gestionnaire_siret;
      const siretFormateur = req.body.data.etablissement_formateur_siret;

      if (siret === siretGestionnaire || siret === siretFormateur) return next();
    }

    //check formationId
    if (type === TYPES.FORMATION_ID) {
      const formationId = req.params.id;
      const { body } = await formationsService.getFormation(formationId);
      const siretGestionnaire = body.data.etablissement_gestionnaire_siret;
      const siretFormateur = body.data.etablissement_formateur_siret;

      if (siret === siretGestionnaire || siret === siretFormateur) return next();
    }

    //check formationIds
    if (type === TYPES.FORMATION_IDS) {
      const { body: formations } = await formationsService.getFormations(req.query);

      const formationsSiret = formations.map((formation) => ({
        siretGestionnaire: formation.data.etablissement_gestionnaire_siret,
        siretformateur: formation.data.etablissement_formateur_siret,
      }));

      const isOwnFormations = formationsSiret.every(
        (formationSiret) => siret === formationSiret.siretGestionnaire || siret === formationSiret.siretFormateur
      );

      if (req.query.id.length && isOwnFormations) return next();
    }
  }

  return next(new UnauthorizedError());
};

module.exports = { isAdminOrAllowed, TYPES };
