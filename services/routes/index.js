const {
  uploadFiles,
  getFile,
  getListFiles,
  download
} = require("./uploadFile");
const express = require("express");

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded());

router.post("/upload", uploadFiles);
router.get("/file", getFile);
router.get("/files", getListFiles);
router.get("/download", download);

module.exports = router;
