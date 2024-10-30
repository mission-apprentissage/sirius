export interface PublicConfig {
  sentry: {
    dsn: string;
  };
  host: string;
  baseUrl: string;
  apiEndpoint: string;
  env: "local" | "recette" | "production" | "next";
  version: string;
  productMeta: {
    brandName: "sirius";
    productName: string;
    repoName: string;
  };
}

function getProductionPublicConfig(): PublicConfig {
  const host = "sirius.inserjeunes.beta.gouv.fr";

  return {
    sentry: {
      dsn: "https://f97984280f4e4a4e8075e8b353b9234a@sentry.incubateur.net/153",
    },
    host,
    baseUrl: `https://${host}`,
    env: "production",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getNextPublicConfig(): PublicConfig {
  const host = "sirius-next.inserjeunes.beta.gouv.fr";

  return {
    sentry: {
      dsn: "https://f97984280f4e4a4e8075e8b353b9234a@sentry.incubateur.net/153",
    },
    host,
    baseUrl: `https://${host}`,
    env: "production",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getRecettePublicConfig(): PublicConfig {
  const host = "sirius-recette.inserjeunes.beta.gouv.fr";

  return {
    sentry: {
      dsn: "https://f97984280f4e4a4e8075e8b353b9234a@sentry.incubateur.net/153",
    },
    host,
    baseUrl: `https://${host}`,
    env: "recette",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getLocalPublicConfig(): PublicConfig {
  const host = "localhost";
  return {
    sentry: {
      dsn: "https://f97984280f4e4a4e8075e8b353b9234a@sentry.incubateur.net/153",
    },
    host,
    baseUrl: `http://${host}:3000`,
    env: "local",
    apiEndpoint: `http://${host}:${process.env.REACT_APP_API_PORT ?? 5000}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getVersion(): string {
  const version = process.env.REACT_APP_VERSION;

  if (!version) {
    throw new Error("missing REACT_APP_VERSION env-vars");
  }

  return version;
}

function getProductMeta(): PublicConfig["productMeta"] {
  const productName = process.env.REACT_APP_PRODUCT_NAME;

  if (!productName) {
    throw new Error("missing REACT_APP_PRODUCT_NAME env-vars");
  }

  const repoName = process.env.REACT_APP_PRODUCT_REPO;

  if (!repoName) {
    throw new Error("missing REACT_APP_PRODUCT_REPO env-vars");
  }

  return { productName, repoName, brandName: "sirius" };
}

function getEnv(): PublicConfig["env"] {
  const env = process.env.REACT_APP_ENV;
  switch (env) {
    case "production":
    case "recette":
    case "next":
    case "local":
      return env;
    default:
      throw new Error(`Invalid REACT_APP_ENV env-vars ${env}`);
  }
}

function getPublicConfig(): PublicConfig {
  switch (getEnv()) {
    case "production":
      return getProductionPublicConfig();
    case "recette":
      return getRecettePublicConfig();
    case "next":
      return getNextPublicConfig();
    case "local":
      return getLocalPublicConfig();
  }
}

export const publicConfig: PublicConfig = getPublicConfig();
