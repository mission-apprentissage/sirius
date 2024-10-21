import { sql } from "kysely";
import { executeWithOffsetPagination } from "kysely-paginate";

import { getKbdClient } from "../db/db";
import type { Temoignage } from "../types";
import type { GetAllWithFormationAndQuestionnaire } from "./types/temoignages";

export const create = async (
  temoignage: Partial<Temoignage> & { campagneId: string }
): Promise<{ id: string } | undefined> => {
  const { campagneId, ...rest } = temoignage;

  const transaction = await getKbdClient()
    .transaction()
    .execute(async (trx) => {
      const insertedTemoignage = await trx.insertInto("temoignages").values(rest).returning("id").executeTakeFirst();

      if (insertedTemoignage?.id) {
        await trx
          .insertInto("temoignages_campagnes")
          .values({
            temoignage_id: insertedTemoignage.id,
            campagne_id: campagneId,
          })
          .execute();
      }

      return insertedTemoignage?.id;
    });

  return transaction ? { id: transaction } : undefined;
};

export const findAll = async (query: { campagneIds: string[] }): Promise<Temoignage[] | undefined> => {
  let queryBuilder = getKbdClient()
    .selectFrom("temoignages")
    .select([
      "temoignages.id",
      "temoignages.reponses",
      "temoignages.is_bot",
      "temoignages.last_question_at",
      "temoignages.deleted_at",
      "temoignages.created_at",
      "temoignages.updated_at",
    ])
    .leftJoin("temoignages_campagnes", "temoignages.id", "temoignages_campagnes.temoignage_id")
    .where("temoignages.deleted_at", "is", null);

  if ("campagneIds" in query && query.campagneIds) {
    queryBuilder = queryBuilder.where("temoignages_campagnes.campagne_id", "in", query.campagneIds);
  }

  const results = await queryBuilder.execute();
  return results;
};

export const findAllWithVerbatims = async (query: { campagneIds: string[] }) => {
  let queryBuilder = getKbdClient()
    .selectFrom("temoignages")
    .select([
      "temoignages.id",
      "temoignages.reponses",
      "temoignages.is_bot",
      "temoignages.last_question_at",
      "temoignages.deleted_at",
      "temoignages.created_at",
      "temoignages.updated_at",
      sql`COALESCE(json_agg(json_build_object(
        'id', verbatims.id,
        'temoignage_id', verbatims.temoignage_id,
        'question_key', verbatims.question_key,
        'content', verbatims.content,
        'status', verbatims.status,
        'scores', verbatims.scores,
        'themes', verbatims.themes,
        'deleted_at', verbatims.deleted_at
    )))`.as("verbatims"),
      sql`temoignages_campagnes.campagne_id`.as("campagne_id"),
    ])
    .leftJoin("temoignages_campagnes", "temoignages.id", "temoignages_campagnes.temoignage_id")
    .leftJoin("verbatims", "temoignages.id", "verbatims.temoignage_id")
    .where("temoignages.deleted_at", "is", null)
    .where("verbatims.deleted_at", "is", null)
    .groupBy(["temoignages.id", "temoignages_campagnes.campagne_id"]);

  if ("campagneIds" in query && query.campagneIds) {
    queryBuilder = queryBuilder.where("temoignages_campagnes.campagne_id", "in", query.campagneIds);
  }

  const results = await queryBuilder.execute();
  return results;
};

export const deleteOne = async (id: string): Promise<boolean> => {
  const result = await getKbdClient()
    .updateTable("temoignages")
    .set({ deleted_at: new Date() })
    .where("id", "=", id)
    .executeTakeFirst();

  return result.numUpdatedRows === BigInt(1);
};

export const deleteManyByCampagneId = async (campagneIds: string[]): Promise<boolean> => {
  const idsToUpdate = await getKbdClient()
    .selectFrom("temoignages")
    .select("temoignages.id")
    .innerJoin("temoignages_campagnes", "temoignages.id", "temoignages_campagnes.temoignage_id")
    .where("temoignages_campagnes.campagne_id", "in", campagneIds)
    .execute();

  const ids = idsToUpdate.map((row) => row.id);

  if (ids.length > 0) {
    const result = await getKbdClient()
      .updateTable("temoignages")
      .set({ deleted_at: new Date() })
      .where("id", "in", ids)
      .execute();

    return result[0].numUpdatedRows === BigInt(ids.length);
  }

  return true;
};

export const update = async (id: string, updatedTemoignage: Partial<Temoignage>): Promise<boolean> => {
  const result = await getKbdClient()
    .updateTable("temoignages")
    .set(updatedTemoignage)
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst();

  return result.numUpdatedRows === BigInt(1);
};

export const countByCampagne = async (id: string): Promise<number> => {
  const result = await getKbdClient()
    .selectFrom("temoignages")
    .select(sql`count(*)`.as("count"))
    .leftJoin("temoignages_campagnes", "temoignages.id", "temoignages_campagnes.temoignage_id")
    .where("campagne_id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst();

  return result ? Number(result.count) : 0;
};

export const findOne = async (id: string): Promise<Temoignage | undefined> => {
  return getKbdClient()
    .selectFrom("temoignages")
    .selectAll()
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst();
};

export const count = async (): Promise<number> => {
  const result = await getKbdClient()
    .selectFrom("temoignages")
    .select(sql`COUNT(*)`.as("count"))
    .where("deleted_at", "is", null)
    .executeTakeFirstOrThrow();

  return result.count as number;
};

export const uncompliantsCount = async (query: {
  isBot: boolean;
  incompleteNumber: number;
  timeToRespondLimit: number;
  includeUnavailableDuration: boolean;
}): Promise<{ botCount: number; incompleteCount: number; quickCount: number }> => {
  const result = await getKbdClient()
    .selectFrom("temoignages")
    .select([
      sql<number>`COUNT(DISTINCT id) FILTER (WHERE is_bot IS TRUE)`.as("botCount"),
      sql<number>`COUNT(DISTINCT id) FILTER (WHERE (SELECT COUNT(*) FROM jsonb_object_keys(reponses)) < ${query.incompleteNumber})`.as(
        "incompleteCount"
      ),
      sql<number>`COUNT(DISTINCT id) FILTER (
        WHERE ${query.includeUnavailableDuration ? sql`1=1` : sql`last_question_at IS NOT NULL`}
        AND EXTRACT(EPOCH FROM last_question_at - created_at) * 1000 < ${query.timeToRespondLimit}
      )`.as("quickCount"),
    ])
    .where("deleted_at", "is", null)
    .executeTakeFirstOrThrow();

  return result;
};

export const getAllTemoignagesWithFormation = async (query: Partial<Temoignage>, page: number, pageSize: number) => {
  let baseQuery = getKbdClient()
    .selectFrom("temoignages")
    .leftJoin("temoignages_campagnes", "temoignages.id", "temoignages_campagnes.temoignage_id")
    .leftJoin("formations", "temoignages_campagnes.campagne_id", "formations.campagne_id")
    .select([
      "temoignages.id",
      "temoignages.reponses",
      "temoignages.created_at",
      "temoignages.updated_at",
      "temoignages.last_question_at",
      "temoignages.is_bot",
      "temoignages.deleted_at",
      sql`json_build_object(
      'id', formations.catalogue_id,
      'intitule_long', formations.intitule_long,
      'diplome', formations.diplome,
      'localite', formations.localite,
      'tags', formations.tags,
      'lieu_formation_adresse_computed', formations.lieu_formation_adresse_computed,
      'duree', formations.duree,
      'etablissement_formateur_enseigne', formations.etablissement_formateur_enseigne,
      'etablissement_formateur_entreprise_raison_sociale', formations.etablissement_formateur_entreprise_raison_sociale,
      'etablissement_gestionnaire_enseigne', formations.etablissement_gestionnaire_enseigne,
      'etablissement_gestionnaire_siret', formations.etablissement_gestionnaire_siret
    )`.as("formation"),
    ])
    .where("temoignages.deleted_at", "is", null);

  baseQuery = baseQuery.where((eb) => {
    const ors = [];

    if ("isBot" in query && query.isBot) {
      ors.push(eb("temoignages.is_bot", "=", true));
    }

    if ("incompleteNumber" in query && query.incompleteNumber) {
      ors.push(eb(sql`(SELECT COUNT(*) FROM jsonb_object_keys(temoignages.reponses))`, "<", query.incompleteNumber));
    }

    if ("timeToRespondLimit" in query && query.timeToRespondLimit) {
      ors.push(
        eb(
          sql`EXTRACT(EPOCH FROM temoignages.last_question_at - temoignages.created_at) * 1000`,
          "<",
          query.timeToRespondLimit
        )
      );
    }

    if ("includeUnavailableDuration" in query && query.includeUnavailableDuration) {
      ors.push(eb("temoignages.last_question_at", "is not", null));
    }

    return eb.or(ors);
  });

  const result = await executeWithOffsetPagination(baseQuery, { page: Number(page), perPage: Number(pageSize) });

  return result;
};

export const getAllWithFormationAndQuestionnaire = async (
  campagneIds: string[]
): Promise<GetAllWithFormationAndQuestionnaire[]> => {
  const result = await getKbdClient()
    .selectFrom("temoignages")
    .leftJoin("temoignages_campagnes", "temoignages.id", "temoignages_campagnes.temoignage_id")
    .leftJoin("campagnes", "temoignages_campagnes.campagne_id", "campagnes.id")
    .leftJoin("formations", "temoignages_campagnes.campagne_id", "formations.campagne_id")
    .select([
      "temoignages.id",
      "temoignages.reponses",
      "campagnes.nom_campagne",
      "campagnes.questionnaire_id",
      sql`json_build_object(
      'intitule_long', formations.intitule_long,
      'localite', formations.localite,
      'etablissement_formateur_enseigne', formations.etablissement_formateur_enseigne,
      'etablissement_formateur_entreprise_raison_sociale', formations.etablissement_formateur_entreprise_raison_sociale,
      'etablissement_formateur_siret', formations.etablissement_formateur_siret
    )`.as("formation"),
    ])
    .where("temoignages.deleted_at", "is", null)
    .where("campagnes.deleted_at", "is", null)
    .where("formations.deleted_at", "is", null)
    .where("temoignages_campagnes.campagne_id", "in", campagneIds)
    .execute();

  return result as GetAllWithFormationAndQuestionnaire[];
};

export const deleteMultiple = async (ids: string[]): Promise<boolean> => {
  const result = await getKbdClient()
    .updateTable("temoignages")
    .set({
      deleted_at: new Date(),
    })
    .where("id", "in", ids)
    .execute();

  return result[0].numUpdatedRows === BigInt(ids.length);
};
