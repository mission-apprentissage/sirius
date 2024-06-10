const temoignagesService = require("../services/temoignages.service");
const {
  BasicError,
  TemoignageNotFoundError,
  CampagneNotStarted,
  CampagneEnded,
  NoSeatsAvailable,
  ErrorMessage,
} = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");
const { UNCOMPLIANT_TEMOIGNAGE_TYPE } = require("../constants");

const createTemoignage = tryCatch(async (req, res) => {
  const { success, body } = await temoignagesService.createTemoignage(req.body);

  if (!success && body === ErrorMessage.CampagneNotStarted) throw new CampagneNotStarted();
  if (!success && body === ErrorMessage.CampagneEnded) throw new CampagneEnded();
  if (!success && body === ErrorMessage.NoSeatsAvailable) throw new NoSeatsAvailable();

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

const getTemoignages = tryCatch(async (req, res) => {
  const { campagneId } = req.query;
  const { success, body } = await temoignagesService.getTemoignages([campagneId]);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const deleteTemoignage = tryCatch(async (req, res) => {
  const { success, body } = await temoignagesService.deleteTemoignage(req.params.id);

  if (!success) throw new BasicError();
  if (!body.modifiedCount) throw new TemoignageNotFoundError();

  return res.status(200).json(body);
});

const updateTemoignage = tryCatch(async (req, res) => {
  const { success, body } = await temoignagesService.updateTemoignage(req.params.id, req.body);

  if (!success && body === ErrorMessage.CampagneNotStarted) throw new CampagneNotStarted();
  if (!success && body === ErrorMessage.CampagneEnded) throw new CampagneEnded();
  if (!success && body === ErrorMessage.NoSeatsAvailable) throw new NoSeatsAvailable();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getDatavisualisation = tryCatch(async (req, res) => {
  const campagneIds = req.body;
  const { success, body } = await temoignagesService.getDatavisualisation(campagneIds);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getDatavisualisationFormation = tryCatch(async (req, res) => {
  const intituleFormation = req.query.intituleFormation;

  const { success, body } = await temoignagesService.getDatavisualisationFormation(intituleFormation);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getDatavisualisationEtablissement = tryCatch(async (req, res) => {
  const uai = req.query.uai;

  const { success, body } = await temoignagesService.getDatavisualisationEtablissement(uai);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getUncompliantTemoignages = tryCatch(async (req, res) => {
  const type = req.query.type || UNCOMPLIANT_TEMOIGNAGE_TYPE.ALL;

  const duration = parseInt(req.query.duration) || 4;
  const answeredQuestions = parseInt(req.query.answeredQuestions) || 12;
  const includeUnavailableDuration = req.query.includeUnavailableDuration === "true";

  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 100;

  const { success, body, count, pagination } = await temoignagesService.getUncompliantTemoignages({
    type,
    duration,
    answeredQuestions,
    includeUnavailableDuration,
    page,
    pageSize,
  });

  if (!success) throw new BasicError();

  return res.status(200).json({ body, count, pagination });
});

const deleteMultipleTemoignages = tryCatch(async (req, res) => {
  const { success, body } = await temoignagesService.deleteMultipleTemoignages(req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

module.exports = {
  createTemoignage,
  getTemoignages,
  deleteTemoignage,
  updateTemoignage,
  getDatavisualisation,
  getUncompliantTemoignages,
  deleteMultipleTemoignages,
  getDatavisualisationFormation,
  getDatavisualisationEtablissement,
};
