import camelcaseKeys from "camelcase-keys";
import decamelizeKeys from "decamelize-keys";
import { sql } from "kysely";
import { executeWithOffsetPagination } from "kysely-paginate";

import { getKbdClient } from "../db/db";
import type { Verbatim, VerbatimCreation, VerbatimScore, VerbatimStatus, VerbatimThemes } from "../types";
import type {
  CountArgs,
  GetAllArgs,
  GetAllResults,
  GetAllWithFormationAndCampagneResult,
  GetAllWithFormationResults,
} from "./types/verbatims.types";

const transformRow = (row: any) => {
  const { scores, themes, ...otherProps } = row;
  return {
    ...camelcaseKeys(otherProps, { deep: true }),
    scores,
    themes,
  };
};

export const getAll = async (query: GetAllArgs): GetAllResults => {
  let dbQuery = getKbdClient()
    .selectFrom("verbatims")
    .select([
      "verbatims.id",
      "verbatims.temoignage_id",
      "verbatims.status",
      "verbatims.question_key",
      sql<string>`COALESCE(verbatims.content_corrected_anonymized, verbatims.content_corrected, verbatims.content)`.as(
        "content"
      ),
      sql<VerbatimScore | null>`verbatims.scores`.as("scores"),
      sql<VerbatimThemes | null>`verbatims.themes`.as("themes"),
      "verbatims.feedback_count",
      "verbatims.deleted_at",
      "verbatims.created_at",
      "verbatims.updated_at",
    ])
    .where("temoignage_id", "in", query.temoignageIds)
    .where("status", "in", query.status);

  if (query.questionKey) {
    dbQuery = dbQuery.where("question_key", "in", query.questionKey);
  }

  const results = await dbQuery.execute();

  return camelcaseKeys(results);
};

export const count = async (query: CountArgs): Promise<{ status: VerbatimStatus; count: number }[]> => {
  let baseQuery = getKbdClient()
    .selectFrom("verbatims")
    .leftJoin("temoignages", "verbatims.temoignage_id", "temoignages.id")
    .leftJoin("temoignages_campagnes", "temoignages.id", "temoignages_campagnes.temoignage_id")
    .leftJoin("formations_campagnes", "temoignages_campagnes.campagne_id", "formations_campagnes.campagne_id")
    .leftJoin("formations", "formations_campagnes.formation_id", "formations.id")
    .where("verbatims.deleted_at", "is", null)
    .where("formations.deleted_at", "is", null)
    .where("temoignages.deleted_at", "is", null);

  if (query?.etablissementSiret) {
    baseQuery = baseQuery.where("formations.etablissement_formateur_siret", "=", query.etablissementSiret);
  }

  if (query?.formationId) {
    baseQuery = baseQuery.where("formations.id", "=", query.formationId);
  }

  if (query?.temoignageIds) {
    baseQuery = baseQuery.where("verbatims.temoignage_id", "in", query.temoignageIds);
  }

  if (query?.questionKey) {
    baseQuery = baseQuery.where("verbatims.question_key", "in", query.questionKey);
  }

  if (query?.status) {
    baseQuery = baseQuery.where("verbatims.status", "=", query.status);
  }

  const result = await baseQuery
    .select(["verbatims.status", sql<number>`count(*)`.as("count")])
    .groupBy("verbatims.status")
    .execute();

  return result.map((row) => ({
    status: row.status,
    count: row.count,
  }));
};

export const getAllWithFormation = async (
  query: {
    etablissementSiret?: string;
    formationId?: string;
    status?: VerbatimStatus;
  } = {},
  onlyDiscrepancies: boolean,
  page = 1,
  pageSize = 100
): GetAllWithFormationResults => {
  let baseQuery = getKbdClient()
    .selectFrom("verbatims")
    .select([
      "verbatims.id",
      "verbatims.question_key",
      "verbatims.content",
      "verbatims.content_corrected",
      "verbatims.content_corrected_anonymized",
      "verbatims.is_corrected",
      "verbatims.is_anonymized",
      "verbatims.correction_justification",
      "verbatims.anonymization_justification",
      "verbatims.status",
      "verbatims.created_at",
      sql<VerbatimScore | null>`verbatims.scores`.as("scores"),
      sql<any>`json_build_object(
        'intitule_long', formations.intitule_long,
        'etablissement_formateur_enseigne', formations.etablissement_formateur_enseigne,
        'etablissement_formateur_entreprise_raison_sociale', formations.etablissement_formateur_entreprise_raison_sociale,
        'etablissement_formateur_siret', formations.etablissement_formateur_siret
      )`.as("formation"),
    ])
    .leftJoin("temoignages", "verbatims.temoignage_id", "temoignages.id")
    .leftJoin("temoignages_campagnes", "temoignages.id", "temoignages_campagnes.temoignage_id")
    .leftJoin("formations_campagnes", "temoignages_campagnes.campagne_id", "formations_campagnes.campagne_id")
    .leftJoin("formations", "formations_campagnes.formation_id", "formations.id")
    .where("verbatims.deleted_at", "is", null)
    .where("formations.deleted_at", "is", null)
    .where("temoignages.deleted_at", "is", null)
    .groupBy(["verbatims.id", "temoignages.id", "temoignages_campagnes.id", "formations.id"]);

  if (query.etablissementSiret) {
    baseQuery = baseQuery.where("formations.etablissement_formateur_siret", "=", query.etablissementSiret);
  }

  if (query.formationId) {
    baseQuery = baseQuery.where("formations.id", "=", query.formationId);
  }

  if (query.status) {
    baseQuery = baseQuery.where("verbatims.status", "=", query.status);
  }

  if (onlyDiscrepancies) {
    const maxScoreKeySQL = sql`
      CASE 
        WHEN verbatims.scores IS NOT NULL 
        THEN (
            jsonb_build_object(
                'GEM', 
                CASE 
                    WHEN verbatims.scores->'GEM'->>'avis' = 'oui' THEN 1
                    WHEN verbatims.scores->'GEM'->>'avis' = 'non' THEN 0
                    ELSE NULL
                END
            ) || (verbatims.scores - 'GEM')
        )
      END
    `;

    const highestScoreKeySQL = sql`
      (SELECT key
       FROM jsonb_each(
            ${maxScoreKeySQL}
       )
       ORDER BY value::numeric DESC 
       LIMIT 1
      )
    `;

    baseQuery = baseQuery
      .select(maxScoreKeySQL.as("maxScoreKey"))
      .select(highestScoreKeySQL.as("highestScoreKey"))
      .where(highestScoreKeySQL, sql`IS DISTINCT FROM`, query.status);
  }

  const result = await executeWithOffsetPagination(baseQuery, {
    page: Number(page),
    perPage: Number(pageSize),
  });

  const transformedResult = {
    ...result,
    rows: result.rows.map(transformRow),
  };

  return transformedResult;
};

export const getAllWithFormationAndCampagne = async (
  temoignagesIds: string[],
  status: VerbatimStatus[]
): Promise<GetAllWithFormationAndCampagneResult> => {
  const baseQuery = getKbdClient()
    .selectFrom("verbatims")
    .leftJoin("temoignages", "verbatims.temoignage_id", "temoignages.id")
    .leftJoin("temoignages_campagnes", "temoignages.id", "temoignages_campagnes.temoignage_id")
    .leftJoin("campagnes", "temoignages_campagnes.campagne_id", "campagnes.id")
    .leftJoin("formations_campagnes", "temoignages_campagnes.campagne_id", "formations_campagnes.campagne_id")
    .leftJoin("formations", "formations_campagnes.formation_id", "formations.id")
    .select([
      "verbatims.id",
      "verbatims.question_key",
      sql<string>`COALESCE(verbatims.content_corrected_anonymized, verbatims.content_corrected, verbatims.content)`.as(
        "content"
      ),
      "verbatims.status",
      "campagnes.nom_campagne",
      "campagnes.questionnaire_id",
      sql<any>`json_build_object(
        'intitule_long', formations.intitule_long,
        'etablissement_formateur_enseigne', formations.etablissement_formateur_enseigne,
        'etablissement_formateur_entreprise_raison_sociale', formations.etablissement_formateur_entreprise_raison_sociale,
        'etablissement_formateur_siret', formations.etablissement_formateur_siret,
        'localite', formations.localite
      )`.as("formation"),
    ])
    .where("verbatims.temoignage_id", "in", temoignagesIds)
    .where("verbatims.status", "in", status)
    .where("verbatims.deleted_at", "is", null)
    .where("formations.deleted_at", "is", null)
    .where("temoignages.deleted_at", "is", null);

  const result = await baseQuery.execute();

  return camelcaseKeys(result, { deep: true });
};

export const updateOne = async (id: string, update: Partial<Verbatim>): Promise<{ id: string } | undefined> => {
  return getKbdClient()
    .updateTable("verbatims")
    .set(decamelizeKeys(update))
    .where("id", "=", id)
    .returning("id")
    .executeTakeFirst();
};

export const updateMany = async (verbatims: Partial<Verbatim>[]): Promise<boolean[]> => {
  const promises = verbatims.map(async ({ id, ...update }) => {
    const result = await getKbdClient()
      .updateTable("verbatims")
      .set(decamelizeKeys(update))
      .where("id", "=", id as string)
      .executeTakeFirst();

    return result.numUpdatedRows === BigInt(1);
  });

  return Promise.all(promises);
};

export const create = async (verbatim: VerbatimCreation): Promise<{ id: string } | undefined> => {
  return getKbdClient().insertInto("verbatims").values(decamelizeKeys(verbatim)).returning("id").executeTakeFirst();
};

export const getOneByTemoignageIdAndQuestionKey = async (query: {
  temoignageId: string;
  questionKey: string;
}): Promise<Verbatim | undefined> => {
  const baseQuery = getKbdClient()
    .selectFrom("verbatims")
    .select([
      "verbatims.id",
      "verbatims.temoignage_id",
      "verbatims.question_key",
      "verbatims.content",
      "verbatims.content_corrected",
      "verbatims.correction_justification",
      "verbatims.anonymization_justification",
      "verbatims.content_corrected_anonymized",
      "verbatims.status",
      sql<VerbatimScore | null>`verbatims.scores`.as("scores"),
      sql<VerbatimThemes | null>`verbatims.themes`.as("themes"),
      "verbatims.feedback_count",
      "verbatims.is_corrected",
      "verbatims.is_anonymized",
      "verbatims.created_at",
      "verbatims.updated_at",
      "verbatims.deleted_at",
    ])
    .where("temoignage_id", "=", query.temoignageId)
    .where("question_key", "=", query.questionKey);

  const result = await baseQuery.executeTakeFirst();

  return result ? camelcaseKeys(result) : undefined;
};

export const getOneById = async (id: string): Promise<Verbatim | undefined> => {
  const baseQuery = getKbdClient()
    .selectFrom("verbatims")
    .select([
      "verbatims.id",
      "verbatims.temoignage_id",
      "verbatims.question_key",
      "verbatims.content",
      "verbatims.content_corrected",
      "verbatims.correction_justification",
      "verbatims.anonymization_justification",
      "verbatims.content_corrected_anonymized",
      "verbatims.status",
      sql<VerbatimScore | null>`verbatims.scores`.as("scores"),
      sql<VerbatimThemes | null>`verbatims.themes`.as("themes"),
      "verbatims.feedback_count",
      "verbatims.is_corrected",
      "verbatims.is_anonymized",
      "verbatims.created_at",
      "verbatims.updated_at",
      "verbatims.deleted_at",
    ])
    .where("id", "=", id);

  const result = await baseQuery.executeTakeFirst();

  return result ? camelcaseKeys(result) : undefined;
};

export const deleteManyByCampagneIds = async (campagneIds: string[]): Promise<boolean> => {
  const temoignages = await getKbdClient()
    .selectFrom("temoignages_campagnes")
    .select("temoignage_id")
    .where("campagne_id", "in", campagneIds)
    .execute();

  const temoignagesIds = temoignages.map((t) => t.temoignage_id);

  if (temoignagesIds.length === 0) {
    return true;
  }

  return (await getKbdClient()
    .updateTable("verbatims")
    .set({ deleted_at: new Date() })
    .where("temoignage_id", "in", temoignagesIds)
    .execute())
    ? true
    : false;
};
