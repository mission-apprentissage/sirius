import { isBoom } from "@hapi/boom";
import type { Logger as PinoLogger } from "pino";
// eslint-disable-next-line import/no-extraneous-dependencies
import { pino } from "pino";

import config from "../config";

function logFormatter(obj: unknown, seen: Set<unknown>): unknown {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (obj instanceof RegExp) {
    return obj.toString();
  }

  if (seen.has(obj)) {
    return "[Circular]";
  }
  seen.add(obj);

  if (obj instanceof Error) {
    const data: Record<string, unknown> = {
      message: obj.message,
      stack: obj.stack,
      cause: logFormatter(obj.cause, seen),
    };

    if (isBoom(obj)) {
      data.isBoom = true;
      data.isServer = obj.isServer;
      data.output = obj.output;
      data.data = logFormatter(obj.data, seen);
    }

    return data;
  }

  if (Array.isArray(obj)) {
    return obj.map((e) => logFormatter(e, seen));
  }

  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      acc[key] = logFormatter(value, seen);

      return acc;
    },
    {} as Record<string, unknown>
  );
}

function getTransport() {
  if (config.log.type === "console") {
    return {
      target: "pino-pretty",
      options: {
        levelFirst: true,
        colorize: true,
        messageKey: "message",
        messageFormat: "{if module} [{module}] - {end} {message}",
      },
    };
  }

  return {
    target: "pino/file",
  };
}

interface ILogger {
  debug(msg: string): unknown;
  info(data: Record<string, unknown>, msg: string): unknown;
  info(msg: string): unknown;
  child(data: Record<string, unknown>): ILogger;
  error(data: Record<string, unknown>, msg: string | Error): unknown;
}

export function createJobProcessorLogger(logger: PinoLogger<never>): ILogger {
  return {
    debug(msg: string) {
      logger.debug(msg);
    },
    info(data: Record<string, unknown> | string, msg?: string) {
      logger.info(data, msg);
    },
    child(data) {
      return createJobProcessorLogger(logger.child(data));
    },
    error(data: Record<string, unknown>, msg: string | Error) {
      if (msg instanceof Error) {
        logger.error({ error: msg, data });
      } else {
        logger.error(data, msg);
      }
    },
  };
}

export default pino({
  name: config.productName,
  level: config.log.level,
  enabled: process.env.NODE_ENV !== "test",
  depthLimit: 50,
  transport: getTransport(),
  messageKey: "message",
  formatters: {
    log(data: Record<string, unknown>): Record<string, unknown> {
      return logFormatter(data, new Set()) as Record<string, unknown>;
    },
  },
  serializers: {
    err: (err) => err,
  },
});