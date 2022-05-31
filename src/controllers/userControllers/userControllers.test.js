const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../database/models/User");
const { userLogin, userRegister } = require("./userControllers");

const mockNewUser = {
  name: "Silvi",
  username: "silvi",
  password: "11111",
  _id: "sdjdksfwe54",
};

const expectedToken = "aaaa";

jest.mock("../../database/models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(() => mockNewUser),
}));

jest.mock("bcrypt", () => ({ compare: jest.fn(), hash: jest.fn() }));

describe("Given a loginUser function", () => {
  const req = {
    body: {
      username: "Marian",
      password: "marian",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When invoked with a req object with the correct username and password", () => {
    User.findOne = jest.fn().mockResolvedValue(true);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue(expectedToken);

    test("Then it should call res status method status with 200", async () => {
      const expectedStatus = 200;

      await userLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
    test("Then it should call the res json method with an object with the generated token like property", async () => {
      await userLogin(req, res);

      expect(res.json).toHaveBeenCalledWith({ token: expectedToken });
    });
  });

  describe("When invoked with a req object with an incorrect username", () => {
    test("Then it should call the next function", async () => {
      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue(false);

      await userLogin(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When invoked with a req object with a correct username and a wrong password", () => {
    test("Then it should call the next function", async () => {
      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue(true);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await userLogin(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a register user function", () => {
  describe("When it is called on", () => {
    test("Then it should call the response method with a status 201 and the name created user", async () => {
      const req = {
        body: { name: "Silvi", username: "silvi", password: "11111" },
      };

      User.findOne.mockImplementation(() => false);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const expectedStatus = 201;
      const expectedJson = { username: "silvi" };
      bcrypt.hash.mockImplementation(() => "hashedPassword");
      await userRegister(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });
  describe("When it is called with a user that is already in the database", () => {
    test("Then it should call the 'next' middleware with an error", async () => {
      const req = {
        body: { name: "Paco", username: "paco", password: "paco1" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockNext = jest.fn();
      User.findOne.mockImplementation(() => true);
      bcrypt.hash.mockImplementation(() => "hashedPassword");

      await userRegister(req, res, mockNext);
      const expectedError = new Error();
      expectedError.code = 409;
      expectedError.customMessage = "This user already exists...";

      expect(mockNext).toHaveBeenCalledWith(expectedError);
    });
  });
});
