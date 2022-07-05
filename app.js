const express = require("express");
const shortId = require("shortId");
const createHttpError = require("http-errors");
const path = require("path");
const dbConnection = require("./services/data-base//dbConnection");
const router = require("./services/routes");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");

require("dotenv").config();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// start connection to mongo database
dbConnection();

//creating bucket
let bucket;
mongoose.connection.on("connected", () => {
  var db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "newBucket"
  });
});

const app = express();

app.use("/api", router);

// set up express generals
app.use(express.static(path.join(__dirname, "public")));

// app.use(async (req, res, next) => {
//   next(createHttpError.NotFound());
// });

// app.use(async (err, req, res, next) => {
//   res.status(err.status || 500);
//   res.send({ error: err.message });
// });

app.listen(4109, () => {
  console.log("... server is running on port 4109");
});
