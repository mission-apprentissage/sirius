import type { Request, Response } from "express";

import { UNCOMPLIANT_TEMOIGNAGE_TYPE } from "../constants";
import { BasicError, CampagneEnded, CampagneNotStarted, ErrorMessage, NoSeatsAvailable } from "../errors";
import * as temoignagesService from "../services/temoignages.service";
import type { AuthedRequest } from "../types";
import tryCatch from "../utils/tryCatch.utils";

export const createTemoignage = tryCatch(async (req: Request, res: Response) => {
  const { success, body } = await temoignagesService.createTemoignage(req.body);

  if (!success && body === ErrorMessage.CampagneNotStarted) throw new CampagneNotStarted();
  if (!success && body === ErrorMessage.CampagneEnded) throw new CampagneEnded();
  if (!success && body === ErrorMessage.NoSeatsAvailable) throw new NoSeatsAvailable();

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

export const updateTemoignage = tryCatch(async (req: Request, res: Response) => {
  const { success, body } = await temoignagesService.updateTemoignage(req.params.id, req.body);

  if (!success && body === ErrorMessage.CampagneNotStarted) throw new CampagneNotStarted();
  if (!success && body === ErrorMessage.CampagneEnded) throw new CampagneEnded();
  if (!success && body === ErrorMessage.NoSeatsAvailable) throw new NoSeatsAvailable();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getDatavisualisation = tryCatch(async (req: AuthedRequest, res: Response) => {
  const campagneIds = req.body;

  if (!campagneIds.length) return res.status(200).json([]);

  const { success, body } = await temoignagesService.getDatavisualisation(campagneIds);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getDatavisualisationFormation = tryCatch(async (req: Request, res: Response) => {
  const intituleFormation = (req.query.intituleFormation as string) || null;
  const cfd = (req.query.cfd as string) || null;
  const idCertifInfo = (req.query.id_certifinfo as string) || null;
  const slug = (req.query.slug as string) || null;

  const { success, body } = await temoignagesService.getDatavisualisationFormation(
    intituleFormation,
    cfd,
    idCertifInfo,
    slug
  );

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getDatavisualisationFormationExists = tryCatch(async (req: Request, res: Response) => {
  const intituleFormation = (req.query.intituleFormation as string) || null;
  const cfd = (req.query.cfd as string) || null;
  const idCertifInfo = (req.query.id_certifinfo as string) || null;
  const slug = (req.query.slug as string) || null;
  if (!intituleFormation && !cfd && !idCertifInfo && !slug)
    return res.status(400).json({ hasData: false, message: "Missing parameters" });

  const { success, body } = await temoignagesService.getDatavisualisationFormationExists(
    intituleFormation,
    cfd,
    idCertifInfo,
    slug
  );

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getDatavisualisationEtablissement = tryCatch(async (req: Request, res: Response) => {
  const uai = req.query.uai as string;

  const { success, body } = await temoignagesService.getDatavisualisationEtablissement(uai);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getUncompliantTemoignages = tryCatch(async (req: AuthedRequest, res: Response) => {
  const type = ((req.query.type as string) ||
    UNCOMPLIANT_TEMOIGNAGE_TYPE.ALL) as (typeof UNCOMPLIANT_TEMOIGNAGE_TYPE)[keyof typeof UNCOMPLIANT_TEMOIGNAGE_TYPE];

  const duration = parseInt(req.query.duration as string) || 4;
  const answeredQuestions = parseInt(req.query.answeredQuestions as string) || 12;
  const includeUnavailableDuration = req.query.includeUnavailableDuration === "true";

  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 50;

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

export const deleteMultipleTemoignages = tryCatch(async (req: AuthedRequest, res: Response) => {
  const { success, body } = await temoignagesService.deleteMultipleTemoignages(req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getXlsExport = async (req: Request, res: Response) => {
  try {
    const campagneIds = req.body;

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="sirius_export_reponses_brut.xlsx"');

    await temoignagesService.exportTemoignagesToXlsx(campagneIds, res);
  } catch (error) {
    res.status(500).json({ error: "Error generating Excel file", details: error });
  }
};
