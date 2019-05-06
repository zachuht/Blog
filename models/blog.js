var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
  username: String,
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});
var Blog = mongoose.model("Blog", blogSchema);
console.log(Blog);

module.exports = mongoose.model("Blog", blogSchema);