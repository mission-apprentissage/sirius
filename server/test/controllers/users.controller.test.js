const { use, expect } = require("chai");
const { stub, restore, match, reset } = require("sinon");
const sinonChai = require("sinon-chai");
const { mockRequest, mockResponse } = require("mock-req-res");
const { faker } = require("@faker-js/faker");
const ObjectId = require("mongoose").mongo.ObjectId;
const jwt = require("jsonwebtoken");
const mailer = require("../../src/modules/mailer");
const {
  createUser,
  loginUser,
  refreshTokenUser,
  getCurrentUser,
  logoutUser,
  getUsers,
  updateUser,
  forgotPassword,
  resetPassword,
  confirmUser,
} = require("../../src/controllers/users.controller");
const usersService = require("../../src/services/users.service");
const { BasicError, UnauthorizedError, UserAlreadyExistsError, ErrorMessage } = require("../../src/errors");
const { newUser } = require("../fixtures");
const { COOKIE_OPTIONS } = require("../../src/utils/authenticate.utils");
const config = require("../../src/config");
const { USER_STATUS } = require("../../src/constants");

use(sinonChai);

describe(__filename, () => {
  const req = mockRequest();
  const res = mockResponse();
  const next = stub();

  const user1 = newUser();

  afterEach(async () => {
    next.resetHistory();
    res.status.resetHistory();
    res.json.resetHistory();
    res.cookie.resetHistory();
    res.clearCookie.resetHistory();
    restore();
    reset();
  });
  describe("createUser", () => {
    let req, res, shootTemplateStub, jwtSignStub;

    beforeEach(() => {
      req = mockRequest({ body: newUser() });
      res = mockResponse();
      shootTemplateStub = stub().resolves();
      jwtSignStub = stub().returns("token");
      stub(jwt, "sign").callsFake(jwtSignStub);
      stub(mailer, "shootTemplate").callsFake(shootTemplateStub);
    });

    afterEach(() => {
      restore();
    });

    it("should create a new user and send confirmation email", async () => {
      stub(usersService, "createUser").resolves({ success: true, body: req.body });

      await createUser(req, res);

      expect(usersService.createUser).to.have.been.calledWith(req.body);
      expect(jwtSignStub).to.have.been.calledWith({ email: req.body.email }, config.auth.jwtSecret, {
        expiresIn: "1y",
      });
      expect(mailer.shootTemplate).to.have.been.calledWith({
        template: "confirm_user",
        subject: "Sirius : activation de votre compte",
        to: req.body.email,
        data: {
          confirmationToken: "token",
          recipient: {
            email: req.body.email,
            firstname: req.body.firstName,
            lastname: req.body.lastName,
          },
        },
      });
      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith(req.body);
    });

    it("should throw UserAlreadyExistsError if user already exists", async () => {
      stub(usersService, "createUser").resolves({ success: false, body: { name: "UserExistsError" } });

      await createUser(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(UserAlreadyExistsError);

      expect(usersService.createUser).to.have.been.calledWith(req.body);
      expect(jwtSignStub).not.to.have.been.called;
      expect(mailer.shootTemplate).not.to.have.been.called;
      expect(res.status).not.to.have.been.called;
      expect(res.json).not.to.have.been.called;
    });

    it("should throw BasicError if createUser fails for other reasons", async () => {
      stub(usersService, "createUser").resolves({ success: false });

      await createUser(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);

      expect(usersService.createUser).to.have.been.calledWith(req.body);
      expect(jwtSignStub).not.to.have.been.called;
      expect(mailer.shootTemplate).not.to.have.been.called;
      expect(res.status).not.to.have.been.called;
      expect(res.json).not.to.have.been.called;
    });
  });
  describe("loginUser", () => {
    it("should throw a BasicError if success is false", async () => {
      req.user = { _id: ObjectId(faker.database.mongodbObjectId()) };
      stub(usersService, "loginUser").returns({ success: false });

      await loginUser(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
    it("should returns the cookie and token if success is true", async () => {
      req.user = { _id: ObjectId(faker.database.mongodbObjectId()) };

      const token = faker.datatype.uuid();
      const refreshToken = faker.datatype.uuid();

      stub(usersService, "loginUser").returns({
        success: true,
        body: { token, refreshToken },
      });

      await loginUser(req, res, next);

      expect(res.cookie).to.have.been.calledWith("refreshToken", refreshToken, COOKIE_OPTIONS);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(match({ success: true, token }));
    });
  });
  describe("refreshTokenUser", () => {
    it("should throw an UnauthorizedError if there is no refreshToken in payload", async () => {
      await refreshTokenUser(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(UnauthorizedError);
    });
    it("should throw a BasicError if success is false", async () => {
      req.signedCookies = { refreshToken: faker.datatype.uuid() };

      stub(usersService, "refreshTokenUser").returns({ success: false });

      await refreshTokenUser(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
    it("should returns the cookie and token if success is true", async () => {
      req.signedCookies = { refreshToken: faker.datatype.uuid() };

      const token = faker.datatype.uuid();
      const newRefreshToken = faker.datatype.uuid();

      stub(usersService, "refreshTokenUser").returns({
        success: true,
        body: { token, newRefreshToken: newRefreshToken },
      });

      await refreshTokenUser(req, res, next);

      expect(res.cookie).to.have.been.calledWith("refreshToken", newRefreshToken, COOKIE_OPTIONS);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({ success: true, token });
    });
  });
  describe("getCurrentUser", () => {
    it("should returns the user with status 200", async () => {
      req.user = user1;

      await getCurrentUser(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(user1);
    });
  });
  describe("logoutUser", () => {
    it("should throw an UnauthorizedError if there is no refreshToken in payload", async () => {
      req.signedCookies = { refreshToken: null };
      await logoutUser(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(UnauthorizedError);
    });
    it("should throw a BasicError if success is false", async () => {
      req.signedCookies = { refreshToken: faker.datatype.uuid() };
      req.user = user1;

      stub(usersService, "logoutUser").returns({ success: false });

      await logoutUser(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
    });
    it("should remove the cookie if success is true", async () => {
      req.signedCookies = { refreshToken: faker.datatype.uuid() };
      req.user = user1;

      stub(usersService, "logoutUser").returns({
        success: true,
      });

      await logoutUser(req, res, next);

      expect(res.clearCookie).to.have.been.calledWith("refreshToken", COOKIE_OPTIONS);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({ success: true });
    });
  });
  describe("getUsers", () => {
    it("should return a list of users", async () => {
      const users = [{ name: "John Doe" }, { name: "Jane Doe" }];

      stub(usersService, "getUsers").resolves({ success: true, body: users });

      await getUsers(req, res);

      expect(usersService.getUsers).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(users);
    });

    it("should throw a BasicError if getUsers fails", async () => {
      stub(usersService, "getUsers").resolves({ success: false });

      await getUsers(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);

      expect(usersService.getUsers).to.have.been.calledOnce;
      expect(res.status).not.to.have.been.called;
      expect(res.json).not.to.have.been.called;
    });
  });
  describe("updateUser", () => {
    let req, res, shootTemplateStub, getUserByIdStub, updateUserStub;

    beforeEach(() => {
      req = mockRequest({ body: newUser({ status: USER_STATUS.ACTIVE }) });
      res = mockResponse();
      shootTemplateStub = stub().resolves();
      stub(mailer, "shootTemplate").callsFake(shootTemplateStub);
      getUserByIdStub = stub(usersService, "getUserById");
      updateUserStub = stub(usersService, "updateUser");
    });

    afterEach(() => {
      restore();
    });

    it("should update a user and send activation email if user status is updated to active", async () => {
      const oldUser = { ...newUser(), status: USER_STATUS.PENDING };
      const updatedUser = { ...oldUser, status: USER_STATUS.ACTIVE };
      getUserByIdStub.resolves({ success: true, body: oldUser });
      updateUserStub.resolves({ success: true, body: updatedUser });

      await updateUser(req, res, next);

      expect(getUserByIdStub).to.have.been.calledWith(req.params.id);
      expect(updateUserStub).to.have.been.calledWith(req.params.id, req.body);
      expect(shootTemplateStub).to.have.been.calledWith({
        template: "account_activated",
        subject: "Sirius : votre inscription est validée",
        to: oldUser.email,
        data: {
          recipient: {
            email: oldUser.email,
            firstname: oldUser.firstName,
            lastname: oldUser.lastName,
          },
        },
      });
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(updatedUser);
    });
    it("should throw a BasicError if updateUser fails", async () => {
      getUserByIdStub.resolves({ success: true, body: newUser() });
      updateUserStub.resolves({ success: false });

      await updateUser(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);

      expect(getUserByIdStub).to.have.been.calledWith(req.params.id);
      expect(updateUserStub).to.have.been.calledWith(req.params.id, req.body);
      expect(shootTemplateStub).not.to.have.been.called;
      expect(res.status).not.to.have.been.called;
      expect(res.json).not.to.have.been.called;
    });
    it("should not send activation email if user status is not updated to active", async () => {
      const oldUser = { ...newUser(), status: USER_STATUS.ACTIVE };
      const updatedUser = { ...oldUser, firstName: "New Name" };
      getUserByIdStub.resolves({ success: true, body: oldUser });
      updateUserStub.resolves({ success: true, body: updatedUser });

      await updateUser(req, res);

      expect(getUserByIdStub).to.have.been.calledWith(req.params.id);
      expect(updateUserStub).to.have.been.calledWith(req.params.id, req.body);
      expect(shootTemplateStub).not.to.have.been.called;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(updatedUser);
    });

    it("should throw a BasicError if getUserById fails", async () => {
      getUserByIdStub.resolves({ success: false });

      await updateUser(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);

      expect(getUserByIdStub).to.have.been.calledWith(req.params.id);
      expect(updateUserStub).not.to.have.been.called;
      expect(shootTemplateStub).not.to.have.been.called;
      expect(res.status).not.to.have.been.called;
      expect(res.json).not.to.have.been.called;
    });
  });
  describe("forgotPassword", () => {
    let req, res, shootTemplateStub, jwtSignStub;

    beforeEach(() => {
      req = mockRequest({ body: { email: "test@example.fr" } });
      res = mockResponse();
      shootTemplateStub = stub().resolves();
      jwtSignStub = stub().returns("token");
      stub(jwt, "sign").callsFake(jwtSignStub);
      stub(mailer, "shootTemplate").callsFake(shootTemplateStub);
    });

    afterEach(() => {
      restore();
    });

    it("should send a reset password email and return success true if user is found", async () => {
      const user = { email: "test@example.fr", firstName: "John", lastName: "Doe" };
      stub(usersService, "forgotPassword").resolves({ success: true, body: user });

      await forgotPassword(req, res);

      expect(usersService.forgotPassword).to.have.been.calledWith(req.body.email);
      expect(jwtSignStub).to.have.been.calledWith({ email: user.email }, config.auth.jwtSecret, {
        expiresIn: "1h",
      });
      expect(mailer.shootTemplate).to.have.been.calledWith({
        template: "reset_password",
        subject: "Sirius : réinitialisation du mot de passe",
        to: user.email,
        data: {
          resetPasswordToken: "token",
          recipient: {
            email: user.email,
            firstname: user.firstName,
            lastname: user.lastName,
          },
        },
      });
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({ success: true });
    });

    it("should return success true if user is not found", async () => {
      stub(usersService, "forgotPassword").resolves({ success: false, body: ErrorMessage.UserNotFound });

      await forgotPassword(req, res);

      expect(usersService.forgotPassword).to.have.been.calledWith(req.body.email);
      expect(jwtSignStub).not.to.have.been.called;
      expect(mailer.shootTemplate).not.to.have.been.called;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({ success: true });
    });

    it("should throw a BasicError if forgotPassword fails for other reasons", async () => {
      stub(usersService, "forgotPassword").resolves({ success: false });

      await forgotPassword(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);

      expect(usersService.forgotPassword).to.have.been.calledWith(req.body.email);
      expect(jwtSignStub).not.to.have.been.called;
      expect(mailer.shootTemplate).not.to.have.been.called;
      expect(res.status).not.to.have.been.called;
      expect(res.json).not.to.have.been.called;
    });
  });
  describe("resetPassword", () => {
    let req, res;

    beforeEach(() => {
      req = mockRequest({
        body: {
          token: "valid_token",
          password: "new_password",
        },
      });
      res = mockResponse();
    });

    afterEach(() => {
      restore();
    });

    it("should reset the password and return a success message", async () => {
      stub(usersService, "resetPassword").resolves({ success: true });

      await resetPassword(req, res);

      expect(usersService.resetPassword).to.have.been.calledWith(req.body.token, req.body.password);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({ success: true });
    });

    it("should throw an UnauthorizedError if the user is not found", async () => {
      stub(usersService, "resetPassword").resolves({ success: false, body: ErrorMessage.UserNotFound });

      await resetPassword(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(UnauthorizedError);
      expect(usersService.resetPassword).to.have.been.calledWith(req.body.token, req.body.password);
      expect(res.status).not.to.have.been.called;
      expect(res.json).not.to.have.been.called;
    });

    it("should throw a BasicError if the password reset fails for other reasons", async () => {
      stub(usersService, "resetPassword").resolves({ success: false });

      await resetPassword(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
      expect(usersService.resetPassword).to.have.been.calledWith(req.body.token, req.body.password);
      expect(res.status).not.to.have.been.called;
      expect(res.json).not.to.have.been.called;
    });
  });
  describe("confirmUser", () => {
    let req, res;

    beforeEach(() => {
      req = mockRequest({ body: { token: "valid_token" } });
      res = mockResponse();
    });

    afterEach(() => {
      restore();
    });

    it("should return a success response if the user is confirmed", async () => {
      stub(usersService, "confirmUser").resolves({ success: true });

      await confirmUser(req, res, next);

      expect(usersService.confirmUser).to.have.been.calledWith(req.body.token);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({ success: true });
    });

    it("should throw an UnauthorizedError if the user is not found", async () => {
      stub(usersService, "confirmUser").resolves({ success: false, body: ErrorMessage.UserNotFound });

      await confirmUser(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(UnauthorizedError);
      expect(usersService.confirmUser).to.have.been.calledWith(req.body.token);
      expect(res.status).not.to.have.been.called;
      expect(res.json).not.to.have.been.called;
    });

    it("should throw a BasicError if the confirmation fails for other reasons", async () => {
      stub(usersService, "confirmUser").resolves({ success: false });

      await confirmUser(req, res, next);

      expect(next.getCall(0).args[0]).to.be.an.instanceof(BasicError);
      expect(usersService.confirmUser).to.have.been.calledWith(req.body.token);
      expect(res.status).not.to.have.been.called;
      expect(res.json).not.to.have.been.called;
    });
  });
});
