const Park = require("../../database/models/Park");
const { getParks } = require("./parkControllers");

jest.mock("../../database/models/Park", () => ({
  findOne: jest.fn(),
  find: jest.fn(),
}));

describe("Given a getParks function", () => {
  describe("When it is called", () => {
    test("Then it should call the response method with status 200 and it should return all parks", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Park.find.mockImplementation(() => [
        {
          _id: "1",
          name: "Parque Bonito",
          description: "Un parque grande con muchas plantas",
          photos: ["photo.png"],
          location: {
            type: "Point",
            coordinates: [46574, 5478],
          },
          details: ["agua", "fuentes"],
          owner: "",
        },
      ]);

      const expectedResponse = {
        page: 0,
        pageSize: 0,
        next: "",
        previous: "",
        results: [
          {
            id: "1",
            name: "Parque Bonito",
            description: "Un parque grande con muchas plantas",
            photos: ["photo.png"],
            location: {
              type: "Point",
              coordinates: [46574, 5478],
            },
            details: ["agua", "fuentes"],
            owner: "",
          },
        ],
      };
      const expectedStatus = 200;

      await getParks(null, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
