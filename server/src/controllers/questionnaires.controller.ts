import type { Request, Response } from "express";

import { BasicError, QuestionnaireNotFoundError } from "../errors";
import * as questionnairesService from "../services/questionnaires.service";
import type { AuthedRequest } from "../types";
import tryCatch from "../utils/tryCatch.utils";

export const createQuestionnaire = tryCatch(async (req: AuthedRequest, res: Response) => {
  const { success, body } = await questionnairesService.createQuestionnaire(req.body);

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

export const getQuestionnaires = tryCatch(async (_req: Request, res: Response) => {
  const { success, body } = await questionnairesService.getQuestionnaires();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getQuestionnaire = tryCatch(async (req: Request, res: Response) => {
  const { success, body } = await questionnairesService.getOneQuestionnaire(req.params.id);

  if (!success) throw new BasicError();
  if (!body) throw new QuestionnaireNotFoundError();

  return res.status(200).json(body);
});

export const deleteQuestionnaire = tryCatch(async (req: AuthedRequest, res: Response) => {
  const { success, body } = await questionnairesService.deleteQuestionnaire(req.params.id);

  if (!success) throw new BasicError();
  if (!body?.numUpdatedRows) throw new QuestionnaireNotFoundError();

  return res.status(200).json(body);
});

export const updateQuestionnaire = tryCatch(async (req: AuthedRequest, res: Response) => {
  const { success, body } = await questionnairesService.updateQuestionnaire(req.params.id, req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});
