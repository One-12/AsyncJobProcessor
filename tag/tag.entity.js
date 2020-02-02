var mongoose = require("mongoose")
, schema = mongoose.Schema;

var TagSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true, unique: true }
});

module.exports	= mongoose.model('tag', TagSchema);