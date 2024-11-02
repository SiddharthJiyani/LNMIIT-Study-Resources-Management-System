const mongoose = require("mongoose");

const ytLinkSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  thumbnail: { 
    type: String,
  },
}, {
  timestamps: true,
});

const YTLink = mongoose.model("YTLink", ytLinkSchema);
module.exports = YTLink;
