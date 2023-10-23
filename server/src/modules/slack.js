const { App } = require("@slack/bolt");

const config = require("../config");

const sendToSlack = async (main, answer) => {
  if (!config.slack.channel) return;

  const slack = new App({
    token: config.slack.token,
    signingSecret: config.slack.signingSecret ?? "",
  });

  const sent = await slack.client.chat.postMessage({
    text: "",
    blocks: main,
    channel: config.slack.channel,
  });
  if (!answer) return;
  await slack.client.chat.postMessage({
    text: "",
    blocks: answer,
    thread_ts: sent.ts,
  });
};

module.exports = {
  sendToSlack,
};
