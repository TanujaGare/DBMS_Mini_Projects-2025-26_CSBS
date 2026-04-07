// models/user.js
// User model with passport-local-mongoose for hashing and authentication

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// passportLocalMongoose adds: username, hash, salt fields + helper methods
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
