import { Kysely, sql } from "kysely";
import { v4 as uuidv4 } from "uuid";
import { DB } from "../db/schema";
import createComponents from "../components";
import { USER_ROLES } from "../constants";

export const up = async (db: Kysely<DB>) => {
  const { users, etablissements, formations, campagnes, questionnaires, temoignages, verbatims } =
    await createComponents();

  const mapIds = (items: any[]) => items.map((item: any) => ({ oldId: item._id.toString(), newId: uuidv4() }));

  const userIdsMapping = mapIds(await users.getAll());
  const etablissementsIdsMapping = mapIds(await etablissements.getAll());
  const formationsIdsMapping = mapIds(await formations.getAll());
  const campagnesIdsMapping = mapIds(await campagnes.getAll());
  const questionnairesIdsMapping = mapIds(await questionnaires.getAll());
  const temoignagesIdsMapping = mapIds(await temoignages.getAll());

  const allVerbatims = await verbatims.getAll();

  const findNewId = (mappingArray: { oldId: string; newId: string }[], oldId: string): string | undefined =>
    mappingArray.find((mapping) => mapping.oldId === oldId)?.newId;

  for (const etablissement of await etablissements.getAll()) {
    const newId = findNewId(etablissementsIdsMapping, etablissement._id.toString());
    try {
      if (!newId) {
        console.log("No newId found for etablissement", etablissement._id.toString());
        continue;
      }
      await db
        .insertInto("etablissements")
        .values({
          id: newId,
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
    } catch (error) {
      console.error("Error inserting etablissement:", error);
    }
  }

  for (const user of await users.getAll()) {
    const newId = findNewId(userIdsMapping, user._id.toString());

    try {
      if (!newId) {
        console.log("No newId found for user", user._id.toString());
        continue;
      }
      await db
        .insertInto("users")
        .values({
          id: newId,
          first_name: user.firstName,
          last_name: user.lastName,
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

      if (user.role === USER_ROLES.ETABLISSEMENT) {
        for (const etablissement of user.etablissements) {
          const foundEtablissement = (await etablissements.getAll()).find(
            (fullEtablissement: any) => fullEtablissement.data.siret === etablissement.siret
          );

          if (foundEtablissement) {
            const newIdEtablissement = findNewId(etablissementsIdsMapping, foundEtablissement._id.toString());

            if (!newIdEtablissement) {
              console.log("No newIdEtablissement found for etablissement", foundEtablissement._id.toString());
              continue;
            }

            await db
              .insertInto("users_etablissements")
              .values({
                user_id: newId,
                etablissement_id: newIdEtablissement,
              })
              .execute();
          }
        }
      }
    } catch (error) {
      console.error("Error inserting user:", error);
    }
  }

  for (const questionnaire of await questionnaires.getAll()) {
    const newQuestionnaireId = findNewId(questionnairesIdsMapping, questionnaire._id.toString());

    try {
      if (!newQuestionnaireId) {
        console.log("No newQuestionnaireId found for questionnaire", questionnaire._id.toString());
        continue;
      }
      await db
        .insertInto("questionnaires")
        .values({
          id: newQuestionnaireId,
          nom: questionnaire.nom,
          questionnaire: JSON.stringify(questionnaire.questionnaire),
          questionnaire_ui: JSON.stringify(questionnaire.questionnaireUI),
          is_validated: questionnaire.isValidated || false,
          created_at: questionnaire.createdAt,
          updated_at: questionnaire.updatedAt,
          deleted_at: questionnaire.deletedAt,
        })
        .execute();
    } catch (error) {
      console.error("Error inserting questionnaire:", error);
    }
  }

  for (const campagne of await campagnes.getAll()) {
    const newCampagneId = findNewId(campagnesIdsMapping, campagne._id.toString());
    const newQuestionnaireId = findNewId(questionnairesIdsMapping, campagne.questionnaireId.toString());

    try {
      if (!newCampagneId) {
        console.log("No newCampagneId found for campagne", campagne._id.toString());
        continue;
      }
      await db
        .insertInto("campagnes")
        .values({
          id: newCampagneId,
          nom_campagne: campagne.nomCampagne,
          start_date: campagne.startDate,
          end_date: campagne.endDate,
          questionnaire_id: newQuestionnaireId,
          seats: campagne.seats,
          created_at: campagne.createdAt,
          updated_at: campagne.updatedAt,
          deleted_at: campagne.deletedAt,
        })
        .execute();
    } catch (error) {
      console.error("Error inserting campagne:", error);
    }
  }

  for (const formation of await formations.getAll()) {
    const etablissementId = (await etablissements.getAll())
      .find((etablissement: any) => etablissement?.formationIds?.includes(formation._id?.toString()))
      ?._id?.toString();

    const newEtablissementId = findNewId(etablissementsIdsMapping, etablissementId);
    const newFormationId = findNewId(formationsIdsMapping, formation._id.toString());
    const newCampagneId = findNewId(campagnesIdsMapping, formation.campagneId.toString());

    if (!etablissementId) {
      console.log("No etablissement found for formation", formation._id.toString());
    } else {
      try {
        if (!newFormationId) {
          console.log("No newFormationId found for formation", formation._id.toString());
          continue;
        }
        await db
          .insertInto("formations")
          .values({
            id: newFormationId,
            catalogue_id: formation.data._id,
            campagne_id: newCampagneId,
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
            etablissement_id: newEtablissementId,
            updated_at: formation.updatedAt,
            created_at: formation.createdAt,
            deleted_at: formation.deletedAt,
          })
          .execute();
      } catch (error) {
        console.error("Error inserting formation:", error);
      }
    }
  }

  for (const temoignage of await temoignages.getAll()) {
    const newTemoignageId = findNewId(temoignagesIdsMapping, temoignage._id.toString());

    try {
      if (!newTemoignageId) {
        console.log("No newTemoignageId found for temoignage", temoignage._id.toString());
        continue;
      }
      await db
        .insertInto("temoignages")
        .values({
          id: newTemoignageId,
          reponses: JSON.stringify(temoignage.reponses),
          is_bot: temoignage.isBot,
          last_question_at: temoignage.lastQuestionAt,
          created_at: temoignage.createdAt,
          updated_at: temoignage.updatedAt,
          deleted_at: temoignage.deletedAt,
        })
        .execute();

      if (temoignage.campagneId) {
        const newCampagneId = findNewId(campagnesIdsMapping, temoignage.campagneId.toString());

        await db
          .insertInto("temoignages_campagnes")
          .values({
            temoignage_id: newTemoignageId,
            campagne_id: newCampagneId,
          })
          .execute();
      }
    } catch (error) {
      console.error("Error inserting temoignage:", error);
    }
  }

  for (const verbatim of allVerbatims) {
    const newTemoignageId = findNewId(temoignagesIdsMapping, verbatim.temoignageId.toString());

    if (!verbatim?.content?.trim()) {
      console.log("Empty content for verbatim", verbatim._id.toString());
      continue;
    }

    if (!newTemoignageId) {
      console.log("No newTemoignageId found for verbatim", verbatim._id.toString());
      continue;
    }

    try {
      await db
        .insertInto("verbatims")
        .values({
          temoignage_id: newTemoignageId,
          question_key: verbatim.questionKey,
          content: verbatim.content,
          status: verbatim.status,
          scores: verbatim?.scores ? JSON.stringify(verbatim.scores) : null,
          themes: verbatim?.themes ?  JSON.stringify(verbatim.themes) : null,
          created_at: verbatim.createdAt,
          updated_at: verbatim.updatedAt,
          deleted_at: verbatim.deletedAt,
        })
        .execute();
    } catch (error) {
      console.error("Error inserting verbatim:", error);
    }
  }
};

export const down = async (db: Kysely<DB>) => {
  try {
    await db.executeQuery(
      sql`
            ALTER TABLE campagnes DROP CONSTRAINT IF EXISTS campagnes_questionnaire_id_fkey;
            ALTER TABLE formations DROP CONSTRAINT IF EXISTS formations_campagne_id_fkey;
            ALTER TABLE formations DROP CONSTRAINT IF EXISTS formations_etablissement_id_fkey;
            ALTER TABLE temoignages_campagnes DROP CONSTRAINT IF EXISTS temoignages_campagnes_temoignage_id_fkey;
            ALTER TABLE temoignages_campagnes DROP CONSTRAINT IF EXISTS temoignages_campagnes_campagne_id_fkey;
            ALTER TABLE verbatims DROP CONSTRAINT IF EXISTS verbatims_temoignage_id_fkey;
            ALTER TABLE users_etablissements DROP CONSTRAINT IF EXISTS users_etablissements_user_id_fkey;
            ALTER TABLE users_etablissements DROP CONSTRAINT IF EXISTS users_etablissements_etablissement_id_fkey;
          `.compile(db)
    );

    await db.deleteFrom("verbatims").execute();
    await db.deleteFrom("temoignages_campagnes").execute();
    await db.deleteFrom("temoignages").execute();
    await db.deleteFrom("campagnes").execute();
    await db.deleteFrom("questionnaires").execute();
    await db.deleteFrom("formations").execute();
    await db.deleteFrom("etablissements").execute();
    await db.deleteFrom("users_etablissements").execute();
    await db.deleteFrom("users").execute();
  } catch (error) {
    console.error("Error during down migration:", error);
  }
};
