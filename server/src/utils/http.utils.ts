// @ts-nocheck -- TODO

export const sendHTML = (html, res) => {
  res.set("Content-Type", "text/html");
  res.send(Buffer.from(html));
};
