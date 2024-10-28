import { UNCOMPLIANT_TEMOIGNAGE_TYPE } from "../constants";
import {
  BasicError,
  CampagneEnded,
  CampagneNotStarted,
  ErrorMessage,
  NoSeatsAvailable,
  TemoignageNotFoundError,
} from "../errors";
import * as temoignagesService from "../services/temoignages.service";
import tryCatch from "../utils/tryCatch.utils";

export const createTemoignage = tryCatch(async (req: any, res: any) => {
  const { success, body } = await temoignagesService.createTemoignage(req.body);

  if (!success && body === ErrorMessage.CampagneNotStarted) throw new CampagneNotStarted();
  if (!success && body === ErrorMessage.CampagneEnded) throw new CampagneEnded();
  if (!success && body === ErrorMessage.NoSeatsAvailable) throw new NoSeatsAvailable();

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

export const getTemoignages = tryCatch(async (req: any, res: any) => {
  const { campagneId } = req.query;
  const { success, body } = await temoignagesService.getTemoignages([campagneId]);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const deleteTemoignage = tryCatch(async (req: any, res: any) => {
  const { success, body } = await temoignagesService.deleteTemoignage(req.params.id);

  if (!success) throw new BasicError();
  if (!body.modifiedCount) throw new TemoignageNotFoundError();

  return res.status(200).json(body);
});

export const updateTemoignage = tryCatch(async (req: any, res: any) => {
  const { success, body } = await temoignagesService.updateTemoignage(req.params.id, req.body);

  if (!success && body === ErrorMessage.CampagneNotStarted) throw new CampagneNotStarted();
  if (!success && body === ErrorMessage.CampagneEnded) throw new CampagneEnded();
  if (!success && body === ErrorMessage.NoSeatsAvailable) throw new NoSeatsAvailable();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getDatavisualisation = tryCatch(async (req: any, res: any) => {
  const campagneIds = req.body;

  if (!campagneIds.length) return res.status(200).json([]);

  const { success, body } = await temoignagesService.getDatavisualisation(campagneIds);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getDatavisualisationFormation = tryCatch(async (req: any, res: any) => {
  const intituleFormation = req.query.intituleFormation;

  const { success, body } = await temoignagesService.getDatavisualisationFormation(intituleFormation);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getDatavisualisationEtablissement = tryCatch(async (req: any, res: any) => {
  const uai = req.query.uai;

  const { success, body } = await temoignagesService.getDatavisualisationEtablissement(uai);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getUncompliantTemoignages = tryCatch(async (req: any, res: any) => {
  const type = req.query.type || UNCOMPLIANT_TEMOIGNAGE_TYPE.ALL;

  const duration = parseInt(req.query.duration) || 4;
  const answeredQuestions = parseInt(req.query.answeredQuestions) || 12;
  const includeUnavailableDuration = req.query.includeUnavailableDuration === "true";

  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 50;

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

export const deleteMultipleTemoignages = tryCatch(async (req: any, res: any) => {
  const { success, body } = await temoignagesService.deleteMultipleTemoignages(req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getXlsExport = async (req: any, res: any) => {
  try {
    const campagneIds = req.body;

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="sirius_export_reponses_brut.xlsx"');

    await temoignagesService.exportTemoignagesToXlsx(campagneIds, res);
  } catch (error) {
    res.status(500).json({ error: "Error generating Excel file", details: error });
  }
};
