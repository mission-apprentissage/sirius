import { DeleteResult, InsertResult, sql } from "kysely";
import { kdb } from "../db/db";
import { Formation } from "../types";

export const create = async (formation: Formation): Promise<InsertResult> => {
  return kdb.insertInto("formations").values(formation).executeTakeFirst();
};

export const findAll = async (query: {
  formationIds?: string[];
  campagne_id?: string;
  searchText?: string;
}): Promise<Partial<Formation>[] | undefined> => {
  let baseQuery = kdb
    .selectFrom("formations")
    .select([
      "id",
      "campagne_id",
      "catalogue_id",
      "region",
      "num_departement",
      "intitule_long",
      "intitule_court",
      "diplome",
      "localite",
      "tags",
      "lieu_formation_adresse",
      "lieu_formation_adresse_computed",
      "code_postal",
      "duree",
      "etablissement_formateur_adresse",
      "etablissement_formateur_enseigne",
      "etablissement_formateur_entreprise_raison_sociale",
      "etablissement_formateur_localite",
      "etablissement_formateur_siret",
      "etablissement_gestionnaire_enseigne",
      "etablissement_gestionnaire_siret",
      "etablissement_id",
    ])
    .where("deleted_at", "is", null);

  if ("formationIds" in query && query.formationIds && query.formationIds.length > 0) {
    baseQuery = baseQuery.where("id", "in", query.formationIds);
  }

  if ("campagne_id" in query && query.campagne_id) {
    baseQuery = baseQuery.where("campagne_id", "=", query.campagne_id);
  }

  if ("searchText" in query && query.searchText) {
    baseQuery = baseQuery.where((qb) =>
      qb.or([
        qb("region", "ilike", `%${query.searchText}%`),
        qb("num_departement", "ilike", `%${query.searchText}%`),
        qb("intitule_long", "ilike", `%${query.searchText}%`),
        qb("intitule_court", "ilike", `%${query.searchText}%`),
        qb("diplome", "ilike", `%${query.searchText}%`),
        qb("localite", "ilike", `%${query.searchText}%`),
        qb("tags", "ilike", `%${query.searchText}%`),
        qb("lieu_formation_adresse", "ilike", `%${query.searchText}%`),
        qb("lieu_formation_adresse_computed", "ilike", `%${query.searchText}%`),
        qb("code_postal", "ilike", `%${query.searchText}%`),
        qb("etablissement_formateur_adresse", "ilike", `%${query.searchText}%`),
        qb("etablissement_formateur_enseigne", "ilike", `%${query.searchText}%`),
        qb("etablissement_formateur_entreprise_raison_sociale", "ilike", `%${query.searchText}%`),
        qb("etablissement_formateur_localite", "ilike", `%${query.searchText}%`),
        qb("etablissement_formateur_siret", "ilike", `%${query.searchText}%`),
        qb("etablissement_gestionnaire_enseigne", "ilike", `%${query.searchText}%`),
        qb("etablissement_gestionnaire_siret", "ilike", `%${query.searchText}%`),
      ])
    );
  }

  return baseQuery.execute();
};

export const findOne = async (id: string): Promise<Partial<Formation> | undefined> => {
  return kdb
    .selectFrom("formations")
    .select([
      "id",
      "campagne_id",
      "catalogue_id",
      "region",
      "num_departement",
      "intitule_long",
      "intitule_court",
      "diplome",
      "localite",
      "tags",
      "lieu_formation_adresse",
      "lieu_formation_adresse_computed",
      "code_postal",
      "duree",
      "etablissement_formateur_adresse",
      "etablissement_formateur_enseigne",
      "etablissement_formateur_entreprise_raison_sociale",
      "etablissement_formateur_localite",
      "etablissement_formateur_siret",
      "etablissement_gestionnaire_enseigne",
      "etablissement_gestionnaire_siret",
      "etablissement_id",
    ])
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst();
};

export const findOneByCatalogueId = async (catalogueId: string): Promise<Partial<Formation> | undefined> => {
  return kdb
    .selectFrom("formations")
    .select([
      "id",
      "campagne_id",
      "catalogue_id",
      "region",
      "num_departement",
      "intitule_long",
      "intitule_court",
      "diplome",
      "localite",
      "tags",
      "lieu_formation_adresse",
      "lieu_formation_adresse_computed",
      "code_postal",
      "duree",
      "etablissement_formateur_adresse",
      "etablissement_formateur_enseigne",
      "etablissement_formateur_entreprise_raison_sociale",
      "etablissement_formateur_localite",
      "etablissement_formateur_siret",
      "etablissement_gestionnaire_enseigne",
      "etablissement_gestionnaire_siret",
      "etablissement_id",
    ])
    .where("catalogue_id", "=", catalogueId)
    .where("deleted_at", "is", null)
    .executeTakeFirst();
};

export const deleteOne = async (id: string): Promise<DeleteResult> => {
  return kdb.deleteFrom("formations").where("id", "=", id).executeTakeFirst();
};

export const deleteManyByCampagneIdAndReturnsTheDeletedFormationId = async (
  campagneIds: string[]
): Promise<{ id: string }[]> => {
  return kdb
    .updateTable("formations")
    .set({
      deleted_at: new Date(),
    })
    .where("campagne_id", "in", campagneIds)
    .returning("id")
    .execute();
};

export const update = async (id: string, updatedFormation: Partial<Formation>): Promise<boolean> => {
  const result = await kdb
    .updateTable("formations")
    .set(updatedFormation)
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst();

  return result.numUpdatedRows > 0;
};

export const findDataIdFormationByIds = async (catalogue_ids: string[]): Promise<Partial<Formation>[]> => {
  return kdb
    .selectFrom("formations")
    .select([
      "id",
      "campagne_id",
      "catalogue_id",
      "region",
      "num_departement",
      "intitule_long",
      "intitule_court",
      "diplome",
      "localite",
      "tags",
      "lieu_formation_adresse",
      "lieu_formation_adresse_computed",
      "code_postal",
      "duree",
      "etablissement_formateur_adresse",
      "etablissement_formateur_enseigne",
      "etablissement_formateur_entreprise_raison_sociale",
      "etablissement_formateur_localite",
      "etablissement_formateur_siret",
      "etablissement_gestionnaire_enseigne",
      "etablissement_gestionnaire_siret",
      "etablissement_id",
    ])
    .where("catalogue_id", "in", catalogue_ids)
    .where("deleted_at", "is", null)
    .execute();
};

export const findFormationByIntitule = async (intitule: string): Promise<Partial<Formation>[] | undefined> => {
  return kdb
    .selectFrom("formations")
    .select([
      "id",
      "campagne_id",
      "catalogue_id",
      "region",
      "num_departement",
      "intitule_long",
      "intitule_court",
      "diplome",
      "localite",
      "tags",
      "lieu_formation_adresse",
      "lieu_formation_adresse_computed",
      "code_postal",
      "duree",
      "etablissement_formateur_adresse",
      "etablissement_formateur_enseigne",
      "etablissement_formateur_entreprise_raison_sociale",
      "etablissement_formateur_localite",
      "etablissement_formateur_siret",
      "etablissement_gestionnaire_enseigne",
      "etablissement_gestionnaire_siret",
      "etablissement_id",
    ])
    .where(sql<string>`catalogue_data->>'onisep_intitule'`, "ilike", `%${intitule}%`)
    .where("deleted_at", "is", null)
    .execute();
};

export const findFormationByUai = async (uai: string): Promise<Partial<Formation>[] | undefined> => {
  return kdb
    .selectFrom("formations")
    .select([
      "id",
      "campagne_id",
      "catalogue_id",
      "region",
      "num_departement",
      "intitule_long",
      "intitule_court",
      "diplome",
      "localite",
      "tags",
      "lieu_formation_adresse",
      "lieu_formation_adresse_computed",
      "code_postal",
      "duree",
      "etablissement_formateur_adresse",
      "etablissement_formateur_enseigne",
      "etablissement_formateur_entreprise_raison_sociale",
      "etablissement_formateur_localite",
      "etablissement_formateur_siret",
      "etablissement_gestionnaire_enseigne",
      "etablissement_gestionnaire_siret",
      "etablissement_id",
    ])
    .where(sql<string>`catalogue_data->>'etablissement_formateur_uai'`, "ilike", `%${uai}%`)
    .where("deleted_at", "is", null)
    .execute();
};

export const findAllWithTemoignageCount = async (): Promise<Partial<Formation>[] | undefined> => {
  return kdb
    .selectFrom("formations")
    .select([
      "formations.id",
      "formations.campagne_id",
      "formations.catalogue_id",
      "formations.region",
      "formations.num_departement",
      "formations.intitule_long",
      "formations.intitule_court",
      "formations.diplome",
      "formations.localite",
      "formations.tags",
      "formations.lieu_formation_adresse",
      "formations.lieu_formation_adresse_computed",
      "formations.code_postal",
      "formations.duree",
      "formations.etablissement_formateur_adresse",
      "formations.etablissement_formateur_enseigne",
      "formations.etablissement_formateur_entreprise_raison_sociale",
      "formations.etablissement_formateur_localite",
      "formations.etablissement_formateur_siret",
      "formations.etablissement_gestionnaire_enseigne",
      "formations.etablissement_gestionnaire_siret",
      "formations.etablissement_id",
      sql<number>`COUNT(DISTINCT temoignages_campagnes.temoignage_id) FILTER (WHERE temoignages_campagnes.temoignage_id IS NOT NULL)`.as(
        "temoignagesCount"
      ),
    ])
    .leftJoin("campagnes", "campagnes.id", "formations.campagne_id")
    .leftJoin("temoignages_campagnes", "temoignages_campagnes.campagne_id", "formations.campagne_id")
    .groupBy("formations.id")
    .orderBy("temoignagesCount", "desc")
    .execute();
};
