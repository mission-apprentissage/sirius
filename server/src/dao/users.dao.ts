import camelcaseKeys from "camelcase-keys";
import decamelizeKeys from "decamelize-keys";
import { sql } from "kysely";

import { USER_STATUS } from "../constants";
import { getKbdClient } from "../db/db";
import type { ObserverScope, User, UserCreation } from "../types";
import type {
  FindAllResults,
  FindAllWithEtablissementResults,
  FindOneByEmailWithEtablissementResults,
  FindOneByIdWithEtablissementResults,
} from "./types/users.types";

export const findOneById = async (id: string): Promise<User | undefined> => {
  const baseQuery = getKbdClient()
    .selectFrom("users")
    .select([
      "users.id",
      "users.first_name",
      "users.last_name",
      "users.email",
      "users.email_confirmed",
      "users.role",
      sql<ObserverScope | null>`users.scope`.as("scope"),
      "users.status",
      "users.comment",
      "users.salt",
      "users.hash",
      "users.accepted_cgu",
      "users.confirmation_token",
      "users.created_at",
      "users.updated_at",
      "users.refresh_token",
      "users.notifications_email",
    ])
    .where("id", "=", id);

  const result = await baseQuery.executeTakeFirst();

  return result ? camelcaseKeys(result) : undefined;
};

export const findOneByEmail = async (email: string): Promise<User | undefined> => {
  const baseQuery = getKbdClient()
    .selectFrom("users")
    .select([
      "users.id",
      "users.first_name",
      "users.last_name",
      "users.email",
      "users.email_confirmed",
      "users.role",
      sql<ObserverScope | null>`users.scope`.as("scope"),
      "users.status",
      "users.comment",
      "users.salt",
      "users.hash",
      "users.accepted_cgu",
      "users.confirmation_token",
      "users.created_at",
      "users.updated_at",
      "users.refresh_token",
      "users.notifications_email",
    ])
    .where("email", "=", email);

  const result = await baseQuery.executeTakeFirst();

  return result ? camelcaseKeys(result) : undefined;
};

export const findAll = async (): FindAllResults => {
  const baseQuery = getKbdClient()
    .selectFrom("users")
    .select([
      "id",
      "first_name",
      "last_name",
      "email",
      "email_confirmed",
      "role",
      sql<ObserverScope | null>`users.scope`.as("scope"),
      "status",
      "comment",
      "accepted_cgu",
      "confirmation_token",
      "notifications_email",
      "created_at",
      "updated_at",
    ]);

  const results = await baseQuery.execute();

  return camelcaseKeys(results);
};

export const findOneByEmailWithEtablissement = async (email: string): FindOneByEmailWithEtablissementResults => {
  const baseQuery = getKbdClient()
    .selectFrom("users")
    .select([
      "users.id",
      "users.first_name",
      "users.last_name",
      "users.email",
      "users.email_confirmed",
      "users.role",
      sql<ObserverScope | null>`users.scope`.as("scope"),
      "users.status",
      "users.comment",
      "users.accepted_cgu",
      "users.confirmation_token",
      "users.salt",
      "users.hash",
      "users.created_at",
      "users.updated_at",
      sql<any>`
        CASE 
          WHEN COUNT(etablissements.id) = 0 THEN NULL
          ELSE array_agg(
            json_build_object(
              'id', etablissements.id,
              'catalogue_id', etablissements.catalogue_id,
              'siret', etablissements.siret,
              'onisep_nom', etablissements.onisep_nom,
              'onisep_url', etablissements.onisep_url,
              'enseigne', etablissements.enseigne,
              'entreprise_raison_sociale', etablissements.entreprise_raison_sociale,
              'uai', etablissements.uai,
              'localite', etablissements.localite,
              'region_implantation_nom', etablissements.region_implantation_nom
            )
          )
        END
      `.as("etablissements"),
    ])
    .where("email", "=", email)
    .leftJoin("users_etablissements", "users.id", "users_etablissements.user_id")
    .leftJoin("etablissements", "users_etablissements.etablissement_id", "etablissements.id")
    .groupBy("users.id");

  const result = await baseQuery.executeTakeFirst();

  return result ? camelcaseKeys(result) : undefined;
};

export const findOneByIdWithEtablissement = async (id: string): FindOneByIdWithEtablissementResults => {
  const baseQuery = getKbdClient()
    .selectFrom("users")
    .select([
      "users.id",
      "users.first_name",
      "users.last_name",
      "users.email",
      "users.email_confirmed",
      "users.role",
      sql<ObserverScope | null>`users.scope`.as("scope"),
      "users.status",
      "users.comment",
      "users.accepted_cgu",
      "users.confirmation_token",
      "users.notifications_email",
      "users.created_at",
      "users.updated_at",
      "users.hash",
      "users.salt",
      "users.refresh_token",
      sql<any>`
        CASE 
          WHEN COUNT(etablissements.id) = 0 THEN NULL
          ELSE array_agg(
            json_build_object(
              'id', etablissements.id,
              'catalogue_id', etablissements.catalogue_id,
              'siret', etablissements.siret,
              'onisep_nom', etablissements.onisep_nom,
              'onisep_url', etablissements.onisep_url,
              'enseigne', etablissements.enseigne,
              'entreprise_raison_sociale', etablissements.entreprise_raison_sociale,
              'uai', etablissements.uai,
              'localite', etablissements.localite,
              'region_implantation_nom', etablissements.region_implantation_nom
            )
          )
        END
      `.as("etablissements"),
    ])
    .where("users.id", "=", id)
    .leftJoin("users_etablissements", "users.id", "users_etablissements.user_id")
    .leftJoin("etablissements", "users_etablissements.etablissement_id", "etablissements.id")
    .groupBy("users.id");

  const result = await baseQuery.executeTakeFirst();

  return result ? camelcaseKeys(result) : undefined;
};

export const findAllWithEtablissement = async (): FindAllWithEtablissementResults => {
  const baseQuery = getKbdClient()
    .selectFrom("users")
    .select([
      "users.id",
      "users.first_name",
      "users.last_name",
      "users.email",
      "users.email_confirmed",
      "users.role",
      sql<ObserverScope | null>`users.scope`.as("scope"),
      "users.status",
      "users.comment",
      "users.accepted_cgu",
      "users.confirmation_token",
      "users.created_at",
      "users.updated_at",
      sql<any>`
        CASE 
          WHEN COUNT(etablissements.id) = 0 THEN NULL
          ELSE array_agg(
            json_build_object(
              'id', etablissements.id,
              'catalogue_id', etablissements.catalogue_id,
              'siret', etablissements.siret,
              'onisep_nom', etablissements.onisep_nom,
              'onisep_url', etablissements.onisep_url,
              'enseigne', etablissements.enseigne,
              'entreprise_raison_sociale', etablissements.entreprise_raison_sociale,
              'uai', etablissements.uai,
              'localite', etablissements.localite,
              'region_implantation_nom', etablissements.region_implantation_nom
            )
          )
        END
      `.as("etablissements"),
    ])
    .leftJoin("users_etablissements", "users.id", "users_etablissements.user_id")
    .leftJoin("etablissements", "users_etablissements.etablissement_id", "etablissements.id")
    .groupBy("users.id");

  const result = await baseQuery.execute();

  return camelcaseKeys(result);
};

export const update = async (id: string, user: Omit<User, "id" | "email" | "createdAt">): Promise<boolean> => {
  const result = await getKbdClient()
    .updateTable("users")
    .set(decamelizeKeys(user))
    .where("id", "=", id)
    .executeTakeFirst();

  return result.numUpdatedRows === BigInt(1);
};

export const create = async ({
  email,
  firstName,
  lastName,
  comment,
  role,
  confirmationToken,
  salt,
  hash,
}: UserCreation): Promise<{ id: string } | undefined> => {
  const newUser = {
    email: email.toLowerCase(),
    first_name: firstName,
    last_name: lastName,
    role,
    comment,
    confirmation_token: confirmationToken,
    salt,
    hash,
    status: USER_STATUS.PENDING,
    accepted_cgu: false,
    email_confirmed: false,
    refresh_token: JSON.stringify([]),
  };
  return getKbdClient().insertInto("users").values(newUser).returning("id").executeTakeFirst();
};
