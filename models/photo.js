const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema({
  file: {
    type: String,
    required: true
  },
  showImg: {
    type: String
  },
  photoName: {
    type: String,
    required: true,
  },
  photoDescription: {
    type: String,
    required: true
  },
  photoPrice: {
    type: Number,
    required: true
  }
});

const Photo = mongoose.model("Photo", PhotoSchema);
module.exports = Photo;
