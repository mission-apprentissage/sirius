import * as Sentry from "@sentry/node";

// import { nodeProfilingIntegration } from "@sentry/profiling-node";
import config from "../config";

function getOptions(): Sentry.NodeOptions {
  return {
    dsn: config.sentry.dsn,
    tracesSampleRate: config.env === "production" ? 0.1 : 1.0, //0.3 : 1.0,
    tracePropagationTargets: [/^https:\/\/[^/]*\.inserjeunes\.beta\.gouv\.fr/],
    profilesSampleRate: config.env === "production" ? 0.1 : 1.0,
    environment: config.env,
    release: config.version,
    enabled: config.env !== "local",
    integrations: [
      Sentry.httpIntegration(),
      Sentry.captureConsoleIntegration({ levels: ["error"] }),
      Sentry.extraErrorDataIntegration({ depth: 16 }),
      // // @ts-expect-error
      // nodeProfilingIntegration(),
      //integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app })],
    ],
  };
}

export function initSentry(): void {
  Sentry.init(getOptions());
}

export async function closeSentry(): Promise<void> {
  await Sentry.close(2_000);
}
