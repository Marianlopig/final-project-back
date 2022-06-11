const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../../database/models/User");
const connectDB = require("../../database");
const app = require("../..");

let mongoServer;

jest.mock("../../middlewares/auth/auth", () => ({
  auth: (req, res, next) => {
    req.user = { userId: "629e80d3c876d7dca85bf196" };
    next();
  },
}));

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

beforeEach(async () => {
  const encryptedPassword = await bcrypt.hash("password", 10);
  await User.create({
    _id: "629e80d3c876d7dca85bf196",
    username: "Marian",
    password: encryptedPassword,
    email: "email",
    name: "Marian",
    favParks: [mongoose.Types.ObjectId()],
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a post /users/login endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a 200 status code and a token", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          username: "Marian",
          password: "password",
        })
        .expect(200);
      expect(response.body.token).not.toBeNull();
    });
  });
});

describe("Given a post /users/register endpoint", () => {
  describe("When it receives a new user request", () => {
    test("Then it should respond with a 201 status code and a username", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({
          username: "Julia",
          password: "password",
          email: "test@test.com",
        })
        .expect(201);

      expect(response.body.username).toBe("Julia");
    });
  });

  describe("When it receives an already existing user request", () => {
    test("Then it should respond with a 200 status code and a token", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({
          username: "Marian",
          password: "password",
          email: "test@test.com",
        })
        .expect(409);

      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("This user already exists...");
    });
  });
});

describe("Given an account router", () => {
  describe("When it is requested by a user", () => {
    test("Then it should return the user without pasword", async () => {
      const { body } = await request(app).get("/users/account").expect(200);

      expect(body.id).toBe("629e80d3c876d7dca85bf196");
      expect(body.password).toBe(undefined);
      expect(body.username).toBe("Marian");
      expect(body.email).toBe("email");
      expect(body.name).toBe("Marian");
      expect(body.favParks.length).toBe(1);
    });
  });
});
