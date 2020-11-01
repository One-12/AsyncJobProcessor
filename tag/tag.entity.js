const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true, unique: true },
  hitCount: { type: Number, default: 0 },
  lastHit: { type: Number, default: 0 }
});

module.exports = mongoose.model('tag', TagSchema);