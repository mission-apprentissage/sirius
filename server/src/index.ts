import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

// eslint-disable-next-line node/no-unsupported-features/es-syntax
import("./modules/sentry.js")
  .then(async ({ initSentry }) => {
    initSentry();
  })
  .then(async () => {
    // Dynamic import to start server after env are loaded
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    return import("./main.js");
  });
