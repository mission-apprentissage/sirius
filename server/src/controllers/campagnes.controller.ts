import type { Request, Response } from "express";

import { USER_ROLES } from "../constants";
import { BasicError, CampagneNotFoundError } from "../errors";
import * as campagnesService from "../services/campagnes.service";
import type { AuthedRequest, ObserverScope } from "../types";
import tryCatch from "../utils/tryCatch.utils";

export const getCampagnes = tryCatch(async (req: AuthedRequest, res: Response) => {
  const isObserver = !!(req.user.role === USER_ROLES.OBSERVER);
  const scope: ObserverScope | null = isObserver ? req.user.scope : null;

  const page = parseInt(req.body.page) || 1;
  const pageSize = req.body.pageSize || 10;

  const campagneIds = req.body.campagneIds;
  const diplome = req.body.diplome;
  const siret = req.body.siret;
  const search = req.body.search;
  const departement = req.body.departement;

  const query: {
    diplome?: string[];
    siret?: string[];
    departement?: string;
    campagneIds?: string[];
  } = {};

  if (diplome) {
    query.diplome = diplome;
  }

  if (siret) {
    query.siret = siret;
  }

  if (departement) {
    query.departement = departement;
  }

  if (campagneIds) {
    query.campagneIds = campagneIds;
  }

  const { success, body, ids, pagination } = await campagnesService.getCampagnes({
    isObserver,
    scope,
    page,
    pageSize,
    query,
    search,
  });

  if (!success) throw new BasicError();

  return res.status(200).json({ body, ids, pagination });
});

export const getCampagne = tryCatch(async (req: Request, res: Response) => {
  const campagneId = req.params.id;
  const { success, body } = await campagnesService.getOneCampagne(campagneId);

  if (!success) throw new BasicError();
  if (!body) throw new CampagneNotFoundError();

  return res.status(200).json(body);
});

export const createCampagnes = tryCatch(async (req: AuthedRequest, res: Response) => {
  const { success, body } = await campagnesService.createCampagnes(req.body, req.user.id);

  if (!success) throw new BasicError(body);

  return res.status(201).json(body);
});

export const deleteCampagnes = tryCatch(async (req: AuthedRequest, res: Response) => {
  const ids = typeof req.query.ids === "string" ? req.query.ids.split(",") : [];

  const { success, body } = await campagnesService.deleteCampagnes(ids);

  if (!success) throw new BasicError();
  if (!body) throw new CampagneNotFoundError();

  return res.status(200).json(body);
});

export const updateCampagne = tryCatch(async (req: AuthedRequest, res: Response) => {
  const { success, body } = await campagnesService.updateCampagne(req.params.id, req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getPdfMultipleExport = tryCatch(async (req: AuthedRequest, res: Response) => {
  const ids = typeof req.query.ids === "string" ? req.query.ids.split(",") : [];

  const displayedUser = {
    label: req.user.firstName + " " + req.user.lastName,
    email: req.user.email,
  };

  const { success, body } = await campagnesService.getPdfMultipleExport(ids, displayedUser);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getXlsxMultipleExport = tryCatch(async (req: AuthedRequest, res: Response) => {
  const ids = typeof req.query.ids === "string" ? req.query.ids.split(",") : [];

  const { success, body } = await campagnesService.getXlsxMultipleExport(ids);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getCampagnesStatistics = tryCatch(async (req: AuthedRequest, res: Response) => {
  const campagneIds = req.body;

  const { success, body } = await campagnesService.getCampagnesStatistics(campagneIds);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});
