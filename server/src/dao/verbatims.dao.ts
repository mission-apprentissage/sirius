import { sql } from "kysely";
import { executeWithOffsetPagination } from "kysely-paginate";

import { getKbdClient } from "../db/db";
import type { Verbatim } from "../types";

export const getAll = async (query: {
  temoignageIds: string[];
  status: string[];
  questionKey?: string;
}): Promise<
  Omit<
    Verbatim,
    | "content_corrected"
    | "content_corrected_anonymized"
    | "is_corrected"
    | "is_anonymized"
    | "anonymization_justification"
    | "correction_justification"
  >[]
> => {
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
      "verbatims.scores",
      "verbatims.themes",
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

  return dbQuery.execute();
};

export const count = async (
  query: Partial<{
    temoignageIds: string[];
    questionKey: string[];
    etablissementSiret: string;
    formationId: string;
    status: string;
  }>
) => {
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
    .select(["verbatims.status", sql`count(*)`.as("count")])
    .groupBy("verbatims.status")
    .execute();

  return result.map((row) => ({
    status: row.status,
    count: row.count,
  }));
};

export const getAllWithFormation = async (query: any = {}, onlyDiscrepancies: boolean, page = 1, pageSize = 100) => {
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
      "verbatims.scores",
      sql`json_build_object(
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

  const paginatedQuery = await executeWithOffsetPagination(baseQuery, {
    page: Number(page),
    perPage: Number(pageSize),
  });

  return paginatedQuery;
};

export const getAllWithFormationAndCampagne = async (temoignagesIds: string[], status: string[]) => {
  return getKbdClient()
    .selectFrom("verbatims")
    .leftJoin("temoignages", "verbatims.temoignage_id", "temoignages.id")
    .leftJoin("temoignages_campagnes", "temoignages.id", "temoignages_campagnes.temoignage_id")
    .leftJoin("campagnes", "temoignages_campagnes.campagne_id", "campagnes.id")
    .leftJoin("formations_campagnes", "temoignages_campagnes.campagne_id", "formations_campagnes.campagne_id")
    .leftJoin("formations", "formations_campagnes.formation_id", "formations.id")
    .select([
      "verbatims.id",
      "verbatims.question_key",
      sql`COALESCE(verbatims.content_corrected_anonymized, verbatims.content_corrected, verbatims.content)`.as(
        "content"
      ),
      "verbatims.status",
      "campagnes.nom_campagne",
      "campagnes.questionnaire_id",
      sql`json_build_object(
        'intitule_long', formations.intitule_long,
        'etablissement_formateur_enseigne', formations.etablissement_formateur_enseigne,
        'etablissement_formateur_entreprise_raison_sociale', formations.etablissement_formateur_entreprise_raison_sociale,
        'etablissement_formateur_siret', formations.etablissement_formateur_siret
      )`.as("formation"),
    ])
    .where("verbatims.temoignage_id", "in", temoignagesIds)
    .where("verbatims.status", "in", status)
    .where("verbatims.deleted_at", "is", null)
    .where("formations.deleted_at", "is", null)
    .where("temoignages.deleted_at", "is", null)
    .execute();
};

export const updateOne = async (id: string, update: Partial<Verbatim>): Promise<{ id: string } | undefined> => {
  return getKbdClient().updateTable("verbatims").set(update).where("id", "=", id).returning("id").executeTakeFirst();
};

export const updateMany = async (verbatims: Partial<Verbatim>[]): Promise<boolean[]> => {
  const promises = verbatims.map(async ({ id, ...update }) => {
    const result = await getKbdClient()
      .updateTable("verbatims")
      .set(update)
      .where("id", "=", id as string)
      .executeTakeFirst();

    return result.numUpdatedRows === BigInt(1);
  });

  return Promise.all(promises);
};

export const create = async (verbatim: Verbatim): Promise<{ id: string } | undefined> => {
  return getKbdClient().insertInto("verbatims").values(verbatim).returning("id").executeTakeFirst();
};

export const getOneByTemoignageIdAndQuestionKey = async (query: {
  temoignageId: string;
  questionKey: string;
}): Promise<Verbatim | undefined> => {
  return getKbdClient()
    .selectFrom("verbatims")
    .selectAll()
    .where("temoignage_id", "=", query.temoignageId)
    .where("question_key", "=", query.questionKey)
    .executeTakeFirst();
};

export const getOneById = async (id: string): Promise<Verbatim | undefined> => {
  return getKbdClient().selectFrom("verbatims").selectAll().where("id", "=", id).executeTakeFirst();
};

export const deleteManyByCampagneIds = async (campagneIds: string[]): Promise<boolean> => {
  const temoignages = (await getKbdClient()
    .selectFrom("temoignages_campagnes")
    .select("temoignage_id")
    .where("campagne_id", "in", campagneIds)
    .execute()) as unknown as { temoignageId: string }[];

  const temoignagesIds = temoignages.map((t) => t.temoignageId as string);

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
