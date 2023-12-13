const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { STRATEGIES } = require("../middlewares/verifyUserMiddleware");
const { USER_ROLES, USER_STATUS } = require("../constants");

const Session = new mongoose.Schema({
  refreshToken: {
    type: String,
    default: "",
  },
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailConfirmed: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: USER_ROLES.ETABLISSEMENT,
    required: true,
  },
  status: {
    type: String,
    default: USER_STATUS.PENDING,
  },
  comment: {
    type: String,
    default: "",
  },
  etablissements: {
    type: Array,
    required: true,
  },
  authStrategy: {
    type: String,
    default: STRATEGIES.local,
  },
  refreshToken: {
    type: [Session],
  },
  siret: {
    type: String,
  },
  etablissement: {
    type: Object,
  },
  confirmationToken: {
    type: String,
  },
});

//Remove refreshToken from the response
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.refreshToken;
    return ret;
  },
});

const options = {
  usernameField: "email",
  errorMessages: {
    UserExistsError: "Un utilisateur avec cet email existe déjà",
  },
};

userSchema.plugin(passportLocalMongoose, options);

const User = mongoose.model("User", userSchema);

module.exports = User;
