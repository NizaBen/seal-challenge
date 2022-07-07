const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

module.exports = async function () {
  try {
    var uri = "mongodb://localhost:27017/seal-documents";

    mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

    const connection = mongoose.connection;

    // Init gfs
    let gfs;

    connection.once("open", () => {
      console.log("MongoDB database connection established successfully");
      // Init stream
      gfs = Grid(connection.db, mongoose.mongo);
      gfs.collection("documents");
    });
  } catch (error) {
    console.log("Mongoose Error: ", error);
  }
};
