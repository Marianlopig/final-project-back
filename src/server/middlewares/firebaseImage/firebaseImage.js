/* eslint-disable no-await-in-loop */
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const fs = require("fs").promises;
const path = require("path");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: "marian-columpia.firebaseapp.com",
  projectId: "marian-columpia",
  storageBucket: "marian-columpia.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
};

const firebaseApp = initializeApp(firebaseConfig);

const saveImage = async (storage, file, fileName) => {
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

const firebaseImageStore = async (req, res, next) => {
  const storage = getStorage(firebaseApp);
  req.imageBackupPath = [];

  for (let i = 0; i < req.imagePaths.length; i += 1) {
    const data = await fs.readFile(path.join("images", req.imagePaths[i]));
    const firebaseFileURL = await saveImage(storage, data, req.imagePaths[i]);
    req.imageBackupPath.push(firebaseFileURL);
  }
  next();
};
module.exports = firebaseImageStore;
