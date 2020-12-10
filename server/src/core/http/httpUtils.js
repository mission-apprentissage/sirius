const { oleoduc, jsonStream } = require("oleoduc");
const { encodeStream, transformObjectIntoCSV } = require("../utils/streamUtils");

module.exports = {
  sendCSVStream: (csvStream, res, options = {}) => {
    let encoding = options.encoding || "UTF-8";

    res.setHeader("Content-disposition", `attachment; filename=${options.filename || "export.csv"}`);
    res.setHeader("Content-Type", `text/csv; charset=${encoding}`);

    return oleoduc(csvStream, transformObjectIntoCSV(), encodeStream(encoding), res);
  },
  sendJsonStream: (stream, res) => {
    res.setHeader("Content-Type", "application/json");
    return oleoduc(stream, jsonStream(), res);
  },
  sendHTML: (html, res) => {
    res.set("Content-Type", "text/html");
    res.send(Buffer.from(html));
  },
};
