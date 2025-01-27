import { sql } from "kysely";

import { EMAIL_BREVO_TEMPLATES, USER_ROLES, USER_STATUS, VERBATIM_STATUS } from "../constants";
import { sendBrevoEmail } from "../modules/brevo";
import { sendToSlack } from "../modules/slack";
import type { Verbatim } from "../types";
import { getKbdClient } from "./db";

const sendEmailToUsersWithoutCampagnesSevenDaysAfterAccountCreation = async (dryRun: boolean) => {
  const usersWithoutCampagnes = (await getKbdClient()
    .selectFrom("users")
    .leftJoin("users_etablissements", "users.id", "users_etablissements.user_id")
    .leftJoin("etablissements", "users_etablissements.etablissement_id", "etablissements.id")
    .leftJoin("formations", "formations.etablissement_id", "etablissements.id")
    .leftJoin("formations_campagnes", "formations.id", "formations_campagnes.formation_id")
    .leftJoin("campagnes", "formations_campagnes.campagne_id", "campagnes.id")
    .select([
      "users.id",
      "users.first_name",
      "users.last_name",
      "users.email",
      "users.created_at",
      "users.notifications_email",
      sql<number>`COUNT(DISTINCT campagnes.id) FILTER (WHERE campagnes.id IS NOT NULL)`.as("campagnesCount"),
    ])
    .where("users.email_confirmed", "=", true)
    .where("users.role", "=", USER_ROLES.ETABLISSEMENT)
    .where("users.status", "=", USER_STATUS.ACTIVE)
    .where("users.created_at", "is not", null)
    .where(sql`DATE(users.created_at)`, "=", sql`CURRENT_DATE - INTERVAL '7 days'`)
    .where("campagnes.deleted_at", "is", null)
    .where("formations.deleted_at", "is", null)
    .where("etablissements.deleted_at", "is", null)
    .groupBy(["users.id"])
    .having(sql`COUNT(DISTINCT campagnes.id) FILTER (WHERE campagnes.id IS NOT NULL)`, "=", 0)
    .execute()) as unknown as {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    notificationsEmail: Record<string, unknown> | null;
    campagnesCount: number;
  }[];

  const usersWithoutCampagnesThatHaveNotBeenNotified = usersWithoutCampagnes.filter(
    (user) => !user.notificationsEmail?.noCampagnesSevenDaysAfterAccountCreation
  );

  if (usersWithoutCampagnesThatHaveNotBeenNotified.length > 0) {
    if (dryRun) {
      console.log("Dry run enabled, skipping email sending");
      console.log(usersWithoutCampagnesThatHaveNotBeenNotified.map((user) => user.email));
      return usersWithoutCampagnesThatHaveNotBeenNotified.map((user) => user.email);
    }
    for (const user of usersWithoutCampagnesThatHaveNotBeenNotified) {
      const newNotificationsEmail = {
        ...user.notificationsEmail,
        noCampagnesSevenDaysAfterAccountCreation: new Date().toISOString(),
      };
      try {
        await getKbdClient()
          .updateTable("users")
          .set({
            notifications_email: newNotificationsEmail,
          })
          .where("id", "=", user.id)
          .execute();

        await sendBrevoEmail({
          templateId: EMAIL_BREVO_TEMPLATES.NO_CAMPAGNES_SEVEN_DAYS_AFTER_ACCOUNT_CREATION,
          recipients: [{ email: user.email, name: `${user.firstName} ${user.lastName}` }],
          params: {
            firstname: user.firstName,
            lastname: user.lastName,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  return usersWithoutCampagnesThatHaveNotBeenNotified.map((user) => user.email);
};

const sendEmailToUsersWithFirstModeratedVerbatims = async (dryRun: boolean) => {
  const usersWithFirstModeratedVerbatims = (await getKbdClient()
    .selectFrom("users")
    .leftJoin("users_etablissements", "users.id", "users_etablissements.user_id")
    .leftJoin("etablissements", "users_etablissements.etablissement_id", "etablissements.id")
    .leftJoin("formations", "formations.etablissement_id", "etablissements.id")
    .leftJoin("formations_campagnes", "formations.id", "formations_campagnes.formation_id")
    .leftJoin("campagnes", "formations_campagnes.campagne_id", "campagnes.id")
    .leftJoin("temoignages_campagnes", "campagnes.id", "temoignages_campagnes.campagne_id")
    .leftJoin("temoignages", "temoignages_campagnes.temoignage_id", "temoignages.id")
    .leftJoin("verbatims", "temoignages.id", "verbatims.temoignage_id")
    .select([
      "users.id",
      "users.first_name",
      "users.last_name",
      "users.email",
      "users.notifications_email",
      "users.created_at",
      sql<number>`COUNT(DISTINCT campagnes.id) FILTER (WHERE campagnes.id IS NOT NULL)`.as("campagnesCount"),
      sql<unknown>`
        COALESCE(
          JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', verbatims.id,
              'content', verbatims.content,
              'created_at', verbatims.created_at,
              'updated_at', verbatims.updated_at,
              'status', verbatims.status
            )
          ) FILTER ( 
            WHERE verbatims.status IN ('VALIDATED', 'GEM')
              AND verbatims.updated_at::date = CURRENT_DATE - 1
          ),
          '[]'::jsonb
        )
      `.as("verbatims"),
    ])
    .where("users.email_confirmed", "=", true)
    .where("users.role", "=", USER_ROLES.ETABLISSEMENT)
    .where("users.status", "=", USER_STATUS.ACTIVE)
    .where("users.created_at", "is not", null) // Important pour ne pas envoyer de mail aux utilisateurs créés avant la mise en place de cette fonctionnalité
    .where("campagnes.deleted_at", "is", null)
    .where("formations.deleted_at", "is", null)
    .where("etablissements.deleted_at", "is", null)
    .groupBy(["users.id"])
    .having(sql`COUNT(DISTINCT campagnes.id) FILTER (WHERE campagnes.id IS NOT NULL)`, ">", 0)
    .having(
      sql`COUNT(DISTINCT verbatims.id) FILTER (
        WHERE verbatims.status IN ('VALIDATED', 'GEM')
          AND verbatims.updated_at::date = CURRENT_DATE - 1
      )`,
      ">",
      0
    )
    .execute()) as unknown as {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    notificationsEmail: Record<string, unknown> | null;
    campagnesCount: number;
    verbatims: Verbatim[];
  }[];

  const usersWithFirstModeratedVerbatimsThatHaveNotBeenNotified = usersWithFirstModeratedVerbatims.filter(
    (user) => !user.notificationsEmail?.firstModeratedVerbatims
  );

  if (usersWithFirstModeratedVerbatimsThatHaveNotBeenNotified.length > 0) {
    if (dryRun) {
      console.log("Dry run enabled, skipping email sending");
      console.log(usersWithFirstModeratedVerbatimsThatHaveNotBeenNotified.map((user) => user.email));
      return usersWithFirstModeratedVerbatimsThatHaveNotBeenNotified.map((user) => user.email);
    }
    for (const user of usersWithFirstModeratedVerbatims) {
      const newNotificationsEmail = {
        ...user.notificationsEmail,
        firstModeratedVerbatims: new Date().toISOString(),
      };
      try {
        const gem = user.verbatims.filter((verbatim: Verbatim) => verbatim.status === VERBATIM_STATUS.GEM);

        await getKbdClient()
          .updateTable("users")
          .set({
            notifications_email: newNotificationsEmail,
          })
          .where("id", "=", user.id)
          .execute();

        await sendBrevoEmail({
          templateId: EMAIL_BREVO_TEMPLATES.FIRST_MODERATED_VERBATIMS,
          recipients: [{ email: user.email, name: `${user.firstName} ${user.lastName}` }],
          params: {
            firstname: user.firstName,
            lastname: user.lastName,
            gem: gem?.length ? gem[0].content : null,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  return usersWithFirstModeratedVerbatimsThatHaveNotBeenNotified.map((user) => user.email);
};

export const emailNotifications = async (dryRun: boolean) => {
  const recipientsUsersWithoutCampagnes = await sendEmailToUsersWithoutCampagnesSevenDaysAfterAccountCreation(dryRun);
  const recipientsUsersWithFirstModeratedVerbatims = await sendEmailToUsersWithFirstModeratedVerbatims(dryRun);

  const slackBlocksMessage = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `:email: *Rapport d'envoi d'email*`,
        emoji: true,
      },
    },
    {
      type: "divider",
    },
  ];

  if (recipientsUsersWithoutCampagnes.length) {
    slackBlocksMessage.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:zero: Pas de campagnes 7 jours après la création du compte: ${recipientsUsersWithoutCampagnes.length} utilisateurs`,
        emoji: true,
      },
    });
  }

  if (recipientsUsersWithFirstModeratedVerbatims.length) {
    slackBlocksMessage.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:one: Premiers verbatims modérés: ${recipientsUsersWithFirstModeratedVerbatims.length} utilisateurs`,
        emoji: true,
      },
    });
  }

  if (recipientsUsersWithoutCampagnes.length || recipientsUsersWithFirstModeratedVerbatims.length) {
    const summaryResponse = await sendToSlack(slackBlocksMessage);

    if (!summaryResponse?.ok) {
      throw new Error("Failed to send the summary message");
    }

    const thread_ts = summaryResponse.ts;

    const recipientsUsersWithoutCampagnesEmailMessage = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Utilisateurs sans campagnes après 7 jours*\n${recipientsUsersWithoutCampagnes.join("\n")}`,
        },
      },
    ];

    const recipientsUsersWithFirstModeratedVerbatimsEmailMessage = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Premiers verbatims modérés*\n${recipientsUsersWithFirstModeratedVerbatims.join("\n")}`,
        },
      },
    ];

    recipientsUsersWithoutCampagnes.length &&
      (await sendToSlack(recipientsUsersWithoutCampagnesEmailMessage, thread_ts));
    recipientsUsersWithFirstModeratedVerbatimsEmailMessage.length &&
      (await sendToSlack(recipientsUsersWithFirstModeratedVerbatimsEmailMessage, thread_ts));
  }
};
