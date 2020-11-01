const mongoose = require("mongoose");

const userSchema = {
    uid: { type: String, required: true },
    followers: { type: [String], default: [] },
    following: { type: [String], default: [] },
    email: { type: String },
    points: { type: Number, default: 1 },
};

module.exports = mongoose.model("users", userSchema);
