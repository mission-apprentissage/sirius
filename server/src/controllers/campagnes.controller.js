const campagnesService = require("../services/campagnes.service");
const { BasicError, CampagneNotFoundError, SortingTypeNotFoundError } = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");
const { USER_ROLES, CAMPAGNE_SORTING_TYPE } = require("../constants");

const getCampagnes = tryCatch(async (req, res) => {
  const isAdmin = req.user.role === USER_ROLES.ADMIN;
  const isObserver = req.user.role === USER_ROLES.OBSERVER;
  const scope = isObserver ? req.user.scope : null;
  const userSiret = req.user.etablissements.map((etablissement) => etablissement.siret);

  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;

  const diplome = req.query.diplome;
  const etablissementFormateurSiret = req.query.etablissementFormateurSiret;
  const search = req.query.search;
  const departement = req.query.departement;

  let query = {};

  if (diplome) {
    query = { diplome };
  }

  if (diplome && diplome === "N/A") {
    query = { diplome: { $exists: false } };
  }

  if (etablissementFormateurSiret) {
    query = { etablissementFormateurSiret };
  }

  if (etablissementFormateurSiret && etablissementFormateurSiret === "N/A") {
    query = { etablissementFormateurSiret: { $exists: false } };
  }

  if (departement) {
    query = { departement };
  }

  const { success, body, pagination } = await campagnesService.getCampagnes({
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

  return res.status(200).json({ body, pagination });
});

const getCampagne = tryCatch(async (req, res) => {
  const query = { id: req.params.id };
  const { success, body } = await campagnesService.getOneCampagne(query);

  if (!success) throw new BasicError();
  if (!body) throw new CampagneNotFoundError();

  return res.status(200).json(body);
});

const createCampagne = tryCatch(async (req, res) => {
  const { success, body } = await campagnesService.createCampagne(req.body);

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

const deleteCampagnes = tryCatch(async (req, res) => {
  const ids = req.query.ids.split(",");
  const { success, body } = await campagnesService.deleteCampagnes(ids);

  if (!success) throw new BasicError();
  if (body.modifiedCount === 0) throw new CampagneNotFoundError();

  return res.status(200).json(body);
});

const updateCampagne = tryCatch(async (req, res) => {
  const { success, body } = await campagnesService.updateCampagne(req.params.id, req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const createMultiCampagne = tryCatch(async (req, res) => {
  const { success, body } = await campagnesService.createMultiCampagne(req.body);

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

const getSortedCampagnes = tryCatch(async (req, res) => {
  const isAdmin = req.user.role === USER_ROLES.ADMIN;
  const isObserver = req.user.role === USER_ROLES.OBSERVER;
  const scope = isObserver ? req.user.scope : null;

  const { type } = req.query;

  if (!Object.keys(CAMPAGNE_SORTING_TYPE).includes(type)) {
    throw new SortingTypeNotFoundError();
  }

  const userSiret = req.user.etablissements.map((etablissement) => etablissement.siret);

  const { success, body } = await campagnesService.getSortedCampagnes(isAdmin, isObserver, userSiret, type, scope);

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
  createCampagne,
  deleteCampagnes,
  updateCampagne,
  createMultiCampagne,
  getPdfExport,
  getPdfMultipleExport,
  getXlsxMultipleExport,
  getSortedCampagnes,
  getCampagnesStatistics,
};
