const { Transform } = require("stream");
const { encodeStream } = require("iconv-lite");

module.exports = {
  encodeStream,
  encodeIntoUTF8: () => encodeStream("UTF-8"),
  transformObjectIntoCSV: (columns, options = {}) => {
    let lines = 0;
    let separator = options.separator || ";";
    return new Transform({
      objectMode: true,
      transform: function (chunk, encoding, callback) {
        try {
          if (lines++ === 0) {
            this.push(`${Object.keys(columns).join(separator)}\n`);
          }

          let line = Object.keys(columns)
            .map((key) => columns[key](chunk))
            .join(separator);
          this.push(`${line}\n`);
          callback();
        } catch (e) {
          callback(e);
        }
      },
    });
  },
};
