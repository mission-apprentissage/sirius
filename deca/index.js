const fs = require("fs");
const { opendir } = require("fs").promises;
const path = require("path");
const _ = require("lodash");
const csv = require("csv-parser");
const { Readable } = require("stream");
const env = require("env-var");
const { oleoduc, transformObject, writeObject, filterObject } = require("oleoduc");
const { findTableName, findPrimaryKey } = require("./primaryKeys");
const runScipt = require("../common/runScipt");

const isCsvWithSemicolon = (filename) => {
  return [
    "alternant.csv",
    "employeur.csv",
    "responsable_legal.csv",
    "tuteur.csv",
    "uai_etablissements_formation.csv",
  ].includes(filename);
};

const convertCsvIntoJson = async (dir, filename) => {
  let json = [];
  await oleoduc(
    fs.createReadStream(path.join(dir, filename), { encoding: "UTF-8" }),
    csv({ separator: isCsvWithSemicolon(filename) ? ";" : "," }),
    writeObject((data) => json.push(data))
  );
  return json;
};

const loadDescriptors = async (decaDir) => {
  const descriptors = [];

  await oleoduc(
    Readable.from(await opendir(decaDir)),
    filterObject((entry) => entry.name !== "details_contrat.csv"),
    transformObject(
      async (fileEntry) => {
        let filename = fileEntry.name;
        let json = await convertCsvIntoJson(decaDir, filename);

        return {
          tableName: filename.replace(/\.csv/g, ""),
          key: Object.keys(json[0] || {})[0], //Assumes primary key is the first property
          rows: json,
        };
      },
      { parallel: 5 }
    ),
    writeObject((descriptor) => descriptors.push(descriptor))
  );
  return descriptors;
};

let innerJoinAll = (row, primaryKey, descriptors) => {
  let foreignKeys = Object.keys(row).filter((key) => key.endsWith("_id") && key !== primaryKey);

  return {
    ..._.omit(row, foreignKeys),
    ...foreignKeys.reduce((acc, key) => {
      let foreignTableName = findTableName(key);
      let foreignDescriptor = descriptors.find((d) => d.tableName === foreignTableName);
      let foreignKeyName = findPrimaryKey(foreignDescriptor.tableName);
      let foreignRow = foreignDescriptor.rows.find((d) => d[key] === row[key]);

      return {
        ...acc,
        [foreignDescriptor.tableName]: foreignRow ? innerJoinAll(foreignRow, foreignKeyName, descriptors) : null,
      };
    }, {}),
  };
};

runScipt(async ({ db }) => {
  const decaDir = env.get("DECA_DIR").required().asString();
  let descriptors = await loadDescriptors(decaDir);

  await oleoduc(
    fs.createReadStream(path.join(decaDir, "details_contrat.csv"), { encoding: "UTF-8" }),
    csv(),
    writeObject(
      (row) => {
        let contrat = innerJoinAll(row, findPrimaryKey("details_contrat"), descriptors);
        return db.collection("deca").insertOne(contrat);
      },
      { parallel: 25 }
    )
  );
});
