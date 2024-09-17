const questionnairesService = require("../services/questionnaires.service");
const { QuestionnaireNotFoundError, BasicError } = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");

const createQuestionnaire = tryCatch(async (req, res) => {
  const { success, body } = await questionnairesService.createQuestionnaire(req.body);

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

const getQuestionnaires = tryCatch(async (req, res) => {
  const { success, body } = await questionnairesService.getQuestionnaires();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getQuestionnaire = tryCatch(async (req, res) => {
  const { success, body } = await questionnairesService.getOneQuestionnaire(req.params.id);

  if (!success) throw new BasicError();
  if (!body) throw new QuestionnaireNotFoundError();

  return res.status(200).json(body);
});

const deleteQuestionnaire = tryCatch(async (req, res) => {
  const { success, body } = await questionnairesService.deleteQuestionnaire(req.params.id);

  if (!success) throw new BasicError();
  if (!body.modifiedCount) throw new QuestionnaireNotFoundError();

  return res.status(200).json(body);
});

const updateQuestionnaire = tryCatch(async (req, res) => {
  const { success, body } = await questionnairesService.updateQuestionnaire(req.params.id, req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

module.exports = { createQuestionnaire, getQuestionnaires, deleteQuestionnaire, updateQuestionnaire, getQuestionnaire };
