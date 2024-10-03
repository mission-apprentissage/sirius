import { sql } from "kysely";
import { kdb } from "../db/db";
import { Verbatim } from "../types";
import { executeWithOffsetPagination } from "kysely-paginate";

export const getAll = async (query: {
  temoignageIds: string[];
  status: string[];
  questionKey?: string;
}): Promise<Verbatim[]> => {
  let dbQuery = kdb
    .selectFrom("verbatims")
    .selectAll()
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
  let baseQuery = kdb
    .selectFrom("verbatims")
    .leftJoin("temoignages", "verbatims.temoignage_id", "temoignages.id")
    .leftJoin("temoignages_campagnes", "temoignages.id", "temoignages_campagnes.temoignage_id")
    .leftJoin("formations", "temoignages_campagnes.campagne_id", "formations.campagne_id")
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

export const getAllWithFormation = async (
  query: any = {},
  onlyDiscrepancies: boolean,
  page: number = 1,
  pageSize: number = 100
) => {
  let baseQuery = kdb
    .selectFrom("verbatims")
    .select([
      "verbatims.id",
      "verbatims.question_key",
      "verbatims.content",
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
    .leftJoin("formations", "temoignages_campagnes.campagne_id", "formations.campagne_id")
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
    baseQuery = baseQuery
      .select(
        sql`
        CASE
          WHEN verifications.scores->'GEM'->>'avis' = 'oui' THEN jsonb_build_object('k', 'GEM', 'v', verifications.scores->'GEM'->>'justification')
          ELSE (
            SELECT jsonb_build_object('k', item.key, 'v', item.value)
            FROM jsonb_each(verbatims.scores) as item
            WHERE item.value = (
              SELECT MAX(value)
              FROM jsonb_each(verbatims.scores) as max_item
            )
            LIMIT 1
          )
        END as maxScoreKey
      `.as("maxScoreKey") as unknown as any
      )
      .having(sql`maxScoreKey->>'k'`, "!=", sql`verbatims.status`);
  }

  const paginatedQuery = await executeWithOffsetPagination(baseQuery, {
    page: Number(page),
    perPage: Number(pageSize),
  });

  return paginatedQuery;
};

export const getAllWithFormationAndCampagne = async (temoignagesIds: string[], status: string[]) => {
  return kdb
    .selectFrom("verbatims")
    .leftJoin("temoignages", "verbatims.temoignage_id", "temoignages.id")
    .leftJoin("temoignages_campagnes", "temoignages.id", "temoignages_campagnes.temoignage_id")
    .leftJoin("campagnes", "temoignages_campagnes.campagne_id", "campagnes.id")
    .leftJoin("formations", "temoignages_campagnes.campagne_id", "formations.campagne_id")
    .select([
      "verbatims.id",
      "verbatims.question_key",
      "verbatims.content",
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
  return kdb.updateTable("verbatims").set(update).where("id", "=", id).returning("id").executeTakeFirst();
};

export const updateMany = async (verbatims: Partial<Verbatim>[]): Promise<boolean[]> => {
  const promises = verbatims.map(async ({ id, ...update }) => {
    const result = await kdb
      .updateTable("verbatims")
      .set(update)
      .where("id", "=", id as string)
      .executeTakeFirst();

    return result.numUpdatedRows === BigInt(1);
  });

  return Promise.all(promises);
};

export const create = async (verbatim: Verbatim): Promise<{ id: string } | undefined> => {
  return kdb.insertInto("verbatims").values(verbatim).returning("id").executeTakeFirst();
};

export const getOne = async (query: { temoignageId: string; questionKey: string }): Promise<Verbatim | undefined> => {
  return kdb
    .selectFrom("verbatims")
    .selectAll()
    .where("temoignage_id", "=", query.temoignageId)
    .where("question_key", "=", query.questionKey)
    .executeTakeFirst();
};
