module.exports = {
  sendHTML: (html, res) => {
    res.set("Content-Type", "text/html");
    res.send(Buffer.from(html));
  },
};
