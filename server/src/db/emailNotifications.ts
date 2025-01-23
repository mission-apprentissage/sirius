import { sql } from "kysely";

import { EMAIL_BREVO_TEMPLATES, USER_ROLES, USER_STATUS } from "../constants";
import { sendBrevoEmail } from "../modules/brevo";
import { getKbdClient } from "./db";

const sendEmailToUsersWithoutCampagnesSevenDaysAfterAccountCreation = async () => {
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
    campagnesCount: number;
  }[];

  if (usersWithoutCampagnes.length > 0) {
    for (const user of usersWithoutCampagnes) {
      await sendBrevoEmail({
        templateId: EMAIL_BREVO_TEMPLATES.NO_CAMPAGNES_SEVEN_DAYS_AFTER_ACCOUNT_CREATION,
        recipients: [{ email: user.email, name: `${user.firstName} ${user.lastName}` }],
        params: {
          firstname: user.firstName,
          lastname: user.lastName,
        },
      });
    }
  }
};

export const emailNotifications = async () => {
  await sendEmailToUsersWithoutCampagnesSevenDaysAfterAccountCreation();
};
