const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
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
    type: "number",
    required: true
  }
})