import logger from "../modules/logger";

const withoutSensibleFields = (obj: unknown, seen: Set<unknown>): unknown => {
  if (obj == null) return obj;

  if (typeof obj === "object") {
    if (seen.has(obj)) {
      return "(ref)";
    }

    seen.add(obj);

    if (Array.isArray(obj)) {
      return obj.map((v) => withoutSensibleFields(v, seen));
    }

    if (obj instanceof Set) {
      return Array.from(obj).map((v) => withoutSensibleFields(v, seen));
    }

    if (obj instanceof Map) {
      return withoutSensibleFields(Object.fromEntries(obj.entries()), seen);
    }

    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        const lower = key.toLowerCase();
        if (
          lower.indexOf("token") !== -1 ||
          ["email", "authorization", "password", "applicant_file_content"].includes(lower)
        ) {
          return [key, "*****"];
        }

        return [key, withoutSensibleFields(value, seen)];
      })
    );
  }

  if (typeof obj === "string") {
    // max 2Ko
    return obj.length > 2000 ? obj.substring(0, 2_000) + "..." : obj;
  }

  return obj;
};

export function logMiddleware() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req: any, res: any, next: any) => {
    const relativeUrl = (req.baseUrl || "") + (req.url || "");
    const startTime = new Date().getTime();

    const log = () => {
      try {
        const error = req.err;
        const statusCode = res.statusCode;
        const { type, response, request, ...data } = {
          type: "http",
          elapsedTime: new Date().getTime() - startTime,
          request: {
            requestId: req.requestId,
            method: req.method,
            headers: withoutSensibleFields(req.headers, new Set()),
            url: {
              relative: relativeUrl,
              path: (req.baseUrl || "") + (req.path || ""),
              parameters: withoutSensibleFields(req.query, new Set()),
            },
            body: typeof req.body === "object" ? withoutSensibleFields(req.body, new Set()) : null,
          },
          response: {
            statusCode,
            headers: typeof res.getHeaders === "function" ? withoutSensibleFields(res.getHeaders(), new Set()) : {},
          },
          ...(!error
            ? {}
            : {
                error: {
                  ...error,
                  message: error.message,
                  stack: error.stack,
                },
              }),
        };

        const level = error || (statusCode >= 400 && statusCode < 600) ? "error" : "info";

        if (level !== "error") {
          const { headers: _hRequ, ...requ } = request;
          const { headers: _hResp, ...resp } = response;
          logger[level](
            {
              ...data,
              request: {
                ...requ,
              },
              response: { ...resp },
            },
            `Http Request OK`
          );
        } else {
          logger[level]({ type, response, request, ...data }, `Http Request KO`);
        }
      } finally {
        res.removeListener("finish", log);
        res.removeListener("close", log);
      }
    };

    res.on("close", log);
    res.on("finish", log);

    next();
  };
}
