import fs from "node:fs";
import { basename } from "node:path";

// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-import
import { defineConfig } from "tsup";

export default defineConfig((options) => {
  const isDev = options.env?.NODE_ENV !== "production";
  const isWatched = options.env?.TSUP_WATCH === "true";
  const migrationFiles = fs.readdirSync("./src/migrations");

  const entry: Record<string, string> = {
    index: "src/index.ts",
  };

  for (const file of migrationFiles) {
    entry[`migrations/${basename(file, ".ts")}`] = `src/migrations/${file}`;
  }

  return {
    entry,
    watch: isWatched ? ["./src"] : false,
    onSuccess: isWatched ? "yarn cli start" : "",
    // In watch mode doesn't exit cleanly as it causes EADDRINUSE error
    killSignal: "SIGKILL",
    target: "es2022",
    platform: "node",
    format: ["esm"],
    splitting: true,
    shims: false,
    minify: false,
    sourcemap: true,
    clean: true,
    env: {
      ...options.env,
    },
    esbuildOptions(options) {
      options.define = {
        ...options.define,
        "process.env.IS_BUILT": '"true"',
        "process.env.NODE_ENV": isDev ? '"developpement"' : '"production"',
      };
    },
  };
});
