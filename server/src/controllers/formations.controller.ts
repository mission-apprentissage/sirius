// @ts-nocheck -- TODO

import { BasicError, ErrorMessage, FormationAlreadyExistingError, FormationNotFoundError } from "../errors";
import * as formationsService from "../services/formations.service";
import tryCatch from "../utils/tryCatch.utils";

export const createFormation = tryCatch(async (req: any, res: any) => {
  const { success, body } = await formationsService.createFormation(req.body);

  if (!success && body.message === ErrorMessage.FormationAlreadyExistingError)
    throw new FormationAlreadyExistingError();
  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

export const getFormations = tryCatch(async (req: any, res: any) => {
  const search = req.query.search;
  const etablissementSiret = req.query.etablissementSiret;

  const { success, body } = await formationsService.getFormations({ search, etablissementSiret });

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getFormationsWithTemoignageCount = tryCatch(async (_req: any, res: any) => {
  const { success, body } = await formationsService.getFormationsWithTemoignageCount();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getFormation = tryCatch(async (req: any, res: any) => {
  const id = req.params.id;
  const { success, body } = await formationsService.getFormation(id);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const deleteFormation = tryCatch(async (req: any, res: any) => {
  const { success, body } = await formationsService.deleteFormation(req.params.id);

  if (!success) throw new BasicError();
  if (!body.deletedCount) throw new FormationNotFoundError();

  return res.status(200).json(body);
});

export const updateFormation = tryCatch(async (req: any, res: any) => {
  const { success, body } = await formationsService.updateFormation(req.params.id, req.body);

  if (!success) throw new BasicError();
  if (!body.modifiedCount) throw new FormationNotFoundError();

  return res.status(200).json(body);
});

export const alreadyExistingFormations = tryCatch(async (req: any, res: any) => {
  const { success, body } = await formationsService.alreadyExistingFormations(req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});
