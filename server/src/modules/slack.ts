import Slack from "@slack/bolt";

import config from "../config";

interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
}

export const sendToSlack = async (main: SlackBlock[], thread_ts: string | undefined = undefined) => {
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
    thread_ts: thread_ts,
  };

  const sent = await slack.client.chat.postMessage(messagePayload);

  return sent;
};
