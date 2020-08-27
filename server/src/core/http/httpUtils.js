const { oleoduc } = require("oleoduc");
const { encodeStream } = require("../streamUtils");

module.exports = {
  sendCSVStream: (csvStream, res, options = {}) => {
    let encoding = options.encoding || "UTF-8";

    res.setHeader("Content-disposition", `attachment; filename=${options.filename || "export.csv"}`);
    res.setHeader("Content-Type", `text/csv; charset=${encoding}`);

    return oleoduc(csvStream, encodeStream(encoding), res);
  },
  sendJsonStream: (stream, res) => {
    res.setHeader("Content-Type", "application/json");
    return oleoduc(stream, res);
  },
  sendHTML: (html, res) => {
    res.set("Content-Type", "text/html");
    res.send(Buffer.from(html));
  },
};
