import { Readable } from "node:stream";

// eslint-disable-next-line node/no-unpublished-import
import request from "supertest";

import server from "../../../src/server.js";

export const getComponents = async (options = {}) => {
  return options;
};
export const cleanAll = async () => {
  return true;
};
export const randomize = (value: string) => `${value}-${Math.random().toString(36).substring(7)}`;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createStream = (content: any) => {
  const stream = new Readable({
    objectMode: true,
    // read() {},
  });

  stream.push(content);
  stream.push(null);

  return stream;
};

export const startServer = async () => {
  const app = await server();
  return request(app);
};
