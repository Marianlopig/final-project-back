const bcrypt = require("bcrypt");
const User = require("../../database/models/User");
const userLogin = require("./userControllers");

const mocktoken = "123";
const mockNewUser = {
  _id: 3,
  username: "Pepita",
  password: "password",
};

jest.mock("jsonwebtoken", () => ({
  sign: () => mocktoken,
}));
jest.mock("../../database/models/User", () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(() => mockNewUser),
}));
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe("Given a userLogin function", () => {
  describe("When it is called", () => {
    test("Then it should call the response method with status 200 and the returned value should be the token", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockImplementation(() => true);
      bcrypt.compare.mockImplementation(() => true);

      const req = {
        body: {
          username: "Pepita",
          password: "password",
        },
      };
      const expectedStatus = 200;

      await userLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ token: mocktoken });
    });
  });

  describe("When it is called with a non existing user", () => {
    test("Then it should call the response method with status 401 and a json msg bad request", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.findOne.mockImplementation(() => false);

      const req = {
        body: {
          username: "Pepita",
          password: "password",
        },
      };
      const expectedStatus = 401;

      await userLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ msg: "bad request" });
    });
  });
});
