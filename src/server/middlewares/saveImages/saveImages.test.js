const fs = require("fs");
const path = require("path");
const { saveImages } = require("./saveImages");

jest.mock("fs");
jest.mock("path");

describe("Given a saveImages middleware", () => {
  describe("When it is called with images", () => {
    test("Then it should rename the images in images folder and add the paths to the request", () => {
      const req = { files: [{ originalname: "test.jpg" }] };
      const next = jest.fn();

      fs.rename.mockImplementation(() => {});
      path.join.mockImplementation(() => {});

      saveImages(req, null, next);
      expect(req.imagePaths.length).toBe(1);
      expect(next).toBeCalled();
    });
  });

  describe("When it is fails renaming image", () => {
    test("Then call next with an error", () => {
      const req = { files: [{ originalname: "test.jpg" }] };
      const next = jest.fn();
      const error = new Error();
      fs.rename.mockImplementation((a, b, c) => {
        c(error);
      });
      path.join.mockImplementation(() => {});

      saveImages(req, null, next);
      expect(next).toBeCalledWith(error);
    });
  });
});
