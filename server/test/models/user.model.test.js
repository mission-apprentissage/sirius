const expect = require("chai").expect;

const UserModel = require("../../src/models/user.model");
const { newUser } = require("../fixtures");

describe(__filename, () => {
  it("should be invalid if required fields are empty", (done) => {
    const createdUser = new UserModel();

    createdUser.validate((err) => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.username).to.exist;
      done();
    });
  });

  it("should be valid if required fields are present", (done) => {
    const createdUser = new UserModel(newUser());

    createdUser.validate((err) => {
      expect(err).to.not.exist;
      done();
    });
  });
});
