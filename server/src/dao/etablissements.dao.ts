import camelcaseKeys from "camelcase-keys";
import decamelizeKeys from "decamelize-keys";
import { sql } from "kysely";

import { getKbdClient } from "../db/db";
import type { Etablissement, EtablissementCreation } from "../types";
import type {
  FindAllEtablissementWithCountsResults,
  FindAllWithTemoignageCountResults,
} from "./types/etablissements.types";

export const create = async (
  etablissement: EtablissementCreation,
  relatedUserId: string
): Promise<string | undefined> => {
  const transaction = await getKbdClient()
    .transaction()
    .execute(async (trx) => {
      const insertedEtablissement = await trx
        .insertInto("etablissements")
        .values(decamelizeKeys(etablissement))
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

export const createUserRelation = async (
  etablissementId: string,
  relatedUserId: string
): Promise<{ id: string } | undefined> => {
  return getKbdClient()
    .insertInto("users_etablissements")
    .values({
      user_id: relatedUserId,
      etablissement_id: etablissementId,
    })
    .returning("id")
    .executeTakeFirst();
};

export const findAll = async (query: {
  searchText?: string;
  siret?: string;
  catalogue_id?: string;
}): Promise<Omit<Etablissement, "catalogueData">[]> => {
  let baseQuery = getKbdClient()
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

  const result = await baseQuery.execute();

  return camelcaseKeys(result);
};

export const findAllEtablissementWithCounts = async (): FindAllEtablissementWithCountsResults => {
  const baseQuery = getKbdClient()
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
    .orderBy("campagnesCount", "desc");

  const result = await baseQuery.execute();
  return camelcaseKeys(result);
};

export const count = async (): Promise<number> => {
  const result = await getKbdClient()
    .selectFrom("etablissements")
    .select(sql`COUNT(*)`.as("count"))
    .where("deleted_at", "is", null)
    .executeTakeFirstOrThrow();

  return result.count as number;
};

export const findAllWithTemoignageCount = async (): FindAllWithTemoignageCountResults => {
  const result = await getKbdClient()
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

  return camelcaseKeys(result);
};
