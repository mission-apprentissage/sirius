/* eslint-disable @typescript-eslint/no-explicit-any */
import { publicConfig } from "../config.public";
import type { PathParam, QueryString, WithQueryStringAndPathParam } from "./generateUri";
import { generateUri } from "./generateUri";

type IResErrorJson = {
  data?: any;
  message: string;
  name: string;
  statusCode: number;
  code?: string | null | undefined;
};

async function optionsToFetchParams(method: RequestInit["method"], options: any) {
  const headers = await getHeaders(options);

  let body: BodyInit | undefined = undefined;
  if ("body" in options && method !== "GET") {
    if (options.body instanceof FormData) {
      body = options.body;
    } else {
      body = JSON.stringify(options.body);
      headers.append("Content-Type", "application/json");
    }
  }

  const requestInit: RequestInit = {
    mode: publicConfig.env === "local" ? "cors" : "same-origin",
    credentials: publicConfig.env === "local" ? "include" : "same-origin",
    body,
    method,
    headers,
  };
  return { requestInit, headers };
}

async function getHeaders(options: any) {
  const headers = new Headers();

  if ("headers" in options && options.headers) {
    const h = options.headers;
    Object.keys(h).forEach((name) => {
      headers.append(name, h[name]);
    });
  }

  try {
    if (!global.window) {
      // By default server-side we don't use headers
      // But we need them for the api, as all routes are authenticated
    }
  } catch (_error) {
    // We're in client, cookies will be includes
  }

  return headers;
}

const removeAtEnd = (url: string, removed: string): string =>
  url.endsWith(removed) ? url.slice(0, -removed.length) : url;

export function generateUrl(path: string, options: WithQueryStringAndPathParam = {}): string {
  const params = "params" in options ? options.params : {};
  const querystring = "querystring" in options ? options.querystring : {};
  return removeAtEnd(publicConfig.apiEndpoint, "/") + generateUri(trimApiPath(path), { params, querystring });
}

export interface ApiErrorContext {
  path: string;
  params: PathParam;
  querystring: QueryString;
  requestHeaders: Record<string, string | string[]>;
  statusCode: number;
  message: string;
  name: string;
  responseHeaders: Record<string, string | string[]>;
  errorData: unknown;
}

export class ApiError extends Error {
  context: ApiErrorContext;

  constructor(context: ApiErrorContext) {
    super();
    this.context = context;
    this.name = context.name;
    this.message = context.message;
  }

  toJSON(): ApiErrorContext {
    return this.context;
  }

  static async build(
    path: string,
    requestHeaders: Headers,
    options: WithQueryStringAndPathParam,
    res: Response
  ): Promise<ApiError> {
    let message = res.status === 0 ? "Network Error" : res.statusText;
    let name = "Api Error";
    let errorData: IResErrorJson["data"] | null = null;

    if (res.status > 0) {
      try {
        if (res.headers.get("Content-Type")?.startsWith("application/json")) {
          const data: IResErrorJson = await res.json();
          name = data.name;
          message = data.message;
          errorData = data.data;
        }
      } catch (_error) {
        // ignore
      }
    }

    return new ApiError({
      path,
      params: "params" in options && options.params ? options.params : {},
      querystring: "querystring" in options && options.querystring ? options.querystring : {},
      requestHeaders: Object.fromEntries(requestHeaders.entries()),
      statusCode: res.status,
      message,
      name,
      responseHeaders: Object.fromEntries(res.headers.entries()),
      errorData,
    });
  }
}

export async function apiPost(path: string, options: any): Promise<any> {
  const { requestInit, headers } = await optionsToFetchParams("POST", options);

  const res = await fetch(generateUrl(path, options), requestInit);

  if (!res.ok) {
    throw await ApiError.build(path, headers, options, res);
  }

  return res.json();
}

export async function apiPostFile(path: string, options: any): Promise<any> {
  const { requestInit, headers } = await optionsToFetchParams("POST", options);

  const res = await fetch(generateUrl(path, options), requestInit);

  if (!res.ok) {
    throw await ApiError.build(path, headers, options, res);
  }

  return res.blob();
}

export async function apiGet(path: string, options: any): Promise<any> {
  const { requestInit, headers } = await optionsToFetchParams("GET", options);

  const res = await fetch(generateUrl(path, options), requestInit);

  if (!res.ok) {
    throw await ApiError.build(path, headers, options, res);
  }

  return res.json();
}

export async function apiPut(path: string, options: any): Promise<any> {
  const { requestInit, headers } = await optionsToFetchParams("PUT", options);

  const res = await fetch(generateUrl(path, options), requestInit);

  if (!res.ok) {
    throw await ApiError.build(path, headers, options, res);
  }

  return res.json();
}

export async function apiPatch(path: string, options: any): Promise<any> {
  const { requestInit, headers } = await optionsToFetchParams("PATCH", options);
  const res = await fetch(generateUrl(path, options), requestInit);
  if (!res.ok) {
    throw await ApiError.build(path, headers, options, res);
  }
  return res.json();
}

export async function apiDelete(path: string, options: any): Promise<any> {
  const { requestInit, headers } = await optionsToFetchParams("DELETE", options);

  const res = await fetch(generateUrl(path, options), requestInit);

  if (!res.ok) {
    throw await ApiError.build(path, headers, options, res);
  }

  return res.json();
}

export function trimApiPath(path: string) {
  let result = path;

  // Check if the path starts with '/api'
  if (result.startsWith("/api")) {
    // Remove '/api' from the beginning
    result = result.slice(4);

    // If there's no leading '/', add it
    if (!result.startsWith("/")) {
      result = "/" + result;
    }
  }

  // Remove trailing '/' if present and the path is longer than 1 character
  if (result.length > 1 && result.endsWith("/")) {
    result = result.slice(0, -1);
  }

  return result;
}
