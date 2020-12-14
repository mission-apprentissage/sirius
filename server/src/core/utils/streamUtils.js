const { Transform } = require("stream");
const { encodeStream } = require("iconv-lite");

module.exports = {
  encodeStream,
  encodeIntoUTF8: () => encodeStream("UTF-8"),
  transformDataIntoCSV: (options = {}) => {
    let lines = 0;
    let separator = options.separator || ";";
    return new Transform({
      objectMode: true,
      transform: function (chunk, encoding, callback) {
        let columns = options.columns;

        try {
          if (lines++ === 0) {
            let columnNames = Object.keys(columns || chunk).join(separator);
            this.push(`${columnNames}\n`);
          }

          let values = columns ? Object.keys(columns).map((key) => columns[key](chunk)) : Object.values(chunk);
          let line = values.join(separator);
          this.push(`${line}\n`);
          callback();
        } catch (e) {
          callback(e);
        }
      },
    });
  },
};
