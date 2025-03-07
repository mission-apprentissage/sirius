import type { Request, Response } from "express";

import { BasicError } from "../errors";
import * as verbatimsService from "../services/verbatims.service";
import type { AuthedRequest, VerbatimStatus } from "../types";
import tryCatch from "../utils/tryCatch.utils";

export const getVerbatims = tryCatch(async (req: AuthedRequest, res: Response) => {
  const query = req.query;

  const etablissementSiret = (query.etablissementSiret as string) || null;
  const formationId = (query.formationId as string) || null;
  const status = (query.selectedStatus as VerbatimStatus) || null;
  const onlyDiscrepancies = query.showOnlyDiscrepancies === "true";
  const page = parseInt(query.page as string) || 1;
  const pageSize = parseInt(query.pageSize as string) || 100;

  const { success, body, pagination } = await verbatimsService.getVerbatims({
    etablissementSiret,
    formationId,
    status,
    onlyDiscrepancies,
    page,
    pageSize,
  });

  if (!success) throw new BasicError();

  return res.status(200).json({ body, pagination });
});

export const getVerbatimsCount = tryCatch(async (req: AuthedRequest, res: Response) => {
  const query = req.query;

  const etablissementSiret = (query.etablissementSiret as string) || null;
  const formationId = (query.formationId as string) || null;

  const { success, body } = await verbatimsService.getVerbatimsCount({
    etablissementSiret,
    formationId,
  });

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const patchVerbatims = tryCatch(async (req: AuthedRequest, res: Response) => {
  const { success, body } = await verbatimsService.patchVerbatims(req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const createVerbatim = tryCatch(async (req: Request, res: Response) => {
  const { success, body } = await verbatimsService.createVerbatim(req.body);

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

export const feedbackVerbatim = tryCatch(async (req: Request, res: Response) => {
  const id = req.params.id;
  let { isUseful } = req.body;
  isUseful = isUseful === "true";
  const { success, body } = await verbatimsService.feedbackVerbatim(id, isUseful);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});
