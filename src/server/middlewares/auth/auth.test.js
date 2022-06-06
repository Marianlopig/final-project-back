const jsonwebtoken = require("jsonwebtoken");
const customError = require("../../../utils/customError");
require("../../controllers/userControllers/userControllers");
const { auth } = require("./auth");

describe("Given an auth middleware", () => {
  describe("When there is no auth", () => {
    test("Then it should call next with error 401", () => {
      const req = {};
      const next = jest.fn();
      const expectedCall = customError(401, "Auth required");

      auth(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedCall);
    });
  });

  describe("When token is not valid", () => {
    test("Then it should call next with error 401", () => {
      const req = { headers: { authorization: "Bearer patata" } };
      const next = jest.fn();

      const expectedCall = customError(401, "Invalid token");

      auth(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedCall);
    });
  });

  describe("When token is valid", () => {
    test("Then it should call next", () => {
      const userData = {
        username: "test",
        name: "test",
        userId: "1",
      };
      const token = jsonwebtoken.sign(userData, process.env.JWT_SECRET);
      const req = { headers: { authorization: `Bearer ${token}` } };
      const next = jest.fn();

      auth(req, null, next);
      expect(req.user.username).toBe("test");
      expect(req.user.name).toBe("test");
      expect(req.user.userId).toBe("1");

      expect(next).toHaveBeenCalled();
    });
  });
});
