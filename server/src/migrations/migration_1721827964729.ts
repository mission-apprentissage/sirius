import { Kysely } from "kysely";
import { DB } from "../db/schema";
import createComponents from "../components";

export const up = async (db: Kysely<DB>) => {
  const { users, etablissements, formations, campagnes, questionnaires, temoignages, verbatims } =
    await createComponents();

  const allUsers = await users.getAll();
  const allEtablissements = await etablissements.getAll();
  const allFormations = await formations.getAll();
  const allCampagnes = await campagnes.getAll();
  const allQuestionnaires = await questionnaires.getAll();
  const allTemoignages = await temoignages.getAll();
  const allVerbatims = await verbatims.getAll();

  for (const user of allUsers) {
    await db
      .insertInto("users")
      .values({
        id: user._id.toString(),
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
        email_confirmed: user.emailConfirmed,
        role: user.role,
        status: user.status,
        comment: user.comment,
        accepted_cgu: user.acceptedCgu || false,
        confirmation_token: user.confirmationToken,
        refresh_token: JSON.stringify(user.refreshToken),
        salt: user.salt,
        hash: user.hash,
        scope: JSON.stringify(user.scope),
      })
      .execute();

    for (const etablissement of user.etablissements) {
      await db
        .insertInto("users_etablissements")
        .values({
          user_id: user._id.toString(),
          etablissement_id: etablissement.siret,
        })
        .execute();
    }
  }

  for (const etablissement of allEtablissements) {
    await db
      .insertInto("etablissements")
      .values({
        id: etablissement._id.toString(),
        catalogue_id: etablissement.data._id,
        enseigne: etablissement.data.enseigne,
        entreprise_raison_sociale: etablissement.data.entreprise_raison_sociale,
        localite: etablissement.data.localite,
        onisep_nom: etablissement.data.onisep_nom,
        onisep_url: etablissement.data.onisep_url,
        region_implantation_nom: etablissement.data.region_implantation_nom,
        siret: etablissement.data.siret,
        uai: etablissement.data.uai,
        catalogue_data: JSON.stringify(etablissement.data),
        deleted_at: etablissement.deletedAt,
        created_at: etablissement.createdAt,
        updated_at: etablissement.updatedAt,
      })
      .execute();
  }

  for (const formation of allFormations) {
    const etablissementId = allEtablissements
      .find((etablissement: any) => etablissement?.formationIds?.includes(formation._id?.toString()))
      ?._id?.toString();

    if (!etablissementId) {
      console.log("No etablissement found for formation", formation._id.toString());
    } else {
      await db
        .insertInto("formations")
        .values({
          id: formation._id.toString(),
          catalogue_id: formation.data._id,
          campagne_id: formation.campagneId,
          code_postal: formation.data.code_postal,
          diplome: formation.data.diplome,
          duree: formation.data.duree,
          etablissement_formateur_adresse: formation.data.etablissement_formateur_adresse,
          etablissement_formateur_enseigne: formation.data.etablissement_formateur_enseigne,
          etablissement_formateur_entreprise_raison_sociale:
            formation.data.etablissement_formateur_entreprise_raison_sociale,
          etablissement_formateur_localite: formation.data.etablissement_formateur_localite,
          etablissement_formateur_siret: formation.data.etablissement_formateur_siret,
          etablissement_gestionnaire_enseigne: formation.data.etablissement_gestionnaire_enseigne,
          etablissement_gestionnaire_siret: formation.data.etablissement_gestionnaire_siret,
          intitule_court: formation.data.intitule_court,
          intitule_long: formation.data.intitule_long,
          lieu_formation_adresse: formation.data.lieu_formation_adresse,
          lieu_formation_adresse_computed: formation.data.lieu_formation_adresse_computed,
          localite: formation.data.localite,
          num_departement: formation.data.num_departement,
          region: formation.data.region,
          tags: JSON.stringify(formation.data.tags),
          catalogue_data: JSON.stringify(formation.data),
          etablissement_id: etablissementId,
          updated_at: formation.updatedAt,
          created_at: formation.createdAt,
          deleted_at: formation.deletedAt,
        })
        .execute();
    }
  }

  for (const campagne of allCampagnes) {
    await db
      .insertInto("campagnes")
      .values({
        id: campagne._id.toString(),
        nom_campagne: campagne.nomCampagne,
        start_date: campagne.startDate,
        end_date: campagne.endDate,
        questionnaire_id: campagne.questionnaireId,
        seats: campagne.seats,
        created_at: campagne.createdAt,
        updated_at: campagne.updatedAt,
        deleted_at: campagne.deletedAt,
      })
      .execute();
  }

  for (const questionnaire of allQuestionnaires) {
    await db
      .insertInto("questionnaires")
      .values({
        id: questionnaire._id.toString(),
        nom: questionnaire.nom,
        questionnaire: JSON.stringify(questionnaire.questionnaire),
        questionnaire_ui: JSON.stringify(questionnaire.questionnaireUI),
        is_validated: questionnaire.isValidated || false,
        created_at: questionnaire.createdAt,
        updated_at: questionnaire.updatedAt,
        deleted_at: questionnaire.deletedAt,
      })
      .execute();
  }

  for (const temoignage of allTemoignages) {
    await db
      .insertInto("temoignages")
      .values({
        id: temoignage._id.toString(),
        reponses: JSON.stringify(temoignage.reponses),
        is_bot: temoignage.isBot,
        last_question_at: temoignage.lastQuestionAt,
        created_at: temoignage.createdAt,
        updated_at: temoignage.updatedAt,
        deleted_at: temoignage.deletedAt,
      })
      .execute();

    if (temoignage.campagneId) {
      await db
        .insertInto("temoignages_campagnes")
        .values({
          temoignage_id: temoignage._id.toString(),
          campagne_id: temoignage.campagneId.toString(),
        })
        .execute();
    }
  }

  for (const verbatim of allVerbatims) {
    await db
      .insertInto("verbatims")
      .values({
        temoignage_id: verbatim.temoignageId.toString(),
        question_key: verbatim.questionKey,
        content: verbatim.content,
        status: verbatim.status,
        scores: JSON.stringify(verbatim.scores),
        themes: JSON.stringify(verbatim.themes),
        created_at: verbatim.createdAt,
        updated_at: verbatim.updatedAt,
        deleted_at: verbatim.deletedAt,
      })
      .execute();
  }
};

export const down = async (db: Kysely<DB>) => {
  await db.deleteFrom("verbatims").execute();
  await db.deleteFrom("temoignages").execute();
  await db.deleteFrom("campagnes").execute();
  await db.deleteFrom("questionnaires").execute();
  await db.deleteFrom("formations").execute();
  await db.deleteFrom("etablissements").execute();
  await db.deleteFrom("users_etablissements").execute();
  await db.deleteFrom("users").execute();
};
