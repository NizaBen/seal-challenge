const mongoose = require("mongoose");
const shortId = require("shortId");
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
  uploadDate: {
    type: Date,
    default: Date.now
  },
  filename: String,
  downloads: {
    type: Number,
    default: 0
  },
  shortLink: {
    type: String,
    default: shortId.generate
  }
});

const Document = mongoose.model("documents", DocumentSchema);

module.exports = Document;
