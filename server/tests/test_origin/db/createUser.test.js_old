const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const User = require("../../src/models/user.model");
const createUser = require("../../src/db/createUser");

describe(__filename, () => {
  let mockUserRegister;
  let consoleLogSpy;

  beforeEach(() => {
    mockUserRegister = sinon.stub(User, "register");
    consoleLogSpy = sinon.spy(console, "log");
  });

  afterEach(() => {
    mockUserRegister.restore();
    consoleLogSpy.restore();
  });

  it("should call User.register with a new user and password", async () => {
    const email = "test@example.com";
    const password = "password123";
    const firstName = "John";
    const lastName = "Doe";
    const comment = "This is a test comment.";
    const etablissements = ["Etablissement1", "Etablissement2"];

    const userObj = new User({ email, firstName, lastName, comment, etablissements });
    mockUserRegister.resolves(userObj);

    const user = await createUser(email, password, firstName, lastName, comment, etablissements);

    expect(mockUserRegister.calledOnce).to.be.true;
    expect(mockUserRegister.calledWith(sinon.match.instanceOf(User), password)).to.be.true;
    expect(user).to.be.an.instanceof(User);
    expect(user.email).to.equal(email.toLowerCase());
    expect(user.firstName).to.equal(firstName);
    expect(user.lastName).to.equal(lastName);
    expect(user.comment).to.equal(comment);
    expect(user.etablissements).to.deep.equal(etablissements);
  });
  it("should log error when User.register throws", async () => {
    const email = "test@example.com";
    const password = "password123";
    const error = new Error("Registration failed");

    mockUserRegister.throws(error);

    await createUser(email, password);

    expect(consoleLogSpy).to.have.been.calledWith(error);
  });
});
