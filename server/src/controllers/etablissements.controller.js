const etablissementsService = require("../services/etablissements.service");
const {
  BasicError,
  EtablissementNotFoundError,
  EtablissementAlreadyExistingError,
  ErrorMessage,
} = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");

const createEtablissement = tryCatch(async (req, res) => {
  const { success, body } = await etablissementsService.createEtablissements(req.body);

  if (!success && body?.message === ErrorMessage.EtablissementAlreadyExistingError)
    throw new EtablissementAlreadyExistingError();
  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

const getEtablissements = tryCatch(async (req, res) => {
  const query = req.query;
  const { success, body } = await etablissementsService.getEtablissements(query);

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
  if (!body.modifiedCount) throw new EtablissementNotFoundError();

  return res.status(200).json(body);
});

const updateEtablissement = tryCatch(async (req, res) => {
  const { success, body } = await etablissementsService.updateEtablissement(req.params.id, req.body);

  if (!success) throw new BasicError();
  if (!body.modifiedCount) throw new EtablissementNotFoundError();

  return res.status(200).json(body);
});

const getEtablissementsSuivi = tryCatch(async (req, res) => {
  const { success, body } = await etablissementsService.getEtablissementsSuivi();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getEtablissementsPublicSuivi = tryCatch(async (req, res) => {
  const { success, body } = await etablissementsService.getEtablissementsSuivi();

  if (!success) throw new BasicError();

  const createdCampagnesCount = body.reduce(
    (accumulator, etablissement) => accumulator + etablissement.campagneIds.length,
    0
  );

  const temoignagesCount = body.reduce((accumulator, etablissement) => accumulator + etablissement.temoignagesCount, 0);

  const champsLibreCount = body.reduce((accumulator, etablissement) => accumulator + etablissement.champsLibreCount, 0);

  return res.status(200).json({
    etablissementsCount: body.length,
    createdCampagnesCount,
    temoignagesCount,
    champsLibreCount,
  });
});

module.exports = {
  createEtablissement,
  getEtablissements,
  getEtablissement,
  deleteEtablissement,
  updateEtablissement,
  getEtablissementsSuivi,
  getEtablissementsPublicSuivi,
};
