const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { mongoose } = require("mongoose");
const connectDB = require("../../database");
const app = require("../../server");
const Park = require("../../database/models/Park");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

beforeEach(async () => {
  await Park.create({
    name: "Parque Bonito",
    description: "Un parque grande con muchas plantas",
    photos: ["photo.png"],
    location: {
      name: "aqui",
      type: "Point",
      coordinates: [46574, 45745],
    },
    details: ["agua", "fuentes"],
  });
});

afterEach(async () => {
  await Park.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a get /parks/list endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a 200 status code and a list of parks", async () => {
      const response = await request(app).get("/parks/list").expect(200);
      expect(response.body).not.toBeNull();
      expect(response.body.results.length).toBe(1);
    });
  });
});
