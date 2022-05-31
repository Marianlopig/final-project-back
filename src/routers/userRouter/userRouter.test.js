const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../../database/models/User");
const connectDB = require("../../database");
const app = require("../../server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

beforeEach(async () => {
  const encryptedPassword = await bcrypt.hash("password", 10);
  await User.create({
    username: "Marian",
    password: encryptedPassword,
    email: "email",
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
