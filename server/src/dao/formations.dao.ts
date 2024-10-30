import type { DeleteResult } from "kysely";
import { sql } from "kysely";

import { OBSERVER_SCOPES } from "../constants";
import { getKbdClient } from "../db/db";
import type { Formation, ObserverScope } from "../types";

export const create = async (formation: Formation): Promise<{ id: string } | undefined> => {
  return getKbdClient().insertInto("formations").values(formation).returning("id").executeTakeFirst();
};

export const findAll = async (query: {
  formationIds?: string[];
  campagne_id?: string;
  searchText?: string;
  etablissementSiret?: string;
  catalogueId?: string;
}): Promise<Partial<Formation>[] | undefined> => {
  let baseQuery = getKbdClient()
    .selectFrom("formations")
    .select([
      "formations.id",
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
    ])
    .where("formations.deleted_at", "is", null);

  if ("formationIds" in query && query.formationIds && query.formationIds.length > 0) {
    baseQuery = baseQuery.where("formations.id", "in", query.formationIds);
  }

  if ("campagne_id" in query && query.campagne_id) {
    baseQuery = baseQuery
      .innerJoin("formations_campagnes", "formations.id", "formations_campagnes.formation_id")
      .where("formations_campagnes.campagne_id", "=", query.campagne_id);
  }

  if ("searchText" in query && query.searchText) {
    baseQuery = baseQuery.where((qb) =>
      qb.or([
        qb("formations.region", "ilike", `%${query.searchText}%`),
        qb("formations.num_departement", "ilike", `%${query.searchText}%`),
        qb("formations.intitule_long", "ilike", `%${query.searchText}%`),
        qb("formations.intitule_court", "ilike", `%${query.searchText}%`),
        qb("formations.diplome", "ilike", `%${query.searchText}%`),
        qb("formations.localite", "ilike", `%${query.searchText}%`),
        qb("formations.tags", "ilike", `%${query.searchText}%`),
        qb("formations.lieu_formation_adresse", "ilike", `%${query.searchText}%`),
        qb("formations.lieu_formation_adresse_computed", "ilike", `%${query.searchText}%`),
        qb("formations.code_postal", "ilike", `%${query.searchText}%`),
        qb("formations.etablissement_formateur_adresse", "ilike", `%${query.searchText}%`),
        qb("formations.etablissement_formateur_enseigne", "ilike", `%${query.searchText}%`),
        qb("formations.etablissement_formateur_entreprise_raison_sociale", "ilike", `%${query.searchText}%`),
        qb("formations.etablissement_formateur_localite", "ilike", `%${query.searchText}%`),
        qb("formations.etablissement_formateur_siret", "ilike", `%${query.searchText}%`),
        qb("formations.etablissement_gestionnaire_enseigne", "ilike", `%${query.searchText}%`),
        qb("formations.etablissement_gestionnaire_siret", "ilike", `%${query.searchText}%`),
      ])
    );
  }

  if ("etablissementSiret" in query && query.etablissementSiret) {
    baseQuery = baseQuery.where("formations.etablissement_formateur_siret", "=", query.etablissementSiret);
  }

  if ("catalogueId" in query && query.catalogueId) {
    baseQuery = baseQuery.where("formations.catalogue_id", "=", query.catalogueId);
  }

  return baseQuery.execute();
};

export const findOne = async (id: string): Promise<Partial<Formation> | undefined> => {
  return getKbdClient()
    .selectFrom("formations")
    .leftJoin("formations_campagnes", "formations.id", "formations_campagnes.formation_id") // Join with formations_campagnes table
    .select([
      "formations.id",
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
      "formations_campagnes.campagne_id",
    ])
    .where("formations.id", "=", id)
    .where("formations.deleted_at", "is", null)
    .executeTakeFirst();
};

export const findOneByCatalogueId = async (catalogueId: string): Promise<Partial<Formation> | undefined> => {
  return getKbdClient()
    .selectFrom("formations")
    .leftJoin("formations_campagnes", "formations.id", "formations_campagnes.formation_id")
    .select([
      "formations.id",
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
      "formations_campagnes.campagne_id",
    ])
    .where("formations.catalogue_id", "=", catalogueId)
    .where("formations.deleted_at", "is", null)
    .executeTakeFirst();
};

export const deleteOne = async (id: string): Promise<DeleteResult> => {
  return getKbdClient().deleteFrom("formations").where("id", "=", id).executeTakeFirst();
};

export const deleteManyByCampagneIdAndReturnsTheDeletedFormationId = async (
  campagneIds: string[]
): Promise<string[]> => {
  const formationIds = await getKbdClient()
    .selectFrom("formations")
    .innerJoin("formations_campagnes", "formations.id", "formations_campagnes.formation_id")
    .select("formations.id")
    .where("formations_campagnes.campagne_id", "in", campagneIds)
    .execute();

  const idsToDelete = formationIds.map((result) => result.id);

  await getKbdClient()
    .updateTable("formations")
    .set({
      deleted_at: new Date(),
    })
    .where("formations.id", "in", idsToDelete)
    .returning("id")
    .execute();

  return idsToDelete;
};

export const update = async (id: string, updatedFormation: Partial<Formation>): Promise<boolean> => {
  const result = await getKbdClient()
    .updateTable("formations")
    .set(updatedFormation)
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst();

  return result.numUpdatedRows === BigInt(1);
};

export const findFormationByIntitule = async (intitule: string): Promise<Partial<Formation>[] | undefined> => {
  return getKbdClient()
    .selectFrom("formations")
    .leftJoin("formations_campagnes", "formations.id", "formations_campagnes.formation_id")
    .select([
      "formations.id",
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
      "formations_campagnes.campagne_id",
    ])
    .where(sql<string>`catalogue_data->>'onisep_intitule'`, "ilike", `%${intitule}%`)
    .where("formations.deleted_at", "is", null)
    .execute();
};

export const findFormationByUai = async (uai: string): Promise<Partial<Formation>[] | undefined> => {
  return getKbdClient()
    .selectFrom("formations")
    .leftJoin("formations_campagnes", "formations.id", "formations_campagnes.formation_id")
    .select([
      "formations.id",
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
      "formations_campagnes.campagne_id",
    ])
    .where(sql<string>`catalogue_data->>'etablissement_formateur_uai'`, "ilike", `%${uai}%`)
    .where("formations.deleted_at", "is", null)
    .execute();
};

export const findAllWithTemoignageCount = async (): Promise<Partial<Formation>[] | undefined> => {
  return getKbdClient()
    .selectFrom("formations")
    .leftJoin("formations_campagnes", "formations.id", "formations_campagnes.formation_id")
    .leftJoin("temoignages_campagnes", "temoignages_campagnes.campagne_id", "formations_campagnes.campagne_id")
    .select([
      "formations.id",
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
      sql<string>`catalogue_data->>'onisep_intitule'`.as("onisep_intitule"),
    ])
    .groupBy("formations.id")
    .orderBy("temoignagesCount", "desc")
    .execute();
};

export const findAllWithCampagnesCount = async (
  siret: string[],
  scope?: ObserverScope
): Promise<Partial<Formation>[] | undefined> => {
  let baseQuery = getKbdClient()
    .selectFrom("formations")
    .leftJoin("formations_campagnes", "formations.id", "formations_campagnes.formation_id")
    .select([
      "formations.id",
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
      sql<number>`COUNT(DISTINCT formations_campagnes.campagne_id)`.as("campagnesCount"),
    ])
    .groupBy("formations.id")
    .orderBy("campagnesCount", "desc")
    .where("formations.deleted_at", "is", null);

  if (siret?.length > 0) {
    baseQuery = baseQuery.where((qb) =>
      qb.or([
        qb("formations.etablissement_gestionnaire_siret", "in", siret),
        qb("formations.etablissement_formateur_siret", "in", siret),
      ])
    );
  }

  if (scope && scope.field && scope.field !== "sirets" && scope.field !== OBSERVER_SCOPES.OPCO && scope.value) {
    baseQuery = baseQuery.where(`formations.${scope.field}`, "=", scope.value);
  }

  if (scope && scope.field && scope.field === OBSERVER_SCOPES.SIRETS && scope.value.length) {
    baseQuery = baseQuery.where(`formations.etablissement_gestionnaire_siret`, "in", scope.value);
  }

  if (scope && scope.field && scope.field === OBSERVER_SCOPES.OPCO && scope.value.length) {
    baseQuery = baseQuery.where(sql`formations.catalogue_data ->> 'rncp_code'`, "in", scope.value);
  }

  return baseQuery.execute();
};
