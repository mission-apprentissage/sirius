const { App } = require("@slack/bolt");

const config = require("../config");

const sendToSlack = async (main) => {
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

  return sent.ok;
};

module.exports = {
  sendToSlack,
};
