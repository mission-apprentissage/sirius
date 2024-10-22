const campagnesService = require("../services/campagnes.service");
const { BasicError, CampagneNotFoundError } = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");
const { USER_ROLES } = require("../constants");

const getCampagnes = tryCatch(async (req, res) => {
  const isAdmin = req.user.role === USER_ROLES.ADMIN;
  const isObserver = req.user.role === USER_ROLES.OBSERVER;
  const scope = isObserver ? req.user.scope : null;
  const userSiret = req.user?.etablissements?.map((etablissement) => etablissement.siret);

  const page = req.body.page || 1;
  const pageSize = req.body.pageSize || 10;

  const diplome = req.body.diplome;
  const etablissementFormateurSiret = req.body.siret;
  const search = req.body.search;
  const departement = req.body.departement;

  let query = {};

  if (diplome) {
    query.diplome = diplome;
  }

  if (etablissementFormateurSiret) {
    query.etablissementFormateurSiret = etablissementFormateurSiret;
  }

  if (departement) {
    query.departement = departement;
  }

  const { success, body, ids, pagination } = await campagnesService.getCampagnes({
    isAdmin,
    isObserver,
    userSiret,
    scope,
    page,
    pageSize,
    query,
    search,
  });

  if (!success) throw new BasicError();

  return res.status(200).json({ body, ids, pagination });
});

const getCampagne = tryCatch(async (req, res) => {
  const campagneId = req.params.id;
  const { success, body } = await campagnesService.getOneCampagne(campagneId);

  if (!success) throw new BasicError();
  if (!body) throw new CampagneNotFoundError();

  return res.status(200).json(body);
});

const deleteCampagnes = tryCatch(async (req, res) => {
  const ids = req.query.ids.split(",");
  const { success, body } = await campagnesService.deleteCampagnes(ids);

  if (!success) throw new BasicError();
  if (!body) throw new CampagneNotFoundError();

  return res.status(200).json(body);
});

const updateCampagne = tryCatch(async (req, res) => {
  const { success, body } = await campagnesService.updateCampagne(req.params.id, req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const createCampagnes = tryCatch(async (req, res) => {
  const { success, body } = await campagnesService.createCampagnes(req.body, req.user.id);

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

const getPdfExport = tryCatch(async (req, res) => {
  const { success, body } = await campagnesService.getPdfExport(req.params.id);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getPdfMultipleExport = tryCatch(async (req, res) => {
  const ids = req.query.ids.split(",");
  const user = {
    label: req.user.firstName + " " + req.user.lastName,
    email: req.user.email,
  };

  const { success, body } = await campagnesService.getPdfMultipleExport(ids, user);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getXlsxMultipleExport = tryCatch(async (req, res) => {
  const ids = req.query.ids?.split(",");

  const { success, body } = await campagnesService.getXlsxMultipleExport(ids);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getCampagnesStatistics = tryCatch(async (req, res) => {
  const campagneIds = req.body;

  const { success, body } = await campagnesService.getCampagnesStatistics(campagneIds);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

module.exports = {
  getCampagnes,
  getCampagne,
  createCampagnes,
  deleteCampagnes,
  updateCampagne,
  getPdfExport,
  getPdfMultipleExport,
  getXlsxMultipleExport,
  getCampagnesStatistics,
};
