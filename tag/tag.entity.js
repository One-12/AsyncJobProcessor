const mongoose = require("mongoose"); 

const TagSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true, unique: true }
});

module.exports	= mongoose.model('tag', TagSchema);