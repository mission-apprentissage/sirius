import { BasicError } from "../errors";
import * as verbatimsService from "../services/verbatims.service";
import tryCatch from "../utils/tryCatch.utils";

export const getVerbatims = tryCatch(async (req: any, res: any) => {
  const query = req.query;

  const etablissementSiret = query.etablissementSiret || null;
  const formationId = query.formationId || null;
  const status = query.selectedStatus || null;
  const onlyDiscrepancies = query.showOnlyDiscrepancies || false;
  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.pageSize) || 100;

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

export const getVerbatimsCount = tryCatch(async (req: any, res: any) => {
  const query = req.query;

  const etablissementSiret = query.etablissementSiret || null;
  const formationId = query.formationId || null;

  const { success, body } = await verbatimsService.getVerbatimsCount({
    etablissementSiret,
    formationId,
  });

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const patchVerbatims = tryCatch(async (req: any, res: any) => {
  const { success, body } = await verbatimsService.patchVerbatims(req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const createVerbatim = tryCatch(async (req: any, res: any) => {
  const { success, body } = await verbatimsService.createVerbatim(req.body);

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});
