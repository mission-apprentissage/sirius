import { sql } from "kysely";
import { kdb } from "../db/db";
import { ObserverScope } from "../types";

export const getAllWithTemoignageCountAndTemplateName = async ({
  siret,
  query,
  scope,
}: {
  siret?: string[];
  query: { diplome?: string; etablissementFormateurSiret?: string; departement?: string; campagneIds: string[] };
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
      "campagnes.questionnaire_id",
      "campagnes.created_at",
      "campagnes.updated_at",
      sql`json_build_object(
        'questionnaireId', questionnaires.id,
        'questionnaireTemplateName', questionnaires.nom
      )`.as("questionnaire"),
      sql`json_build_object(
        'id', formations.id,
        'catalogue_id', formations.catalogue_id,
        'code_postal', formations.code_postal,
        'num_departement', formations.num_departement,
        'region', formations.region,
        'localite', formations.localite,
        'intitule_long', formations.intitule_long,
        'diplome', formations.diplome,
        'duree', formations.duree,
        'lieu_formation_adresse', formations.lieu_formation_adresse,
        'lieu_formation_adresse_computed', formations.lieu_formation_adresse_computed,
        'tags', formations.tags,
        'etablissement_gestionnaire_siret', formations.etablissement_gestionnaire_siret,
        'etablissement_gestionnaire_enseigne', formations.etablissement_gestionnaire_enseigne,
        'etablissement_formateur_siret', formations.etablissement_formateur_siret,
        'etablissement_formateur_enseigne', formations.etablissement_formateur_enseigne,
        'etablissement_formateur_entreprise_raison_sociale', formations.etablissement_formateur_entreprise_raison_sociale
      )`.as("formation"),
      sql`json_build_object(
        'id', etablissements.id,
        'catalogue_id', etablissements.catalogue_id,
        'siret', etablissements.siret,
        'onisep_nom', etablissements.onisep_nom,
        'enseigne', etablissements.enseigne,
        'entreprise_raison_sociale', etablissements.entreprise_raison_sociale,
        'uai', etablissements.uai,
        'localite', etablissements.localite,
        'region_implantation_nom', etablissements.region_implantation_nom,
        'numero_voie', etablissements.catalogue_data ->> 'numero_voie',
        'type_voie', etablissements.catalogue_data ->> 'type_voie',
        'nom_voie', etablissements.catalogue_data ->> 'nom_voie',
        'code_postal', etablissements.catalogue_data ->> 'code_postal'
      )`.as("etablissement"),
      sql`COUNT(temoignages.id)`.as("temoignagesCount"),
      sql`COALESCE(json_agg(json_build_object(
        'id', temoignages.id,
        'last_question_at', temoignages.last_question_at,
        'created_at', temoignages.created_at
      )) FILTER (WHERE temoignages.id IS NOT NULL), '[]')`.as("temoignages"),
    ])
    .leftJoin("temoignages_campagnes", "temoignages_campagnes.campagne_id", "campagnes.id")
    .leftJoin("temoignages", "temoignages.id", "temoignages_campagnes.temoignage_id")
    .leftJoin("questionnaires", "campagnes.questionnaire_id", "questionnaires.id")
    .leftJoin("formations_campagnes", "campagnes.id", "formations_campagnes.campagne_id")
    .leftJoin("formations", "formations.id", "formations_campagnes.formation_id")
    .leftJoin("etablissements", "formations.etablissement_id", "etablissements.id")
    .where("campagnes.deleted_at", "is", null)
    .groupBy(["campagnes.id", "questionnaires.id", "formations.id", "etablissements.id"]);

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

  if (query && query.campagneIds?.length) {
    baseQuery = baseQuery.where("campagnes.id", "in", query.campagneIds);
  }

  if (siret) {
    baseQuery = baseQuery.where("formations.etablissement_formateur_siret", "in", siret);
  }

  return baseQuery.execute();
};

export const getAllOnlyDiplomeTypeAndEtablissements = async (query?: { siret?: string[] }, scope?: ObserverScope) => {
  let baseQuery = kdb
    .selectFrom("campagnes")
    .leftJoin("formations_campagnes", "campagnes.id", "formations_campagnes.campagne_id")
    .leftJoin("formations", "formations.id", "formations_campagnes.formation_id")
    .leftJoin("etablissements", "formations.etablissement_formateur_siret", "etablissements.siret")
    .select([
      "campagnes.id",
      sql`json_build_object(
        'id', formations.id,
        'catalogue_id', formations.catalogue_id,
        'code_postal', formations.code_postal,
        'num_departement', formations.num_departement,
        'region', formations.region,
        'localite', formations.localite,
        'intitule_long', formations.intitule_long,
        'diplome', formations.diplome,
        'duree', formations.duree,
        'lieu_formation_adresse', formations.lieu_formation_adresse,
        'lieu_formation_adresse_computed', formations.lieu_formation_adresse_computed,
        'tags', formations.tags,
        'etablissement_gestionnaire_siret', formations.etablissement_gestionnaire_siret,
        'etablissement_gestionnaire_enseigne', formations.etablissement_gestionnaire_enseigne,
        'etablissement_formateur_siret', formations.etablissement_formateur_siret,
        'etablissement_formateur_enseigne', formations.etablissement_formateur_enseigne,
        'etablissment_formateur_adresse', formations.etablissement_formateur_adresse,
        'etablissement_formateur_localite', formations.etablissement_formateur_localite,
        'etablissement_formateur_entreprise_raison_sociale', formations.etablissement_formateur_entreprise_raison_sociale
      )`.as("formation"),
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

export const create = async (campagne: any): Promise<{ id: string } | undefined> => {
  const result = await kdb.insertInto("campagnes").values(campagne).returning("id").executeTakeFirst();

  return result;
};

export const deleteMany = async (ids: string[]): Promise<boolean> => {
  const result = await kdb.updateTable("campagnes").set({ deleted_at: new Date() }).where("id", "in", ids).execute();

  return result[0].numUpdatedRows === BigInt(ids.length);
};

export const update = async (id: string, updatedCampagne: any): Promise<boolean> => {
  const result = await kdb
    .updateTable("campagnes")
    .set(updatedCampagne)
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst();

  return result.numUpdatedRows === BigInt(1);
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

export const countWithAtLeastOneTemoignages = async () => {
  const result = await kdb
    .selectFrom("campagnes")
    .innerJoin("temoignages_campagnes", "campagnes.id", "temoignages_campagnes.campagne_id")
    .select(sql<number>`count(distinct campagnes.id)`.as("count"))
    .where("campagnes.deleted_at", "is", null)
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
        'questionnaireId', questionnaires.id,
        'questionnaireTemplateName', questionnaires.nom,
        'questionnaire', questionnaires.questionnaire,
        'questionnaireUI', questionnaires.questionnaire_ui
      )`.as("questionnaire"),
      sql`json_build_object(
        'id', formations.id,
        'catalogue_id', formations.catalogue_id,
        'code_postal', formations.code_postal,
        'num_departement', formations.num_departement,
        'region', formations.region,
        'localite', formations.localite,
        'intitule_long', formations.intitule_long,
        'diplome', formations.diplome,
        'duree', formations.duree,
        'lieu_formation_adresse', formations.lieu_formation_adresse,
        'lieu_formation_adresse_computed', formations.lieu_formation_adresse_computed,
        'tags', formations.tags,
        'etablissement_gestionnaire_siret', formations.etablissement_gestionnaire_siret,
        'etablissement_gestionnaire_enseigne', formations.etablissement_gestionnaire_enseigne,
        'etablissement_formateur_siret', formations.etablissement_formateur_siret,
        'etablissement_formateur_enseigne', formations.etablissement_formateur_enseigne,
        'etablissement_formateur_entreprise_raison_sociale', formations.etablissement_formateur_entreprise_raison_sociale
      )`.as("formation"),
      sql`json_build_object(
        'id', etablissements.id,
        'catalogue_id', etablissements.catalogue_id,
        'siret', etablissements.siret,
        'onisep_nom', etablissements.onisep_nom,
        'enseigne', etablissements.enseigne,
        'entreprise_raison_sociale', etablissements.entreprise_raison_sociale,
        'uai', etablissements.uai,
        'localite', etablissements.localite,
        'region_implantation_nom', etablissements.region_implantation_nom,
        'numero_voie', etablissements.catalogue_data ->> 'numero_voie',
        'type_voie', etablissements.catalogue_data ->> 'type_voie',
        'nom_voie', etablissements.catalogue_data ->> 'nom_voie',
        'code_postal', etablissements.catalogue_data ->> 'code_postal'
      )`.as("etablissement"),
      sql`COUNT(temoignages.id)`.as("temoignagesCount"),
    ])
    .leftJoin("temoignages_campagnes", "temoignages_campagnes.campagne_id", "campagnes.id")
    .leftJoin("temoignages", "temoignages_campagnes.temoignage_id", "temoignages.id")
    .leftJoin("questionnaires", "campagnes.questionnaire_id", "questionnaires.id")
    .leftJoin("formations_campagnes", "campagnes.id", "formations_campagnes.campagne_id")
    .leftJoin("formations", "formations.id", "formations_campagnes.formation_id")
    .leftJoin("etablissements", "formations.etablissement_id", "etablissements.id")
    .where("campagnes.deleted_at", "is", null)
    .where("campagnes.id", "=", id)
    .groupBy(["campagnes.id", "questionnaires.id", "formations.id", "etablissements.id"]);

  return baseQuery.executeTakeFirst();
};

export const getAllWithTemoignageCountFormationEtablissement = async (campagneIds: string[]) => {
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
        'id', formations.id,
        'catalogue_id', formations.catalogue_id,
        'code_postal', formations.code_postal,
        'num_departement', formations.num_departement,
        'region', formations.region,
        'localite', formations.localite,
        'intitule_long', formations.intitule_long,
        'diplome', formations.diplome,
        'duree', formations.duree,
        'lieu_formation_adresse', formations.lieu_formation_adresse,
        'lieu_formation_adresse_computed', formations.lieu_formation_adresse_computed,
        'tags', formations.tags,
        'etablissement_gestionnaire_siret', formations.etablissement_gestionnaire_siret,
        'etablissement_gestionnaire_enseigne', formations.etablissement_gestionnaire_enseigne,
        'etablissement_formateur_siret', formations.etablissement_formateur_siret,
        'etablissement_formateur_enseigne', formations.etablissement_formateur_enseigne,
        'etablissment_formateur_adresse', formations.etablissement_formateur_adresse,
        'etablissement_formateur_localite', formations.etablissement_formateur_localite,
        'etablissement_formateur_entreprise_raison_sociale', formations.etablissement_formateur_entreprise_raison_sociale
      )`.as("formation"),
      sql`json_build_object(
        'id', etablissements.id,
        'catalogue_id', etablissements.catalogue_id,
        'siret', etablissements.siret,
        'onisep_nom', etablissements.onisep_nom,
        'enseigne', etablissements.enseigne,
        'entreprise_raison_sociale', etablissements.entreprise_raison_sociale,
        'uai', etablissements.uai,
        'localite', etablissements.localite,
        'region_implantation_nom', etablissements.region_implantation_nom,
        'numero_voie', etablissements.catalogue_data ->> 'numero_voie',
        'type_voie', etablissements.catalogue_data ->> 'type_voie',
        'nom_voie', etablissements.catalogue_data ->> 'nom_voie',
        'code_postal', etablissements.catalogue_data ->> 'code_postal'
      )`.as("etablissement"),
      sql`COUNT(temoignages.id)`.as("temoignagesCount"),
    ])
    .leftJoin("temoignages_campagnes", "temoignages_campagnes.campagne_id", "campagnes.id")
    .leftJoin("temoignages", "temoignages_campagnes.temoignage_id", "temoignages.id")
    .leftJoin("formations_campagnes", "campagnes.id", "formations_campagnes.campagne_id")
    .leftJoin("formations", "formations.id", "formations_campagnes.formation_id")
    .leftJoin("etablissements", "formations.etablissement_id", "etablissements.id")
    .where("campagnes.deleted_at", "is", null)
    .groupBy(["campagnes.id", "formations.id", "etablissements.id"]);

  if (campagneIds.length) {
    baseQuery = baseQuery.where("campagnes.id", "in", campagneIds);
  }

  return baseQuery.execute();
};
