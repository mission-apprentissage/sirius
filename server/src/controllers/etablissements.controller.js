const etablissementsService = require("../services/etablissements.service");
const {
  BasicError,
  EtablissementNotFoundError,
  EtablissementAlreadyExistingError,
  ErrorMessage,
} = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");

const createEtablissement = tryCatch(async (req, res) => {
  const { success, body } = await etablissementsService.createEtablissements(req.body, req.body[0].userId);

  if (!success && body?.message === ErrorMessage.EtablissementAlreadyExistingError)
    throw new EtablissementAlreadyExistingError();
  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

const getEtablissements = tryCatch(async (req, res) => {
  const search = req.query.search;
  const { success, body } = await etablissementsService.getEtablissements({ search });

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getEtablissementsWithTemoignageCount = tryCatch(async (req, res) => {
  const { success, body } = await etablissementsService.getEtablissementsWithTemoignageCount();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getEtablissement = tryCatch(async (req, res) => {
  const id = req.params.id;
  const { success, body } = await etablissementsService.getEtablissement(id);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const deleteEtablissement = tryCatch(async (req, res) => {
  const { success, body } = await etablissementsService.deleteEtablissement(req.params.id);

  if (!success) throw new BasicError();
  if (!body) throw new EtablissementNotFoundError();

  return res.status(200).json(body);
});

const updateEtablissement = tryCatch(async (req, res) => {
  const { success, body } = await etablissementsService.updateEtablissement(req.params.id, req.body);

  if (!success) throw new BasicError();
  if (!body) throw new EtablissementNotFoundError();

  return res.status(200).json(body);
});

const getEtablissementsSuivi = tryCatch(async (req, res) => {
  const { success, body } = await etablissementsService.getEtablissementsSuivi();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getEtablissementsPublicStatistics = tryCatch(async (req, res) => {
  const { success, body } = await etablissementsService.getEtablissementsPublicStatistics();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getEtablissementsWithCampagnesCount = tryCatch(async (req, res) => {
  const userSiret = req.user?.etablissements?.map((etablissement) => etablissement.siret);

  const { success, body } = await etablissementsService.getEtablissementsWithCampagnesCount({ userSiret });

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

module.exports = {
  createEtablissement,
  getEtablissements,
  getEtablissement,
  deleteEtablissement,
  updateEtablissement,
  getEtablissementsSuivi,
  getEtablissementsPublicStatistics,
  getEtablissementsWithTemoignageCount,
  getEtablissementsWithCampagnesCount,
};
