import type { Request, Response } from "express";

import { USER_ROLES } from "../constants";
import { BasicError } from "../errors";
import * as formationsService from "../services/formations.service";
import type { AuthedRequest, ObserverScope } from "../types";
import tryCatch from "../utils/tryCatch.utils";

export const getFormations = tryCatch(async (req: AuthedRequest, res: Response) => {
  const search = req.query.search as string | undefined;
  const etablissementSiret = req.query.etablissementSiret as string | undefined;

  const { success, body } = await formationsService.getFormations({ search, etablissementSiret });

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getFormationsWithTemoignageCount = tryCatch(async (_req: Request, res: Response) => {
  const { success, body } = await formationsService.getFormationsWithTemoignageCount();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

export const getFormationsEtablissementsDiplomesWithCampagnesCount = tryCatch(
  async (req: AuthedRequest, res: Response) => {
    const isObserver = req.user?.role === USER_ROLES.OBSERVER;
    const isAdmin = req.user?.role === USER_ROLES.ADMIN;
    const scope = isObserver ? (req.user?.scope as ObserverScope) : undefined;
    const userSiret = isAdmin ? [] : req.user?.etablissements?.map((etablissement) => etablissement.siret);

    const { success, body } = await formationsService.getFormationsEtablissementsDiplomesWithCampagnesCount({
      userSiret,
      scope,
    });

    if (!success) throw new BasicError();

    return res.status(200).json(body);
  }
);
