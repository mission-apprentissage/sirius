import { config } from "dotenv";

export default async () => {
  return async () => {
    config({ path: "./server/.env.test" });

    try {
      if (process.env.CI) {
        return;
      }
      //
    } catch (e) {
      console.error(e);
    } finally {
      //
    }
  };
};
