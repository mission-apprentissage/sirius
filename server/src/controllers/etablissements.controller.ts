import { BasicError, ErrorMessage, EtablissementAlreadyExistingError, EtablissementNotFoundError } from "../errors";
import * as etablissementsService from "../services/etablissements.service";
import tryCatch from "../utils/tryCatch.utils";

export const createEtablissement = tryCatch(async (req: any, res: any) => {
  const { success, body } = await etablissementsService.createEtablissements(req.body, req.body[0].userId);

  if (!success && body?.message === ErrorMessage.EtablissementAlreadyExistingError)
    throw new EtablissementAlreadyExistingError();
  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

export const getEtablissements = tryCatch(async (req: any, res: any) => {
  const search = req.query.search;
  const { success, body } = await etablissementsService.getEtablissements({ search });

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getEtablissementsWithTemoignageCount = tryCatch(async (_req: any, res: any) => {
  const { success, body } = await etablissementsService.getEtablissementsWithTemoignageCount();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getEtablissement = tryCatch(async (req: any, res: any) => {
  const id = req.params.id;
  const { success, body } = await etablissementsService.getEtablissement(id);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const deleteEtablissement = tryCatch(async (req: any, res: any) => {
  const { success, body } = await etablissementsService.deleteEtablissement(req.params.id);

  if (!success) throw new BasicError();
  if (!body) throw new EtablissementNotFoundError();

  return res.status(200).json(body);
});

export const updateEtablissement = tryCatch(async (req: any, res: any) => {
  const { success, body } = await etablissementsService.updateEtablissement(req.params.id, req.body);

  if (!success) throw new BasicError();
  if (!body) throw new EtablissementNotFoundError();

  return res.status(200).json(body);
});

export const getEtablissementsSuivi = tryCatch(async (_req: any, res: any) => {
  const { success, body } = await etablissementsService.getEtablissementsSuivi();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getEtablissementsPublicStatistics = tryCatch(async (_req: any, res: any) => {
  const { success, body } = await etablissementsService.getEtablissementsPublicStatistics();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});
