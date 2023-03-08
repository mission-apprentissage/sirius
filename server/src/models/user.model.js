const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { STRATEGIES } = require("../middlewares/verifyUserMiddleware");

const Session = new mongoose.Schema({
  refreshToken: {
    type: String,
    default: "",
  },
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    default: "",
    unique: true,
  },
  authStrategy: {
    type: String,
    default: STRATEGIES.local,
  },
  refreshToken: {
    type: [Session],
  },
});

//Remove refreshToken from the response
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.refreshToken;
    return ret;
  },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
