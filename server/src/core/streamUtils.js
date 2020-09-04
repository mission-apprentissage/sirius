const { Transform } = require("stream");
const { encodeStream } = require("iconv-lite");

module.exports = {
  encodeStream,
  encodeIntoUTF8: () => encodeStream("UTF-8"),
  transformObjectIntoCSV: (options = {}) => {
    let lines = 0;
    let separator = options.separator || ";";
    return new Transform({
      objectMode: true,
      transform: function (chunk, encoding, callback) {
        try {
          if (lines++ === 0) {
            let columnNames = Object.keys(chunk).join(separator);
            this.push(`${columnNames}\n`);
          }

          let line = Object.values(chunk).join(separator);
          this.push(`${line}\n`);
          callback();
        } catch (e) {
          callback(e);
        }
      },
    });
  },
};
