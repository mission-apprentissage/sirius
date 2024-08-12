import { InsertResult, UpdateResult, sql } from "kysely";
import { USER_STATUS } from "../constants";
import { kdb } from "../db/db";
import { User, UserCreation, UserPublic } from "../types";

export const findOneById = (id: string): Promise<User | undefined> => {
  return kdb.selectFrom("users").selectAll().where("id", "=", id).executeTakeFirst();
};

export const findOneByEmail = (email: string): Promise<User | undefined> => {
  return kdb.selectFrom("users").selectAll().where("email", "=", email).executeTakeFirst();
};

export const findAll = (): Promise<UserPublic[] | undefined> => {
  return kdb
    .selectFrom("users")
    .select([
      "id",
      "first_name",
      "last_name",
      "email",
      "email_confirmed",
      "role",
      "scope",
      "status",
      "comment",
      "accepted_cgu",
      "confirmation_token",
    ])
    .execute();
};

export const findAllWithEtablissement = (): Promise<(UserPublic & any)[] | undefined> => {
  return kdb
    .selectFrom("users")
    .select([
      "users.id",
      "users.first_name",
      "users.last_name",
      "users.email",
      "users.email_confirmed",
      "users.role",
      "users.scope",
      "users.status",
      "users.comment",
      "users.accepted_cgu",
      "users.confirmation_token",
      sql`
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
    .groupBy("users.id")
    .execute();
};

export const update = (id: string, user: User): Promise<UpdateResult[]> => {
  return kdb.updateTable("users").set(user).where("id", "=", id).execute();
};

export const create = async ({
  email,
  first_name,
  last_name,
  comment,
  role,
  confirmationToken,
  salt,
  hash,
}: UserCreation): Promise<InsertResult> => {
  const newUser = {
    email: email.toLowerCase(),
    first_name,
    last_name,
    role,
    comment,
    confirmation_token: confirmationToken,
    salt,
    hash,
    status: USER_STATUS.PENDING,
  };

  return kdb.insertInto("users").values(newUser).executeTakeFirst();
};
