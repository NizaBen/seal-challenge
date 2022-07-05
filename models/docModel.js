const mongoose = require("mongoose");
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
  }
});

const Document = mongoose.model("documents", DocumentSchema);

module.exports = Document;
