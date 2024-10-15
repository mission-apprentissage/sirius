import { sql } from "kysely";
import { kdb } from "../db/db";
import { Etablissement } from "../types";

export const create = async (etablissement: Etablissement, relatedUserId: string): Promise<string | undefined> => {
  const transaction = await kdb.transaction().execute(async (trx) => {
    const insertedEtablissement = await trx
      .insertInto("etablissements")
      .values(etablissement)
      .returning("id")
      .executeTakeFirst();

    if (insertedEtablissement?.id) {
      await trx
        .insertInto("users_etablissements")
        .values({
          user_id: relatedUserId,
          etablissement_id: insertedEtablissement.id,
        })
        .execute();
    }

    return insertedEtablissement?.id;
  });
  return transaction;
};

export const createUserRelation = async (etablissementId: string, relatedUserId: string): Promise<any> => {
  await kdb
    .insertInto("users_etablissements")
    .values({
      user_id: relatedUserId,
      etablissement_id: etablissementId,
    })
    .returning("id")
    .executeTakeFirst();
};

export const findAll = async (
  query: Partial<Etablissement> | { searchText: string }
): Promise<Partial<Etablissement>[]> => {
  let baseQuery = kdb
    .selectFrom("etablissements")
    .select([
      "id",
      "catalogue_id",
      "siret",
      "onisep_nom",
      "onisep_url",
      "enseigne",
      "entreprise_raison_sociale",
      "uai",
      "localite",
      "region_implantation_nom",
      "deleted_at",
      "created_at",
      "updated_at",
    ]);

  if ("siret" in query && query.siret) {
    baseQuery = baseQuery.where("siret", "=", query.siret);
  }
  if ("catalogue_id" in query && query.catalogue_id) {
    baseQuery = baseQuery.where("catalogue_id", "=", query.catalogue_id);
  }
  if ("searchText" in query && query.searchText) {
    baseQuery = baseQuery.where((qb) =>
      qb.or([
        qb("onisep_nom", "ilike", `%${query.searchText}%`),
        qb("enseigne", "ilike", `%${query.searchText}%`),
        qb("region_implantation_nom", "ilike", `%${query.searchText}%`),
        qb("entreprise_raison_sociale", "ilike", `%${query.searchText}%`),
        qb("localite", "ilike", `%${query.searchText}%`),
        qb("siret", "ilike", `%${query.searchText}%`),
        qb("uai", "ilike", `%${query.searchText}%`),
      ])
    );
  }

  return baseQuery.execute();
};

export const findOne = async (id: string): Promise<Etablissement | undefined> => {
  return kdb.selectFrom("etablissements").selectAll().where("id", "=", id).executeTakeFirst();
};

export const deleteOne = async (id: string): Promise<boolean> => {
  const result = await kdb
    .updateTable("etablissements")
    .set({
      deleted_at: new Date(),
    })
    .where("id", "=", id)
    .executeTakeFirst();

  return result.numUpdatedRows === BigInt(1);
};

export const update = async (id: string, updatedEtablissement: Partial<Etablissement>): Promise<boolean> => {
  const result = await kdb
    .updateTable("etablissements")
    .set(updatedEtablissement)
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst();

  return result.numUpdatedRows === BigInt(1);
};

export const findAllEtablissementWithCounts = async (): Promise<
  (Pick<
    Etablissement,
    "id" | "created_at" | "enseigne" | "entreprise_raison_sociale" | "onisep_nom" | "region_implantation_nom" | "siret"
  > & {
    campagnesCount: number;
    temoignagesCount: number;
    verbatimsCount: number;
  })[]
> => {
  return kdb
    .selectFrom("etablissements")
    .select([
      "etablissements.id",
      "etablissements.siret",
      "etablissements.onisep_nom",
      "etablissements.enseigne",
      "etablissements.entreprise_raison_sociale",
      "etablissements.region_implantation_nom",
      "etablissements.created_at",
      sql<number>`COUNT(DISTINCT formations_campagnes.campagne_id) FILTER (WHERE formations.id IS NOT NULL)`.as(
        "campagnesCount"
      ),
      sql<number>`COUNT(DISTINCT temoignages_campagnes.temoignage_id) FILTER (WHERE temoignages_campagnes.temoignage_id IS NOT NULL)`.as(
        "temoignagesCount"
      ),
      sql<number>`COUNT(DISTINCT verbatims.id) FILTER (WHERE verbatims.id IS NOT NULL)`.as("verbatimsCount"),
    ])
    .leftJoin("formations", "formations.etablissement_id", "etablissements.id")
    .leftJoin("formations_campagnes", "formations.id", "formations_campagnes.formation_id")
    .leftJoin("temoignages_campagnes", "temoignages_campagnes.campagne_id", "formations_campagnes.campagne_id")
    .leftJoin("verbatims", "verbatims.temoignage_id", "temoignages_campagnes.temoignage_id")
    .where("etablissements.deleted_at", "is", null)
    .where("formations.deleted_at", "is", null)
    .where("verbatims.deleted_at", "is", null)
    .groupBy("etablissements.id")
    .orderBy("verbatimsCount", "desc")
    .execute();
};

export const count = async (): Promise<number> => {
  const result = await kdb
    .selectFrom("etablissements")
    .select(sql`COUNT(*)`.as("count"))
    .where("deleted_at", "is", null)
    .executeTakeFirstOrThrow();

  return result.count as number;
};

export const findAllWithTemoignageCount = async (): Promise<
  (Pick<
    Etablissement,
    | "id"
    | "siret"
    | "onisep_nom"
    | "onisep_url"
    | "enseigne"
    | "entreprise_raison_sociale"
    | "uai"
    | "localite"
    | "created_at"
  > & {
    temoignagesCount: number;
  })[]
> => {
  return kdb
    .selectFrom("etablissements")
    .select([
      "etablissements.id",
      "etablissements.siret",
      "etablissements.onisep_nom",
      "etablissements.onisep_url",
      "etablissements.enseigne",
      "etablissements.entreprise_raison_sociale",
      "etablissements.uai",
      "etablissements.localite",
      "etablissements.created_at",
      sql<number>`COUNT(DISTINCT temoignages_campagnes.temoignage_id) FILTER (WHERE temoignages_campagnes.temoignage_id IS NOT NULL)`.as(
        "temoignagesCount"
      ),
    ])
    .leftJoin("formations", "formations.etablissement_id", "etablissements.id")
    .leftJoin("formations_campagnes", "formations.id", "formations_campagnes.formation_id")
    .leftJoin("temoignages_campagnes", "temoignages_campagnes.campagne_id", "formations_campagnes.campagne_id")
    .where("etablissements.deleted_at", "is", null)
    .where("formations.deleted_at", "is", null)
    .groupBy("etablissements.id")
    .orderBy("temoignagesCount", "desc")
    .execute();
};
