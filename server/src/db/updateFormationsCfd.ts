/* eslint-disable no-process-exit */
/* eslint-disable n/no-process-exit */

import { getFormation } from "../modules/catalogue";
import { getKbdClient } from "./db";

const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const updateFormationsCfd = async () => {
  const formations = (await getKbdClient().selectFrom("formations").selectAll().execute()) as any[];
  let addedCfd = 0;
  let progression = 0;

  for (const formation of formations) {
    const options = `select={"cfd": 1}`;
    const formationFromCatalogue = await getFormation(formation.catalogueId, options);
    console.log(`Formation ${formation.id} - ${progression++}/${formations.length}`);
    await sleep(500);

    if (formationFromCatalogue.cfd) {
      if (!formation.cfd) {
        try {
          await getKbdClient()
            .updateTable("formations")
            .set({ cfd: [formationFromCatalogue.cfd] })
            .where("id", "=", formation.id)
            .execute();
          console.log(`Added CFD: ${formationFromCatalogue.cfd} for formation ${formation.id}`);
          addedCfd++;
        } catch (e) {
          console.error(`Error adding CFD: ${formationFromCatalogue.cfd} for formation ${formation.id}`);
          console.error(e);
        }
      } else {
        const hasNewformationsCfd = !formation.cfd.includes(formationFromCatalogue.cfd);
        if (hasNewformationsCfd) {
          try {
            await getKbdClient()
              .updateTable("formations")
              .set({ cfd: [...formation.cfd, formationFromCatalogue.cfd] })
              .where("id", "=", formation.id)
              .execute();
            console.log(`Added CFD: ${formationFromCatalogue.cfd} for formation ${formation.id}`);
            addedCfd++;
          } catch (e) {
            console.error(`Error adding CFD: ${formationFromCatalogue.cfd} for formation ${formation.id}`);
            console.error(e);
          }
        }
      }
    }
  }

  console.log(`Added ${addedCfd} CFDs`);
  process.exit(0);
};
