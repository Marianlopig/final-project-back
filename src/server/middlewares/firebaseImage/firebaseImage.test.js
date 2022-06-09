const firebase = require("firebase/storage");
const path = require("path");
const firebaseImageStore = require("./firebaseImage");

jest.mock("firebase/storage");
jest.mock("path");

describe("Given a firebase image middleware", () => {
  describe("When it receives an array of images", () => {
    test("Then it should store them in firebase storage", async () => {
      const req = { imagePaths: ["testpath.jpg"] };
      const next = jest.fn();

      path.join.mockImplementation(
        () => "src/server/middlewares/firebaseImage/firebaseImage.test.js"
      );

      firebase.uploadBytes.mockImplementation(() => {});
      firebase.getDownloadURL.mockImplementation(() => "testbackuppath.jpg");

      await firebaseImageStore(req, null, next);

      expect(req.imageBackupPath.length).toBe(1);
      expect(next).toBeCalled();
    });
  });
});
