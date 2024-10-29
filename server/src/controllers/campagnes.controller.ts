// @ts-nocheck -- TODO
import { USER_ROLES } from "../constants";
import { BasicError, CampagneNotFoundError } from "../errors";
import * as campagnesService from "../services/campagnes.service";
import tryCatch from "../utils/tryCatch.utils";

export const getCampagnes = tryCatch(async (req: any, res: any) => {
  const isObserver = req.user.role === USER_ROLES.OBSERVER;
  const scope = isObserver ? req.user.scope : null;

  const page = req.body.page || 1;
  const pageSize = req.body.pageSize || 10;

  const diplome = req.body.diplome;
  const siret = req.body.siret;
  const search = req.body.search;
  const departement = req.body.departement;

  const query = {};

  if (diplome) {
    query.diplome = diplome;
  }

  if (siret) {
    query.siret = siret;
  }

  if (departement) {
    query.departement = departement;
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

export const getCampagne = tryCatch(async (req: any, res: any) => {
  const campagneId = req.params.id;
  const { success, body } = await campagnesService.getOneCampagne(campagneId);

  if (!success) throw new BasicError();
  if (!body) throw new CampagneNotFoundError();

  return res.status(200).json(body);
});

export const createCampagnes = tryCatch(async (req: any, res: any) => {
  const { success, body } = await campagnesService.createCampagnes(req.body, req.user.id);

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

export const deleteCampagnes = tryCatch(async (req: any, res: any) => {
  const ids = req.query.ids.split(",");
  const { success, body } = await campagnesService.deleteCampagnes(ids);

  if (!success) throw new BasicError();
  if (!body) throw new CampagneNotFoundError();

  return res.status(200).json(body);
});

export const updateCampagne = tryCatch(async (req: any, res: any) => {
  const { success, body } = await campagnesService.updateCampagne(req.params.id, req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getPdfExport = tryCatch(async (req: any, res: any) => {
  const { success, body } = await campagnesService.getPdfExport(req.params.id);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getPdfMultipleExport = tryCatch(async (req: any, res: any) => {
  const ids = req.query.ids.split(",");
  const user = {
    label: req.user.firstName + " " + req.user.lastName,
    email: req.user.email,
  };

  const { success, body } = await campagnesService.getPdfMultipleExport(ids, user);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getXlsxMultipleExport = tryCatch(async (req: any, res: any) => {
  const ids = req.query.ids?.split(",");

  const { success, body } = await campagnesService.getXlsxMultipleExport(ids);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getCampagnesStatistics = tryCatch(async (req: any, res: any) => {
  const campagneIds = req.body;

  const { success, body } = await campagnesService.getCampagnesStatistics(campagneIds);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});
