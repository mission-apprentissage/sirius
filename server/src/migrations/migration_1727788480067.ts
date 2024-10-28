import type { Generated, Kysely } from "kysely";
import { sql } from "kysely";

interface FormationsCampagnes {
  id: Generated<string>;
  formation_id: string;
  campagne_id: string;
}

interface Database {
  formations_campagnes: FormationsCampagnes;
  formations: {
    id: string;
    campagne_id: string | null;
  };
  campagnes: {
    id: string;
  };
}

export const up = async (db: Kysely<Database>) => {
  await db.schema
    .createTable("formations_campagnes")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn("formation_id", "uuid", (col) => col.references("formations.id"))
    .addColumn("campagne_id", "uuid", (col) => col.references("campagnes.id"))
    .addUniqueConstraint("unique_formation_campagne", ["formation_id", "campagne_id"])
    .execute();

  await db
    .insertInto("formations_campagnes")
    .columns(["formation_id", "campagne_id"])
    .expression(
      db.selectFrom("formations").select(["id as formation_id", "campagne_id"]).where("campagne_id", "is not", null)
    )
    .execute();

  await db.schema.alterTable("formations").dropColumn("campagne_id").execute();

  await db.schema
    .createIndex("idx_formations_campagnes_formation_id")
    .on("formations_campagnes")
    .column("formation_id")
    .execute();

  await db.schema
    .createIndex("idx_formations_campagnes_campagne_id")
    .on("formations_campagnes")
    .column("campagne_id")
    .execute();
};

export const down = async (db: Kysely<Database>) => {
  await db.schema.dropIndex("idx_formations_campagnes_formation_id").execute();
  await db.schema.dropIndex("idx_formations_campagnes_campagne_id").execute();

  await db.schema.alterTable("formations").addColumn("campagne_id", "uuid").execute();

  await db.schema.dropTable("formations_campagnes").execute();
};
