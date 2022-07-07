const upload = require("../middleware/uploade");
const dbConfig = require("../data-base/config");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const url = dbConfig.url;
const baseUrl = "http://localhost:4109/api/";

const mongoClient = new MongoClient(url);

const uploadFiles = async (req, res) => {
  try {
    await upload(req, res);
    if (req.file == undefined) {
      return res.send({
        message: "You must select a file."
      });
    }
    return res.send({
      message: "File has been uploaded."
    });
  } catch (error) {
    console.log(error);
    return res.send({
      message: "Error when trying upload image: ${error}"
    });
  }
};
const getFile = async (req, res) => {
  try {
    const { file } = req.params;
    await mongoClient.connect();
    const database = mongoClient.db(dbConfig.database);
    const documents = database.collection(dbConfig.docBucket + ".files");
    const retrievedFile = await documents.findOne(file);

    console.log(retrievedFile);
    if ((await documents.countDocuments()) === 0) {
      return res.status(500).send({
        message: "File is not found!"
      });
    }

    return res.status(200).send(retrievedFile);
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};

const getListFiles = async (req, res) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db(dbConfig.database);
    const documents = database.collection(dbConfig.docBucket + ".files");
    const cursor = documents.find({});

    if ((await documents.countDocuments()) === 0) {
      return res.status(500).send({
        message: "No files found!"
      });
    }
    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: `${baseUrl}/download?filename=${doc.filename}`,
        uploadDate: doc.uploadDate,
        downloads: doc.downloads,
        type: doc.contentType.split("/")[1]
      });
    });
    return res.status(200).send(fileInfos);
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};

const download = async (req, res) => {
  try {
    const { filename } = req.query;
    console.log(req.params);
    await mongoClient.connect();
    const database = mongoClient.db(dbConfig.database);
    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.docBucket
    });
    let downloadStream = bucket.openDownloadStreamByName(filename);
    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });
    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Document!" });
    });
    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};
module.exports = {
  uploadFiles,
  getFile,
  getListFiles,
  download
};
