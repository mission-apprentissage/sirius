module.exports = () => (req, res, next) => {
  let url = (req.baseUrl || "") + (req.url || "");

  if (/^\/api\/questionnaires\/.*\/email$/.test(url)) {
    req.url = req.url.replace(new RegExp("/email"), "/previewEmail");
  }
  next("route");
};
