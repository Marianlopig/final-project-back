const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { mongoose } = require("mongoose");
const connectDB = require("../../database");
const Park = require("../../database/models/Park");
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

const id = mongoose.Types.ObjectId();

beforeEach(async () => {
  await Park.create({
    _id: id,
    name: "parque bonito",
    description: "un parque muy bonito",
    photos: ["photo1.png", "photo2.png"],
    location: {
      type: "Point",
      coordinates: [4567, 5764],
    },
    details: ["aga", "bar"],
    owner: "629e80d3c876d7dca85bf196",
    address: {
      city: "Barcelona",
    },
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
  describe("When it receives a request with filters", () => {
    test("Then it should return the matching results with the filters", async () => {
      const response = await request(app)
        .get(
          `/parks/list?ids=${id}&city=Barcelona&owner=629e80d3c876d7dca85bf196`
        )
        .expect(200);

      expect(response.body).not.toBeNull();
      expect(response.body.results.length).toBe(1);
    });
  });
});

describe("Given a DELETE '/parks/:id' endpoint", () => {
  describe("When in recieves a request with an Id and the resource it's found on the server", () => {
    test("Then it should respond with status 200 and a json with a msg 'Park deleted'", async () => {
      const expectedJson = { msg: "Park deleted" };

      const { body } = await request(app).delete(`/parks/${id}`).expect(200);

      expect(body).toEqual(expectedJson);
    });
  });

  describe("When it recieves a request without a parkId", () => {
    test("Then it should respond with status 404", async () => {
      const expectedJson = { error: true, message: "Unable to delete park" };

      const nonExistingId = mongoose.Types.ObjectId();

      const { body } = await request(app)
        .delete(`/parks/${nonExistingId}`)
        .expect(404);

      expect(body).toEqual(expectedJson);
    });
  });
});

describe("Given a POST '/' endpoint", () => {
  describe("When it receives a request with a park in the body and an auth", () => {
    test("Then it should create and return the created park", async () => {
      const requestBody = {
        name: "test park",
        description: "test desc",
        location: {
          type: "Point",
          coordinates: [123, 456],
        },
        details: ["Water"],
        address: {
          city: "Barcelona",
          address: "Calle 134",
        },
      };
      const response = await request(app).post(`/parks/`).send(requestBody);
      const { body } = response;

      expect(response.status).toBe(201);

      expect(body).not.toBe(null);
      expect(body.id).not.toBe(null);
      expect(body.name).toBe(requestBody.name);
      expect(body.description).toBe(requestBody.description);
      expect(body.location).toEqual(requestBody.location);
      expect(body.description).toBe(requestBody.description);
      expect(body.details).toEqual(requestBody.details);
      expect(body.description).toBe(requestBody.description);
      expect(body.address).toEqual(requestBody.address);
    });
  });
});
