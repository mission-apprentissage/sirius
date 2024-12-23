// @ts-nocheck -- TODO

import Slack from "@slack/bolt";

import config from "../config";

export const sendToSlack = async (main, thread_ts = null) => {
  if (!config.slack.token) return;
  if (!config.slack.channel) return;

  const slack = new Slack.App({
    token: config.slack.token,
    signingSecret: config.slack.signingSecret ?? "",
  });

  const messagePayload = {
    text: "",
    blocks: main,
    channel: config.slack.channel,
  };

  if (thread_ts) {
    messagePayload.thread_ts = thread_ts;
  }

  const sent = await slack.client.chat.postMessage(messagePayload);

  return sent;
};
