import { sql } from "kysely";
import { kdb } from "../db/db";
import { ObserverScope } from "../types";

export const getAllWithTemoignageCountAndTemplateName = async ({
  siret,
  query,
  scope,
}: {
  siret?: string[];
  query?: { diplome?: string; etablissementFormateurSiret?: string; departement?: string; campagneIds?: string[] };
  scope?: ObserverScope;
}) => {
  let baseQuery = kdb
    .selectFrom("campagnes")
    .select([
      "campagnes.id",
      "campagnes.nom_campagne",
      "campagnes.start_date",
      "campagnes.end_date",
      "campagnes.seats",
      "campagnes.created_at",
      "campagnes.updated_at",
      sql`json_build_object(
        'questionnaireId' questionnaires.id,
        'questionnaireTemplateName' questionnaires.nom
      )`.as("questionnaire"),
      sql`json_build_object(
        'id', formation.id,
        'catalogue_id, formation.catalogue_id,
        'code_postal', formation.code_postal,
        'num_departement', formation.num_departement,
        'region', formation.region,
        'localite', formation.localite,
        'intitule_long', formation.intitule_long,
        'diplome', formation.diplome,
        'duree', formation.duree,
        'lieu_formation_adresse', formation.lieu_formation_adresse,
        'lieu_formation_adresse_computed', formation.lieu_formation_adresse_computed,
        'tags', formation.tags,
        'etablissement_gestionnaire_siret', formation.etablissement_gestionnaire_siret,
        'etablissement_gestionnaire_enseigne', formation.etablissement_gestionnaire_enseigne,
        'etablissement_formateur_siret', formation.etablissement_formateur_siret,
        'etablissement_formateur_enseigne', formation.etablissement_formateur_enseigne,
        'etablissment_formateur_adresse', formation.etablissement_formateur_adresse,
        'etablissement_formateur_localite', formation.etablissement_formateur_localite,
        'etablissement_formateur_entreprise_raison_sociale', formation.etablissement_formateur_entreprise_raison_sociale
      )`.as("formation"),
      sql`json_build_object(
        'id', etablissement.id,
        'catalogue_id', etablissement.catalogue_id,
        'siret', etablissement.siret,
        'onisep_nom', etablissement.onisep_nom,
        'enseigne', etablissement.enseigne,
        'entreprise_raison_sociale', etablissement.entreprise_raison_sociale,
        'uai', etablissement.uai,
        'localite', etablissement.localite,
        'region_implantation_nom', etablissement.region_implantation_nom,
        'numero_voie', etablissement.numero_voie,
        'type_voie', etablissement.type_voie,
        'nom_voie', etablissement.nom_voie,
        'code_postal', etablissement.code_postal,
      )`.as("etablissement"),
      sql`COUNT(temoignages.id)`.as("temoignagesCount"),
    ])
    .leftJoin("temoignages_campagnes", "temoignages_campagnes.campagne_id", "campagnes.id")
    .leftJoin("temoignages", "campagnes.id", "temoignages_campagnes.campagne_id")
    .leftJoin("questionnaires", "campagnes.questionnaire_id", "questionnaires.id")
    .leftJoin("formations", "campagnes.id", "formations.campagne_id")
    .leftJoin("etablissements", "formations.etablissement_id", "etablissements.id")
    .where("deleted_at", "=", null);

  if (scope && scope.field && scope.field !== "sirets" && scope.value) {
    baseQuery = baseQuery.where(`formations.${scope.field}`, "=", scope.value);
  }

  if (scope && scope.field && scope.field === "sirets" && scope.value.length) {
    baseQuery = baseQuery.where(`formations.etablissement_gestionnaire_siret`, "in", scope.value);
  }

  if (query && query.diplome) {
    baseQuery = baseQuery.where("formations.diplome", "=", query.diplome);
  }

  if (query && query.etablissementFormateurSiret) {
    baseQuery = baseQuery.where("formations.etablissement_formateur_siret", "=", query.etablissementFormateurSiret);
  }

  if (query && query.departement) {
    baseQuery = baseQuery.where("formations.num_departement", "=", query.departement);
  }

  if (query && query.campagneIds) {
    baseQuery = baseQuery.where("campagnes.id", "in", query.campagneIds);
  }

  if (siret) {
    baseQuery = baseQuery.where("etablissements.siret", "in", siret);
  }

  return baseQuery.execute();
};

export const getAllOnlyDiplomeTypeAndEtablissements = async (query?: { siret?: string[] }, scope?: ObserverScope) => {
  let baseQuery = kdb
    .selectFrom("campagnes")
    .leftJoin("formations", "campagnes.id", "formations.campagne_id")
    .leftJoin("etablissements", "formations.etablissement_gestionnaire_siret", "etablissements.siret")
    .select([
      "campagnes.id",
      "formations.id as formation.data._id",
      "formations.intitule_long as formation.data.intitule_long",
      "formations.tags as formation.data.tags",
      "formations.lieu_formation_adresse_computed as formation.data.lieu_formation_adresse_computed",
      "formations.lieu_formation_adresse as formation.data.lieu_formation_adresse",
      "formations.code_postal as formation.data.code_postal",
      "formations.diplome as formation.data.diplome",
      "formations.localite as formation.data.localite",
      "formations.duree as formation.data.duree",
      "formations.etablissement_formateur_siret as formation.data.etablissement_formateur_siret",
      "formations.etablissement_gestionnaire_siret as formation.data.etablissement_gestionnaire_siret",
      "formations.etablissement_gestionnaire_enseigne as formation.data.etablissement_gestionnaire_enseigne",
      "formations.etablissement_formateur_enseigne as formation.data.etablissement_formateur_enseigne",
      "formations.etablissement_formateur_entreprise_raison_sociale as formation.data.etablissement_formateur_entreprise_raison_sociale",
      "formations.etablissement_formateur_adresse as formation.data.etablissement_formateur_adresse",
      "formations.etablissement_formateur_localite as formation.data.etablissement_formateur_localite",
      "formations.num_departement as formation.data.num_departement",
      "formations.region as formation.data.region",
    ])
    .where("campagnes.deleted_at", "is", null);

  if (scope && (scope.field === "region" || scope.field === "num_departement")) {
    baseQuery = baseQuery.where(`formations.${scope.field}`, "=", scope.value);
  }

  if (scope && scope.field === "sirets" && scope.value) {
    baseQuery = baseQuery.where("formations.etablissement_gestionnaire_siret", "in", scope.value);
  }

  if (query?.siret) {
    baseQuery = baseQuery.where("etablissements.siret", "in", query.siret);
  }

  return baseQuery.execute();
};

export const getOne = async (id: string) => {
  return kdb.selectFrom("campagnes").selectAll().where("id", "=", id).executeTakeFirst();
};

export const create = async (campagne: any) => {
  return kdb.insertInto("campagnes").values(campagne).executeTakeFirst();
};

export const deleteMany = async (ids: string[]) => {
  return kdb.updateTable("campagnes").set({ deleted_at: new Date() }).where("id", "in", ids).execute();
};

export const update = async (id: string, updatedCampagne: any) => {
  return kdb
    .updateTable("campagnes")
    .set(updatedCampagne)
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .execute();
};

export const getAll = async (campagneIds: string[] = []) => {
  return kdb
    .selectFrom("campagnes")
    .selectAll()
    .where("deleted_at", "is", null)
    .where("id", "in", campagneIds)
    .execute();
};

export const count = async () => {
  const result = await kdb
    .selectFrom("campagnes")
    .select(sql<number>`count(*)`.as("count"))
    .where("deleted_at", "is", null)
    .executeTakeFirst();

  return result?.count || 0;
};

export const getOneWithTemoignagneCountAndTemplateName = async (id: string) => {
  const baseQuery = kdb
    .selectFrom("campagnes")
    .select([
      "campagnes.id",
      "campagnes.nom_campagne",
      "campagnes.start_date",
      "campagnes.end_date",
      "campagnes.seats",
      "campagnes.created_at",
      "campagnes.updated_at",
      sql`json_build_object(
      'questionnaireId' questionnaires.id,
      'questionnaireTemplateName' questionnaires.nom
    )`.as("questionnaire"),
      sql`json_build_object(
      'id', formation.id,
      'catalogue_id, formation.catalogue_id,
      'code_postal', formation.code_postal,
      'num_departement', formation.num_departement,
      'region', formation.region,
      'localite', formation.localite,
      'intitule_long', formation.intitule_long,
      'diplome', formation.diplome,
      'duree', formation.duree,
      'lieu_formation_adresse', formation.lieu_formation_adresse,
      'lieu_formation_adresse_computed', formation.lieu_formation_adresse_computed,
      'tags', formation.tags,
      'etablissement_gestionnaire_siret', formation.etablissement_gestionnaire_siret,
      'etablissement_gestionnaire_enseigne', formation.etablissement_gestionnaire_enseigne,
      'etablissement_formateur_siret', formation.etablissement_formateur_siret,
      'etablissement_formateur_enseigne', formation.etablissement_formateur_enseigne,
      'etablissment_formateur_adresse', formation.etablissement_formateur_adresse,
      'etablissement_formateur_localite', formation.etablissement_formateur_localite,
      'etablissement_formateur_entreprise_raison_sociale', formation.etablissement_formateur_entreprise_raison_sociale
    )`.as("formation"),
      sql`json_build_object(
      'id', etablissement.id,
      'catalogue_id', etablissement.catalogue_id,
      'siret', etablissement.siret,
      'onisep_nom', etablissement.onisep_nom,
      'enseigne', etablissement.enseigne,
      'entreprise_raison_sociale', etablissement.entreprise_raison_sociale,
      'uai', etablissement.uai,
      'localite', etablissement.localite,
      'region_implantation_nom', etablissement.region_implantation_nom,
      'numero_voie', etablissement.numero_voie,
      'type_voie', etablissement.type_voie,
      'nom_voie', etablissement.nom_voie,
      'code_postal', etablissement.code_postal,
    )`.as("etablissement"),
      sql`COUNT(temoignages.id)`.as("temoignagesCount"),
    ])
    .leftJoin("temoignages_campagnes", "temoignages_campagnes.campagne_id", "campagnes.id")
    .leftJoin("temoignages", "campagnes.id", "temoignages_campagnes.campagne_id")
    .leftJoin("questionnaires", "campagnes.questionnaire_id", "questionnaires.id")
    .leftJoin("formations", "campagnes.id", "formations.campagne_id")
    .leftJoin("etablissements", "formations.etablissement_id", "etablissements.id")
    .where("deleted_at", "=", null)
    .where("campagnes.id", "=", id);

  return baseQuery.execute();
};

export const getAllWithTemoignageCountFormationEtablissement = async (campagneIds: string[]) => {
  const baseQuery = kdb
    .selectFrom("campagnes")
    .select([
      "campagnes.id",
      "campagnes.nom_campagne",
      "campagnes.start_date",
      "campagnes.end_date",
      "campagnes.seats",
      "campagnes.created_at",
      "campagnes.updated_at",
      sql`json_build_object(
      'id', formation.id,
      'catalogue_id, formation.catalogue_id,
      'code_postal', formation.code_postal,
      'num_departement', formation.num_departement,
      'region', formation.region,
      'localite', formation.localite,
      'intitule_long', formation.intitule_long,
      'diplome', formation.diplome,
      'duree', formation.duree,
      'lieu_formation_adresse', formation.lieu_formation_adresse,
      'lieu_formation_adresse_computed', formation.lieu_formation_adresse_computed,
      'tags', formation.tags,
      'etablissement_gestionnaire_siret', formation.etablissement_gestionnaire_siret,
      'etablissement_gestionnaire_enseigne', formation.etablissement_gestionnaire_enseigne,
      'etablissement_formateur_siret', formation.etablissement_formateur_siret,
      'etablissement_formateur_enseigne', formation.etablissement_formateur_enseigne,
      'etablissment_formateur_adresse', formation.etablissement_formateur_adresse,
      'etablissement_formateur_localite', formation.etablissement_formateur_localite,
      'etablissement_formateur_entreprise_raison_sociale', formation.etablissement_formateur_entreprise_raison_sociale
    )`.as("formation"),
      sql`json_build_object(
      'id', etablissement.id,
      'catalogue_id', etablissement.catalogue_id,
      'siret', etablissement.siret,
      'onisep_nom', etablissement.onisep_nom,
      'enseigne', etablissement.enseigne,
      'entreprise_raison_sociale', etablissement.entreprise_raison_sociale,
      'uai', etablissement.uai,
      'localite', etablissement.localite,
      'region_implantation_nom', etablissement.region_implantation_nom,
      'numero_voie', etablissement.numero_voie,
      'type_voie', etablissement.type_voie,
      'nom_voie', etablissement.nom_voie,
      'code_postal', etablissement.code_postal,
    )`.as("etablissement"),
      sql`COUNT(temoignages.id)`.as("temoignagesCount"),
    ])
    .leftJoin("temoignages_campagnes", "temoignages_campagnes.campagne_id", "campagnes.id")
    .leftJoin("temoignages", "campagnes.id", "temoignages_campagnes.campagne_id")
    .leftJoin("formations", "campagnes.id", "formations.campagne_id")
    .leftJoin("etablissements", "formations.etablissement_id", "etablissements.id")
    .where("deleted_at", "=", null)
    .where("campagnes.id", "in", campagneIds);

  return baseQuery.execute();
};
