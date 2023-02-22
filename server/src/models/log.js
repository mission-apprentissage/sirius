const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    name: String,
    hostname: String,
    pid: Number,
    level: Number,
    msg: String,
    time: String,
    v: Number,
  },
  { minimize: false }
);

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
