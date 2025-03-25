import type { Request, Response } from "express";

import { BasicError, ErrorMessage, EtablissementAlreadyExistingError } from "../errors";
import * as etablissementsService from "../services/etablissements.service";
import type { AuthedRequest } from "../types";
import tryCatch from "../utils/tryCatch.utils";

export const createEtablissement = tryCatch(async (req: AuthedRequest, res: Response) => {
  const { success, body } = await etablissementsService.createEtablissements(req.body, req.body[0].userId);

  if (!success && body?.message === ErrorMessage.EtablissementAlreadyExistingError)
    throw new EtablissementAlreadyExistingError();
  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

export const getEtablissements = tryCatch(async (req: AuthedRequest, res: Response) => {
  const search = req.query.search === "string" ? req.query.search : "";
  const { success, body } = await etablissementsService.getEtablissements({ search });

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getEtablissementsWithTemoignageCount = tryCatch(async (_req: Request, res: Response) => {
  const { success, body } = await etablissementsService.getEtablissementsWithTemoignageCount();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getEtablissementsSuivi = tryCatch(async (_req: AuthedRequest, res: Response) => {
  const { success, body } = await etablissementsService.getEtablissementsSuivi();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getEtablissementsPublicStatistics = tryCatch(async (_req: Request, res: Response) => {
  const { success, body } = await etablissementsService.getEtablissementsPublicStatistics();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});
